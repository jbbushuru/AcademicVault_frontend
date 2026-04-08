// src/screens/TTsettings.tsx

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Switch,
} from 'react-native';
import {
    ChevronLeft,
    Clock,
    LayoutGrid,
    Timer,
    Sunrise,
    RotateCcw,
    Trash2,
    CalendarDays,
    Save,
    Bell,
    BellRing,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, Typography } from '@/src/styles';
import { useRouter } from 'expo-router';
import { useTimetable, TimetableSettings } from '@/src/context/TimetableContext';
import CustomDropdown from '@/src/components/ui/dropdown';
import RouteHeader from '@/src/components/ui/routeHeader';
import { styles } from './utils';

interface TTsettingsViewProps {
    colors: any;
    router: any;
    isDark: boolean | string;
}

function TTsettingsView({colors, router, isDark}: TTsettingsViewProps){
    const { settings, updateSettings, resetTimetable, clearAllLessons, lessons } = useTimetable();
    // Local draft of settings so changes aren't applied until Save
    const [draft, setDraft] = useState<TimetableSettings>({ ...settings });
    const [hasChanges, setHasChanges] = useState(false);
    const updateDraft = (patch: Partial<TimetableSettings>) => {
        setDraft(prev => ({ ...prev, ...patch }));
        setHasChanges(true);
    };
    const handleSave = () => {
        updateSettings({ ...draft, hasOnboarded: true });
        setHasChanges(false);
        router.back();
    };
    // Stats
    const totalLessonDays = Object.keys(lessons).length;
    const totalLessons = Object.values(lessons).reduce(
        (acc, day) => acc + Object.keys(day).length, 0
    );
    // Option arrays
    const maxLessonOptions = [3, 4, 5, 6, 7, 8];
    const durationOptions = [1,2,3];
    const startTimeOptions = [6, 7, 8, 9, 10, 11];
  
    const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
    const cardBorder = isDark ? '#2A2A2A' : '#F0EDF5';
    const subtleBg = isDark ? '#252525' : '#F9F7FC';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <RouteHeader title='Timetable Settings'/>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Quick Stats Card */}
                <View style={[styles.statsCard, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '25' }]}>
                    <View style={styles.statItem}>
                        <CalendarDays size={20} color={colors.primary} />
                        <Text style={[styles.statValue, { color: colors.text }]}>{totalLessonDays}</Text>
                        <Text style={[styles.statLabel, { color: colors.subtext }]}>Days</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: colors.primary + '20' }]} />
                    <View style={styles.statItem}>
                        <LayoutGrid size={20} color={colors.primary} />
                        <Text style={[styles.statValue, { color: colors.text }]}>{totalLessons}</Text>
                        <Text style={[styles.statLabel, { color: colors.subtext }]}>Lessons</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: colors.primary + '20' }]} />
                    <View style={styles.statItem}>
                        <Clock size={20} color={colors.primary} />
                        <Text style={[styles.statValue, { color: colors.text }]}>{draft.lessonDuration}{draft.lessonDuration === 1 ? 'hr' : 'hrs'}</Text>
                        <Text style={[styles.statLabel, { color: colors.subtext }]}>Per Class</Text>
                    </View>
                </View>

                {/* Max Lessons Section */}
                <View style={[styles.section, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                    <View style={styles.sectionHeader}>
                        <View style={[styles.iconCircle, { backgroundColor: '#10B981' + '15' }]}>
                            <LayoutGrid size={18} color="#10B981" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Max Lessons Per Day</Text>
                            <Text style={[styles.sectionSubtitle, { color: colors.subtext }]}>
                                How many lesson slots to show each day
                            </Text>
                        </View>
                    </View>
                    <CustomDropdown
                        data={maxLessonOptions}
                        onSelect={value => updateDraft({ maxLessons: value })}
                        placeholder={`${settings.maxLessons.toString()} lessons`}
                    />
                </View>

                {/* Lesson Duration Section */}
                <View style={[styles.section, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                    <View style={styles.sectionHeader}>
                        <View style={[styles.iconCircle, { backgroundColor: '#6366F1' + '15' }]}>
                            <Timer size={18} color="#6366F1" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Lesson Duration</Text>
                            <Text style={[styles.sectionSubtitle, { color: colors.subtext }]}>
                                Length of each lesson in hours
                            </Text>
                        </View>
                    </View>
                    <CustomDropdown
                        data={durationOptions}
                        onSelect={value => updateDraft({ lessonDuration: value })}
                        placeholder={`${settings.lessonDuration.toString()} hours`}
                    />
                </View>

                {/* First Lesson Start Time Section */}
                <View style={[styles.section, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                    <View style={styles.sectionHeader}>
                        <View style={[styles.iconCircle, { backgroundColor: '#F59E0B' + '15' }]}>
                            <Sunrise size={18} color="#F59E0B" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>First Lesson Starts At</Text>
                            <Text style={[styles.sectionSubtitle, { color: colors.subtext }]}>
                                Earliest time slot available
                            </Text>
                        </View>
                    </View>
                    <CustomDropdown
                        data={[6, 7, 8, 9, 10, 11].map(h => ({ label: `${h}:00 AM`, value: h }))}
                        onSelect={value => updateDraft({ firstLessonStartTime: value })}
                        placeholder={`${draft.firstLessonStartTime}:00 AM`}
                    />
                </View>

                {/* Notifications Section */}
                <View style={[styles.section, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                    <View style={styles.sectionHeader}>
                        <View style={[styles.iconCircle, { backgroundColor: '#10B981' + '15' }]}>
                            <Bell size={18} color="#10B981" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Lesson Reminders</Text>
                            <Text style={[styles.sectionSubtitle, { color: colors.subtext }]}>
                                Get notified before your classes start
                            </Text>
                        </View>
                        <Switch
                            value={draft.notificationsEnabled ?? true}
                            onValueChange={(val) => updateDraft({ notificationsEnabled: val })}
                            trackColor={{ false: colors.subtext + '50', true: '#10B981' + '80' }}
                            thumbColor={draft.notificationsEnabled ? '#10B981' : '#f4f3f4'}
                        />
                    </View>
                </View>

                {/* Lead Time Section (only visible if notifications are ON) */}
                {draft.notificationsEnabled && (
                    <View style={[styles.section, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                        <View style={styles.sectionHeader}>
                            <View style={[styles.iconCircle, { backgroundColor: '#10B981' + '15' }]}>
                                <BellRing size={18} color="#10B981" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Reminder Timing</Text>
                                <Text style={[styles.sectionSubtitle, { color: colors.subtext }]}>
                                    Minutes before class to alert you
                                </Text>
                            </View>
                        </View>
                        <CustomDropdown
                            data={[5, 10, 15, 30, 60].map(m => ({ label: `${m} mins`, value: m }))}
                            onSelect={value => updateDraft({ alertLeadTime: value })}
                            placeholder={`${draft.alertLeadTime ?? 15} mins`}
                        />
                    </View>
                )}

                {/* Danger Zone */}
                <View style={[styles.section, { backgroundColor: cardBg, borderColor: '#EF4444' + '25' }]}>
                    <View style={styles.sectionHeader}>
                        <View style={[styles.iconCircle, { backgroundColor: '#EF4444' + '12' }]}>
                            <Trash2 size={18} color="#EF4444" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>Danger Zone</Text>
                            <Text style={[styles.sectionSubtitle, { color: colors.subtext }]}>
                                Irreversible actions
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.dangerButton, { borderColor: '#EF4444' + '30', backgroundColor: '#EF4444' + '08' }]}
                        onPress={() => resetTimetable(() => router.back())}
                    >
                        <RotateCcw size={18} color="#EF4444" />
                        <View style={{ marginLeft: 12 }}>
                            <Text style={[styles.dangerButtonTitle, { color: '#EF4444' }]}>Reset Entire Timetable</Text>
                            <Text style={[styles.dangerButtonSub, { color: colors.subtext }]}>
                                Erases all lessons and returns to setup
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.dangerButton, { borderColor: '#F59E0B' + '30', backgroundColor: '#F59E0B' + '08', marginTop: 10 }]}
                        onPress={clearAllLessons}
                    >
                        <Trash2 size={18} color="#F59E0B" />
                        <View style={{ marginLeft: 12 }}>
                            <Text style={[styles.dangerButtonTitle, { color: '#F59E0B' }]}>Clear All Lessons</Text>
                            <Text style={[styles.dangerButtonSub, { color: colors.subtext }]}>
                                Removes lessons but keeps your settings
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 30 }} />
            </ScrollView>

            {/* Sticky Save Button */}
            {hasChanges && (
                <View style={[styles.saveBar, { backgroundColor: colors.background, borderTopColor: cardBorder }]}>
                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: colors.button }]}
                        onPress={handleSave}
                        activeOpacity={0.85}
                    >
                        <Save size={20} color="#FFF" />
                        <Text style={[Typography.presets.Title, styles.saveButtonText]}>Save Changes</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );

}

export default function TTSettingsScreen() {
    const router = useRouter();
    const colors = theme();
    if (!colors) return null;
    const isDark = colors.background === '#151718';

    return (
        <TTsettingsView
            colors={colors}
            isDark={isDark}
            router={router}
        />
    );
}

