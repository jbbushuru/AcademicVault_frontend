import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useAcademic } from './AcademicContext';
import * as Notifications from 'expo-notifications';

// Configure how notifications appear when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  }),
});

const SETTINGS_KEY = 'timetable_settings';
const LESSONS_KEY = 'timetable_lessons';

export interface LessonData {
    unitName: string;
    time?: string;
    venue?: string;
    lecturer?: string;
    repeat: 'never' | 'weekly' | 'bi-weekly';
    sourceDate?: string;
    updatedAt?: number;
}

export interface TimetableSettings {
    maxLessons: number;
    lessonDuration: number;
    firstLessonStartTime: number;
    hasOnboarded: boolean;
    notificationsEnabled: boolean;
    alertLeadTime: number;
    updatedAt?: number;
}

export type TTView = 'Daily' | 'Weekly';

interface TimetableContextType {
    currentDate: Date;
    lessons: Record<string, Record<number, LessonData>>;
    settings: TimetableSettings;
    view: TTView;
    setCurrentDate: (date: Date) => void;
    setLessons: React.Dispatch<React.SetStateAction<Record<string, Record<number, LessonData>>>>;
    setView: (view: TTView) => void;
    updateSettings: (newSettings: Partial<TimetableSettings>) => Promise<void>;
    
    // Helpers/Actions
    getDateKey: (date: Date) => string;
    changeDate: (days: number) => void;
    getCurrentDayLessons: (date?: Date) => Record<number, LessonData>;
    saveLesson: (slot: number, formData: LessonData, dateKey: string, cascade: boolean, sourceKey?: string | null) => void;
    removeLesson: (slot: number, dateKey: string, currentDayLessons: Record<number, LessonData>, removeAll?: boolean) => void;
    resetTimetable: (onSuccess?: () => void) => void;
    clearAllLessons: () => void;
}

const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

export const TimetableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { fetchWithAuth } = useAcademic();
    // State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<TTView>('Daily');
    const [lessons, setLessons] = useState<Record<string, Record<number, LessonData>>>({});
    const [settings, setSettings] = useState<TimetableSettings>({
        maxLessons: 5,
        lessonDuration: 90,
        firstLessonStartTime: 8,
        hasOnboarded: false,
        notificationsEnabled: true,
        alertLeadTime: 15
    });

    // Load persisted data (DB + Local fallback)
    useEffect(() => {
        const loadPersistedData = async () => {
            try {
                // 1. Load Settings with Smart Merge
                const savedSettingsStr = await SecureStore.getItemAsync(SETTINGS_KEY);
                const localSettings = savedSettingsStr ? JSON.parse(savedSettingsStr) : null;

                const dbSettingsRes = await fetchWithAuth('/api/timetable/settings');
                if (dbSettingsRes.ok) {
                    const dbSettings = await dbSettingsRes.json();
                    
                    const localUpdated = localSettings?.updatedAt || 0;
                    const dbUpdated = new Date(dbSettings.updatedAt || 0).getTime();

                    if (localSettings && localUpdated > dbUpdated) {
                        // Phone is newer, PUSH to cloud
                        setSettings(localSettings);
                        fetchWithAuth('/api/timetable/settings', {
                            method: 'PATCH',
                            body: JSON.stringify(localSettings)
                        }).catch(e => console.error('Background settings push failed', e));
                    } else {
                        // Cloud is newer (or same), pull from cloud
                        setSettings(dbSettings);
                        await SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify(dbSettings));
                    }
                } else {
                    // Fallback to local
                    if (localSettings) setSettings(localSettings);
                }

                // 2. Load lessons with Smart Merge
                const savedLessonsStr = await SecureStore.getItemAsync(LESSONS_KEY);
                const localLessons: Record<string, Record<number, LessonData>> = savedLessonsStr ? JSON.parse(savedLessonsStr) : {};
                
                const dbLessonsRes = await fetchWithAuth('/api/timetable/lessons');
                if (dbLessonsRes.ok) {
                    const dbLessonsRaw = await dbLessonsRes.json();
                    
                    // Transform DB array to our local structure
                    const dbLessons: Record<string, Record<number, LessonData>> = {};
                    dbLessonsRaw.forEach((l: any) => {
                        const { dateKey, slot, user, _id, __v, ...data } = l;
                        if (!dbLessons[dateKey]) dbLessons[dateKey] = {};
                        dbLessons[dateKey][slot] = data;
                    });

                    // THE MERGE: Compare timestamps
                    const merged = { ...localLessons };
                    const toPush: any[] = [];

                    // 1. Check Cloud changes vs Local
                    dbLessonsRaw.forEach((dbL: any) => {
                        const localItem = localLessons[dbL.dateKey]?.[dbL.slot];
                        const dbUpdatedAt = new Date(dbL.updatedAt).getTime();
                        
                        if (!localItem || dbUpdatedAt > (localItem.updatedAt || 0)) {
                            // Cloud is newer or missing locally
                            if (!merged[dbL.dateKey]) merged[dbL.dateKey] = {};
                            const { dateKey, slot, user, _id, __v, ...data } = dbL;
                            merged[dbL.dateKey][dbL.slot] = { ...data, updatedAt: dbUpdatedAt };
                        }
                    });

                    // 2. Check Local changes vs Cloud
                    Object.keys(localLessons).forEach(dateKey => {
                        Object.keys(localLessons[dateKey]).forEach(slotStr => {
                            const slot = parseInt(slotStr);
                            const localL = localLessons[dateKey][slot];
                            const dbL = dbLessons[dateKey]?.[slot];

                            if (!dbL || (localL.updatedAt || 0) > new Date(dbL.updatedAt || 0).getTime()) {
                                // Phone is newer or missing in cloud -> Queue for Push
                                toPush.push({ dateKey, slot, ...localL });
                            }
                        });
                    });

                    setLessons(merged);
                    await SecureStore.setItemAsync(LESSONS_KEY, JSON.stringify(merged));

                    // 3. Push local-only changes to Cloud (Bulk)
                    if (toPush.length > 0) {
                        fetchWithAuth('/api/timetable/lessons/bulk', {
                            method: 'POST',
                            body: JSON.stringify({ lessons: toPush })
                        }).catch(e => console.error('Background sync push failed', e));
                    }
                } else {
                    // Offline fallback
                    setLessons(localLessons);
                }
            } catch (err) {
                console.error('Failed to load timetable data', err);
            }
        };
        loadPersistedData();
    }, [fetchWithAuth]);

    // Persist lessons whenever they change
    useEffect(() => {
        const persistLessons = async () => {
            try {
                await SecureStore.setItemAsync(LESSONS_KEY, JSON.stringify(lessons));
            } catch (err) {
                console.error('Failed to persist lessons', err);
            }
        };
        if (Object.keys(lessons).length > 0) persistLessons();
    }, [lessons]);

    const rescheduleAllAlerts = async (currentSettings: TimetableSettings, currentLessons: Record<string, Record<number, LessonData>>) => {
        await Notifications.cancelAllScheduledNotificationsAsync();
        if (!currentSettings.notificationsEnabled) return;
        
        Object.keys(currentLessons).forEach(dateKey => {
            Object.keys(currentLessons[dateKey]).forEach(slotStr => {
                const slot = parseInt(slotStr);
                const lesson = currentLessons[dateKey][slot];
                if (lesson.unitName !== '__HIDDEN__') {
                    // background async schedule
                    scheduleLessonAlert(lesson, dateKey, slot, currentSettings).catch(console.error);
                }
            });
        });
    };

    const updateSettings = async (newSettings: Partial<TimetableSettings>) => {
        const updated = { ...settings, ...newSettings, updatedAt: Date.now() };
        setSettings(updated);

        // Process notification global toggle
        if (newSettings.notificationsEnabled !== undefined || newSettings.alertLeadTime !== undefined) {
            rescheduleAllAlerts(updated, lessons);
        }

        // 1. Persist Locally
        try {
            await SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify(updated));
        } catch (err) {
            console.error('Local persist error:', err);
        }

        // 2. Persist to DB
        try {
            await fetchWithAuth('/api/timetable/settings', {
                method: 'PATCH',
                body: JSON.stringify(newSettings)
            });
        } catch (err) {
            console.error('DB sync error:', err);
        }
    };

    const oneDayMs = 24 * 60 * 60 * 1000;

    const scheduleLessonAlert = async (lesson: LessonData, dateKey: string, slot: number, currentSettings = settings) => {
        if (!currentSettings.notificationsEnabled) return;
        
        const identifier = `${dateKey}_${slot}`;
        await Notifications.cancelScheduledNotificationAsync(identifier);

        const lessonDate = new Date(dateKey);
        // Start time = firstLessonStartTime(hours) + (slot - 1) * duration(mins)
        const lessonStartTimeMins = (currentSettings.firstLessonStartTime * 60) + ((slot - 1) * currentSettings.lessonDuration);
        const triggerMins = lessonStartTimeMins - currentSettings.alertLeadTime;
        
        lessonDate.setHours(Math.floor(triggerMins / 60), triggerMins % 60, 0, 0);

        // If it's in the past and doesn't repeat, don't schedule
        if (lessonDate.getTime() < Date.now() && lesson.repeat === 'never') return;

        let trigger: Notifications.NotificationTriggerInput = {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: lessonDate,
        };
        
        if (lesson.repeat === 'weekly') {
            trigger = {
                type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
                weekday: lessonDate.getDay() + 1, // expo uses 1=Sunday, 7=Saturday
                hour: lessonDate.getHours(),
                minute: lessonDate.getMinutes(),
                repeats: true,
            };
        }

        await Notifications.scheduleNotificationAsync({
            identifier,
            content: {
                title: 'Upcoming Lesson',
                body: `${lesson.unitName} starts in ${currentSettings.alertLeadTime} minutes at ${lesson.venue || 'TBA'}`,
            },
            trigger,
        });
    };

    const cancelLessonAlert = async (dateKey: string, slot: number) => {
        await Notifications.cancelScheduledNotificationAsync(`${dateKey}_${slot}`);
    };

    // Helper to get a stable key for each date
    const getDateKey = useCallback((date: Date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.toISOString().split('T')[0];
    }, []);

    const changeDate = (days: number) => {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + days);
        setCurrentDate(nextDate);
    };

    const getCurrentDayLessons = useCallback((date?: Date) => {
        const targetDate = date || currentDate;
        const targetKey = getDateKey(targetDate);
        const currentMs = new Date(targetKey).getTime();
        
        const result: Record<number, LessonData> = {};
        const sortedKeys = Object.keys(lessons).sort();

        sortedKeys.forEach(savedDateKey => {
            const savedMs = new Date(savedDateKey).getTime();
            if (savedMs <= currentMs) {
                const dayDiff = Math.round((currentMs - savedMs) / oneDayMs);
                const dayLessons = lessons[savedDateKey];

                Object.keys(dayLessons).forEach(slotStr => {
                    const slot = parseInt(slotStr);
                    const lesson = dayLessons[slot];

                    let applies = false;
                    if (savedDateKey === targetKey) {
                        applies = true;
                    } else if (lesson.repeat === 'weekly' && dayDiff % 7 === 0) {
                        applies = true;
                    } else if (lesson.repeat === 'bi-weekly' && dayDiff % 14 === 0) {
                        applies = true;
                    }

                    if (applies) {
                        if (lesson.unitName === '__HIDDEN__') {
                            delete result[slot];
                        } else {
                            result[slot] = { ...lesson, sourceDate: savedDateKey };
                        }
                    }
                });
            }
        });
        return result;
    }, [lessons, currentDate, getDateKey]);

    const saveLesson = async (slot: number, formData: LessonData, dateKey: string, cascade: boolean, sourceKey?: string | null) => {
        const targetKey = cascade && sourceKey ? sourceKey : dateKey;
        const currentDayLessons = getCurrentDayLessons(new Date(dateKey));
        const isNew = !currentDayLessons[slot];
        const finalRepeat = (!isNew && !cascade) ? 'never' : formData.repeat;

        // 1. Local Update (Instant)
        const timestampedLesson = { ...formData, repeat: finalRepeat, updatedAt: Date.now() };
        setLessons(prev => ({
            ...prev,
            [targetKey]: {
                ...(prev[targetKey] || {}),
                [slot]: timestampedLesson
            }
        }));

        // 2. Cloud Update (Background)
        try {
            await fetchWithAuth('/api/timetable/lessons', {
                method: 'POST',
                body: JSON.stringify({
                    dateKey: targetKey,
                    slot,
                    ...timestampedLesson
                })
            });
        } catch (err) {
            console.error('Failed to sync lesson save', err);
        }

        // 3. Schedule Alert
        scheduleLessonAlert(timestampedLesson, targetKey, slot);
    };

    const removeLesson = async (slot: number, dateKey: string, dayLessons: Record<number, LessonData>, removeAll: boolean = false) => {
        const currentLesson = dayLessons[slot];
        if (!currentLesson) return;

        const isInherited = currentLesson.sourceDate && currentLesson.sourceDate !== dateKey;
        let cloudTargetKey = dateKey;

        // 1. Local Update (Instant)
        if (removeAll && isInherited && currentLesson.sourceDate) {
            // Remove the root lesson from its source date to stop repetitions
            const sourceKey = currentLesson.sourceDate;
            cloudTargetKey = sourceKey;
            setLessons(prev => {
                const updatedSourceDay = { ...(prev[sourceKey] || {}) };
                delete updatedSourceDay[slot];
                return { ...prev, [sourceKey]: updatedSourceDay };
            });
        } else if (isInherited) {
            // To remove a repeating instance, we save a HIDDEN entry on the current date
            setLessons(prev => ({
                ...prev,
                [dateKey]: {
                    ...(prev[dateKey] || {}),
                    [slot]: { unitName: '__HIDDEN__', repeat: 'never', updatedAt: Date.now() }
                }
            }));

            // Special case: "Override" is technically a POST/save of a hidden lesson
            try {
                await fetchWithAuth('/api/timetable/lessons', {
                    method: 'POST',
                    body: JSON.stringify({ dateKey, slot, unitName: '__HIDDEN__', repeat: 'never', updatedAt: Date.now() })
                });
            } catch (err) { console.error('Failed to sync hide instance', err); }
            return; // Early exit since override is a POST, not a DELETE
        } else {
            setLessons(prev => {
                const updatedDay = { ...(prev[dateKey] || {}) };
                delete updatedDay[slot];
                return { ...prev, [dateKey]: updatedDay };
            });
        }

        // 2. Cloud Delete (Background)
        try {
            await fetchWithAuth(`/api/timetable/lessons?dateKey=${cloudTargetKey}&slot=${slot}`, {
                method: 'DELETE'
            });
        } catch (err) {
            console.error('Failed to sync lesson removal', err);
        }
        
        // 3. Cancel Alert
        cancelLessonAlert(cloudTargetKey, slot);
    };

    const resetTimetable = (onSuccess?: () => void) => {
        Alert.alert(
            'Reset Timetable',
            'This will erase all your lessons and return you to the onboarding screen. This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => {
                        setLessons({});
                        setSettings(prev => ({ ...prev, hasOnboarded: false }));
                        if (onSuccess) onSuccess();
                    },
                },
            ]
        );
    };

    const clearAllLessons = () => {
        Alert.alert(
            'Clear All Lessons',
            'This will permanently remove every lesson from your phone and the cloud. Your settings will remain. Continue?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // 1. Clear Local
                            setLessons({});
                            await SecureStore.deleteItemAsync(LESSONS_KEY);

                            // 2. Clear Cloud
                            const res = await fetchWithAuth('/api/timetable/lessons/all', { method: 'DELETE' });
                            
                            if (res.ok) {
                                console.log({ message: 'All lessons cleared successfully', type: 'success' });
                            } else {
                                throw new Error('Cloud clear failed');
                            }
                        } catch (error) {
                            console.log({ message: 'Sync failed: Lessons cleared only locally', type: 'error' });
                        }
                    },
                },
            ]
        );
    };

    return (
        <TimetableContext.Provider value={{
            currentDate,
            lessons,
            settings,
            view,
            setCurrentDate,
            setLessons,
            setView,
            updateSettings,
            getDateKey,
            changeDate,
            getCurrentDayLessons,
            saveLesson,
            removeLesson,
            resetTimetable,
            clearAllLessons
        }}>
            {children}
        </TimetableContext.Provider>
    );
};

export const useTimetable = () => {
    const context = useContext(TimetableContext);
    if (!context) {
        throw new Error('useTimetable must be used within a TimetableProvider');
    }
    return context;
};
