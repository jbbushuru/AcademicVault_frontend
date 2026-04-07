import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Pressable } from 'react-native';
import { Typography, theme } from '@/src/styles';
import { useTimetable, LessonData } from '@/src/context/TimetableContext';
import { MapPin, Clock, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react-native';

const LESSON_CARD_WIDTH = 100;
const DAY_LABEL_WIDTH = 60;
const ROW_GAP = 4;
const COL_GAP = 4;

const WeeklyTTView: React.FC = () => {
    const colors = theme();
    const {
        currentDate, settings, getCurrentDayLessons, getDateKey,
        setCurrentDate, setView, saveLesson, removeLesson,
    } = useTimetable();

    if (!colors) return null;

    const isDark = colors.background === '#151718';

    // Double-tap detection for switching to Daily view
    const lastTapRef = useRef<number>(0);
    const handleDoubleTap = (date: Date) => {
        const now = Date.now();
        if (now - lastTapRef.current < 300) {
            setCurrentDate(date);
            setView('Daily');
        }
        lastTapRef.current = now;
    };

    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    const getStartOfWeek = (d: Date) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    };

    const startOfWeek = getStartOfWeek(currentDate);

    const weekDates = days.map((_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return d;
    });

    const lessonSlots = Array.from({ length: settings.maxLessons }, (_, i) => i + 1);

    // Week navigation
    const changeWeek = (direction: number) => {
        const next = new Date(currentDate);
        next.setDate(currentDate.getDate() + direction * 7);
        setCurrentDate(next);
    };

    // Computed header labels
    const monDate = weekDates[0];
    const sunDate = weekDates[6];
    const monthFmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short' });
    const monthLongFmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'long' });
    const yearStr = sunDate.getFullYear().toString();

    const sameMonth = monDate.getMonth() === sunDate.getMonth();
    const monthLabel = sameMonth
        ? `${monthLongFmt(monDate).toUpperCase()} ${yearStr}`
        : `${monthLongFmt(monDate).toUpperCase()} – ${monthLongFmt(sunDate).toUpperCase()} ${yearStr}`;
    const dateRange = sameMonth
        ? `${monthFmt(monDate)} ${monDate.getDate()} — ${sunDate.getDate()}`
        : `${monthFmt(monDate)} ${monDate.getDate()} — ${monthFmt(sunDate)} ${sunDate.getDate()}`;

    // Generate time labels based on start time
    const timeLabels = Array.from({ length: 14 }, (_, i) => {
        const hour = settings.firstLessonStartTime + i;
        return `${String(hour).padStart(2, '0')}:00`;
    });

    // ─── Modal State ────────────────────────────────────────
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
    const [sourceKey, setSourceKey] = useState<string | null>(null);
    const [formData, setFormData] = useState<LessonData>({
        unitName: '',
        time: '',
        venue: '',
        lecturer: '',
        repeat: 'never',
    });

    const openModal = (slot: number, date: Date) => {
        const dateKey = getDateKey(date);
        const dayLessons = getCurrentDayLessons(date);
        const currentLesson = dayLessons[slot];

        setSelectedSlot(slot);
        setSelectedDate(date);

        if (currentLesson) {
            setFormData({
                unitName: currentLesson.unitName,
                time: currentLesson.time,
                venue: currentLesson.venue,
                lecturer: currentLesson.lecturer,
                repeat: currentLesson.repeat,
            });
            setSourceKey(currentLesson.sourceDate || dateKey);
        } else {
            setFormData({ unitName: '', time: '', venue: '', lecturer: '', repeat: 'never' });
            setSourceKey(dateKey);
        }
        setIsModalVisible(true);
    };

    const handleSaveLesson = (cascade: boolean = false) => {
        if (!formData.unitName.trim() || selectedSlot === null) return;
        const dateKey = getDateKey(selectedDate);
        saveLesson(selectedSlot, formData, dateKey, cascade, sourceKey);
        setIsModalVisible(false);
    };

    const handleRemoveLesson = (removeAll: boolean = false) => {
        if (selectedSlot !== null) {
            const dateKey = getDateKey(selectedDate);
            const dayLessons = getCurrentDayLessons(selectedDate);
            removeLesson(selectedSlot, dateKey, dayLessons, removeAll);
            setIsModalVisible(false);
        }
    };

    // Helper to check if the currently selected cell has an existing lesson
    const getSelectedDayLessons = () => getCurrentDayLessons(selectedDate);
    const selectedDateKey = getDateKey(selectedDate);

    // ─── Status-based Colors (same as Daily view) ─────────
    const getLessonStatus = (lessonTime: string, viewDate: Date) => {
        if (!lessonTime) return 'upcoming';

        const now = new Date();
        const vd = new Date(viewDate);
        vd.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (vd.getTime() < today.getTime()) return 'done';
        if (vd.getTime() > today.getTime()) return 'upcoming';

        const [hours, minutes] = lessonTime.split(':').map(Number);
        const startTime = new Date(today);
        startTime.setHours(hours, minutes, 0, 0);
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + settings.lessonDuration);

        if (now.getTime() > endTime.getTime()) return 'done';
        if (now.getTime() >= startTime.getTime() && now.getTime() <= endTime.getTime()) return 'session';
        return 'upcoming';
    };

    const getStatusConfig = (status: string, index: number) => {
        switch (status) {
            case 'done':
                return {
                    bg: isDark ? '#1E1E1E' : '#FFFFFF',
                    border: isDark ? '#333' : '#E9ECEF',
                    accent: '#8E8E93',
                    text: '#8E8E93',
                };
            case 'session':
                return {
                    bg: isDark ? '#1A212E' : '#EBF5FF',
                    border: isDark ? '#2C3E50' : '#D0E7FF',
                    accent: '#F59E0B',
                    text: '#2563EB',
                };
            case 'upcoming':
                return index % 2 === 0 ? {
                    bg: isDark ? '#1B241B' : '#EDFDF2',
                    border: isDark ? '#2D3B2D' : '#D1FAE5',
                    accent: '#10B981',
                    text: '#10B981',
                } : {
                    bg: isDark ? '#2A1A1A' : '#FEF2F2',
                    border: isDark ? '#402424' : '#FEE2E2',
                    accent: '#EF4444',
                    text: '#EF4444',
                };
            default:
                return { bg: '#FFF', border: '#EEE', accent: '#000', text: '#000' };
        }
    };

    const borderColor = isDark ? '#333' : '#F0EDF5';

    // Pre-compute all lessons for the week
    const weekLessons = weekDates.map(date => getCurrentDayLessons(date));

    return (
        <View style={styles.container}>
            {/* ─── Add/Edit Lesson Modal ──────────────────────── */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setIsModalVisible(false)}>
                    <Pressable style={[styles.modalContent, { backgroundColor: colors.background }]} onPress={e => e.stopPropagation()}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={[Typography.presets.Title, { color: colors.text }]}>
                                    {selectedSlot !== null && getSelectedDayLessons()[selectedSlot] ? 'Edit Lesson' : 'Add Lesson'}
                                </Text>
                                <Text style={[{ color: colors.subtext, fontSize: 13, marginTop: 2 }]}>
                                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} · Lesson {selectedSlot}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <X size={24} color={colors.subtext} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                            <View style={styles.inputGroup}>
                                <Text style={[Typography.presets.subtitle, styles.inputLabel, { color: colors.subtext }]}>Unit Name *</Text>
                                <TextInput
                                    style={[styles.input, { borderColor: colors.primary + '40', color: colors.text }]}
                                    value={formData.unitName}
                                    onChangeText={text => setFormData(f => ({ ...f, unitName: text }))}
                                    placeholder="e.g. Network Security"
                                    placeholderTextColor={colors.subtext + '60'}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[Typography.presets.subtitle, styles.inputLabel, { color: colors.subtext }]}>Start Time (Optional)</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeSlotsContainer}>
                                    {timeLabels.map(time => (
                                        <TouchableOpacity
                                            key={time}
                                            style={[
                                                styles.timeSlotPill,
                                                { borderColor: colors.primary + '30' },
                                                formData.time === time && { backgroundColor: colors.button, borderColor: colors.button },
                                            ]}
                                            onPress={() => setFormData(f => ({ ...f, time: time === f.time ? '' : time }))}
                                        >
                                            <Text style={[
                                                styles.timeSlotText,
                                                { color: colors.text },
                                                formData.time === time && { color: '#FFF' },
                                            ]}>
                                                {time}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[Typography.presets.subtitle, styles.inputLabel, { color: colors.subtext }]}>Venue (Optional)</Text>
                                <TextInput
                                    style={[styles.input, { borderColor: colors.primary + '40', color: colors.text }]}
                                    value={formData.venue}
                                    onChangeText={text => setFormData(f => ({ ...f, venue: text }))}
                                    placeholder="e.g. Lab 4"
                                    placeholderTextColor={colors.subtext + '60'}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[Typography.presets.subtitle, styles.inputLabel, { color: colors.subtext }]}>Lecturer (Optional)</Text>
                                <TextInput
                                    style={[styles.input, { borderColor: colors.primary + '40', color: colors.text }]}
                                    value={formData.lecturer}
                                    onChangeText={text => setFormData(f => ({ ...f, lecturer: text }))}
                                    placeholder="e.g. Prof. Smith"
                                    placeholderTextColor={colors.subtext + '60'}
                                />
                            </View>

                            {/* Show repeat options only for new lessons */}
                            {!(selectedSlot !== null && getSelectedDayLessons()[selectedSlot]) && (
                                <View style={[styles.inputGroup, { marginBottom: 24 }]}>
                                    <Text style={[Typography.presets.subtitle, styles.inputLabel, { color: colors.subtext }]}>Repeat</Text>
                                    <View style={styles.repeatOptions}>
                                        {(['never', 'weekly', 'bi-weekly'] as const).map(opt => (
                                            <TouchableOpacity
                                                key={opt}
                                                style={[
                                                    styles.repeatOption,
                                                    { borderColor: colors.primary + '30' },
                                                    formData.repeat === opt && { backgroundColor: colors.button, borderColor: colors.button },
                                                ]}
                                                onPress={() => setFormData(f => ({ ...f, repeat: opt }))}
                                            >
                                                <Text style={[
                                                    styles.repeatOptionText,
                                                    formData.repeat === opt && { color: '#FFF' },
                                                ]}>
                                                    {opt === 'bi-weekly' ? '2 Weeks' : opt.charAt(0).toUpperCase() + opt.slice(1)}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {/* Save buttons — cascade if editing an inherited lesson */}
                            {sourceKey !== selectedDateKey ? (
                                <View style={styles.cascadeButtons}>
                                    <TouchableOpacity
                                        style={[styles.saveButton, { backgroundColor: colors.button, flex: 1, marginTop: 0 }]}
                                        onPress={() => handleSaveLesson(false)}
                                    >
                                        <Text style={[Typography.presets.Slogan, styles.saveButtonText, { fontSize: 13 }]}>This Session</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.saveButton, { backgroundColor: colors.primary, flex: 1, marginTop: 0 }]}
                                        onPress={() => handleSaveLesson(true)}
                                    >
                                        <Text style={[Typography.presets.Slogan, styles.saveButtonText, { fontSize: 13 }]}>All Sessions</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.saveButton, { backgroundColor: colors.button, opacity: formData.unitName.trim() ? 1 : 0.6 }]}
                                    onPress={() => handleSaveLesson(false)}
                                    disabled={!formData.unitName.trim()}
                                >
                                    <Text style={[Typography.presets.Slogan, styles.saveButtonText, { fontSize: 18 }]}>Save Lesson</Text>
                                </TouchableOpacity>
                            )}

                            {selectedSlot !== null && getSelectedDayLessons()[selectedSlot] && (
                                sourceKey !== selectedDateKey ? (
                                    <View style={styles.cascadeButtons}>
                                        <TouchableOpacity
                                            style={[styles.removeButton, { flex: 1, marginTop: 12, marginRight: 6 }]}
                                            onPress={() => handleRemoveLesson(false)}
                                        >
                                            <Text style={[Typography.presets.subtitle, { color: '#EF4444', textAlign: 'center' }]}>Remove This</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.removeButton, { flex: 1, marginTop: 12, marginLeft: 6 }]}
                                            onPress={() => handleRemoveLesson(true)}
                                        >
                                            <Text style={[Typography.presets.subtitle, { color: '#EF4444', textAlign: 'center' }]}>Remove All</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveLesson(false)}>
                                        <Text style={[Typography.presets.subtitle, { color: '#EF4444' }]}>Remove Lesson</Text>
                                    </TouchableOpacity>
                                )
                            )}
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </Modal>

            {/* Date Navigation Header */}
            <View style={styles.header}>
                <View style={{ width: 22 }} />
                <View style={styles.dateControl}>
                    <TouchableOpacity onPress={() => changeWeek(-1)}>
                        <ChevronLeft size={24} color={colors.subtext} />
                    </TouchableOpacity>
                    <View style={styles.dateInfo}>
                        <Text style={[Typography.presets.subtitle, styles.dayText, { color: colors.subtext }]}>
                            {monthLabel}
                        </Text>
                        <Text style={[Typography.presets.Title, styles.dateText, { color: colors.text }]}>
                            {dateRange}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => changeWeek(1)}>
                        <ChevronRight size={24} color={colors.subtext} />
                    </TouchableOpacity>
                </View>
                <View style={{ width: 22 }} />
            </View>

            {/* ─── Weekly Grid ────────────────────────────────── */}
            <View style={styles.gridWrapper}>
                {/* Fixed Day Labels Column (Y-axis) */}
                <View style={styles.dayColumn}>
                    <View style={{ height: 30 }} />
                    {weekDates.map((date, i) => {
                        const isToday = getDateKey(date) === getDateKey(new Date());
                        const isCurrentView = getDateKey(date) === getDateKey(currentDate);
                        const isSelected = currentDate && date.toDateString() === currentDate.toDateString();

                        return (
                            <TouchableOpacity
                                key={days[i]}
                                style={[
                                    styles.dayLabelCell,
                                    { borderColor },
                                    isToday && { backgroundColor: colors.button, borderColor: colors.button },
                                    isSelected && !isToday && { borderColor: colors.button },
                                ]}
                                onPress={() => handleDoubleTap(date)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.dayAbbr, { color: isToday ? '#FFF' : colors.subtext }]}>
                                    {days[i]}
                                </Text>
                                <Text style={[styles.dayNum, { color: isToday ? '#FFF' : colors.text }]}>
                                    {date.getDate()}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Single Horizontal ScrollView for all lesson columns */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollArea}>
                    <View style={styles.columnsContainer}>
                        {/* Column Headers */}
                        <View style={styles.columnHeaderRow}>
                            {lessonSlots.map(slot => (
                                <View
                                    key={slot}
                                    style={[styles.columnHeader, { backgroundColor: colors.primary + '10' }]}
                                >
                                    <Text style={[styles.columnHeaderText, { color: colors.primary }]}>
                                        L{slot}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {/* Data Rows — one per day */}
                        {weekDates.map((date, dayIdx) => {
                            const lessons = weekLessons[dayIdx];

                            return (
                                <View key={days[dayIdx]} style={styles.dataRow}>
                                    {lessonSlots.map(slot => {
                                        const lesson = lessons[slot];

                                        if (!lesson) {
                                            return (
                                                <TouchableOpacity
                                                    key={slot}
                                                    style={[styles.emptyCard, { backgroundColor: colors.background, borderColor: colors.primary + '70' }]}
                                                    onPress={() => openModal(slot, date)}
                                                    activeOpacity={0.6}
                                                >
                                                    <View style={{ backgroundColor: colors.primary + '20', width: 25, height: 25, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
                                                        <Plus size={15} color={colors.subtext + '50'} />
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        }

                                        const status = getLessonStatus(lesson.time || '', date);
                                        const config = getStatusConfig(status, slot);
                                        const isDone = status === 'done';

                                        return (
                                            <TouchableOpacity
                                                key={slot}
                                                style={[
                                                    styles.lessonCard,
                                                    {
                                                        backgroundColor: config.bg,
                                                        borderColor: config.border,
                                                        opacity: isDone ? 0.6 : 1,
                                                    },
                                                ]}
                                                onPress={() => openModal(slot, date)}
                                                activeOpacity={0.7}
                                            >
                                                <View style={[styles.accentBar, { backgroundColor: config.accent }]} />
                                                <Text
                                                    style={[styles.lessonName, { color: isDone ? config.text : (isDark ? '#FFF' : config.text) }]}
                                                    numberOfLines={2}
                                                >
                                                    {lesson.unitName}
                                                </Text>
                                                {lesson.time && (
                                                    <View style={styles.lessonMeta}>
                                                        <Clock size={10} color={config.accent + '90'} />
                                                        <Text style={[styles.lessonMetaText, { color: config.accent + '90' }]}>
                                                            {lesson.time}
                                                        </Text>
                                                    </View>
                                                )}
                                                {lesson.venue && (
                                                    <View style={styles.lessonMeta}>
                                                        <MapPin size={10} color={config.accent + '90'} />
                                                        <Text style={[styles.lessonMetaText, { color: config.accent + '90' }]}>
                                                            {lesson.venue}
                                                        </Text>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    //Navigation Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    dayText: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 1.2,
    },
    dateText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 2,
    },
    dateControl: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
    },
    dateInfo: {
        alignItems: 'center',
    },
    gridWrapper: {
        flexDirection: 'row',
    },
    dayColumn: {
        width: DAY_LABEL_WIDTH,
        marginRight: COL_GAP,
        gap: ROW_GAP,
    },
    dayLabelCell: {
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: 'transparent',
        minHeight: 70,
    },
    dayAbbr: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1,
    },
    dayNum: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 1,
    },
    scrollArea: {
        flex: 1,
    },
    columnsContainer: {
        gap: ROW_GAP,
        paddingRight: 16,
    },
    columnHeaderRow: {
        flexDirection: 'row',
        gap: COL_GAP,
    },
    columnHeader: {
        width: LESSON_CARD_WIDTH,
        height: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    columnHeaderText: {
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    dataRow: {
        flexDirection: 'row',
        gap: COL_GAP,
    },
    lessonCard: {
        width: LESSON_CARD_WIDTH,
        borderRadius: 12,
        padding: 10,
        borderWidth: 1,
        justifyContent: 'center',
        minHeight: 70,
        overflow: 'hidden',
    },
    accentBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
    },
    lessonName: {
        fontSize: 13,
        fontWeight: '700',
        marginLeft: 6,
        lineHeight: 16,
    },
    lessonMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        marginTop: 4,
        marginLeft: 6,
    },
    lessonMetaText: {
        fontSize: 10,
        fontWeight: '500',
    },
    emptyCard: {
        width: LESSON_CARD_WIDTH,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 70,
    },

    // ─── Modal Styles ───────────────────────────────────────
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        borderRadius: 24,
        padding: 24,
        maxHeight: '80%',
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
    },
    timeSlotsContainer: {
        flexDirection: 'row',
        marginTop: 4,
    },
    timeSlotPill: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 10,
    },
    timeSlotText: {
        fontSize: 13,
        fontWeight: '500',
    },
    repeatOptions: {
        flexDirection: 'row',
        gap: 10,
    },
    repeatOption: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    repeatOptionText: {
        fontSize: 13,
        fontWeight: '600',
    },
    cascadeButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    saveButton: {
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    saveButtonText: {
        color: '#FFF',
    },
    removeButton: {
        marginTop: 12,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EF4444' + '20',
        backgroundColor: '#EF4444' + '10',
    },
});

export default WeeklyTTView;
