import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Pressable, ScrollView } from 'react-native';
import { Typography, theme } from '@/src/styles';
import { ChevronLeft, ChevronRight, Plus, X, Clock, MapPin, User } from 'lucide-react-native';

interface LessonData {
    unitName: string;
    time?: string;
    venue?: string;
    lecturer?: string;
    repeat: 'never' | 'weekly' | 'bi-weekly';
}

const DailyTTView = () => {
    const colors = theme();
    if (!colors) return null;

    // Current Date State
    const [currentDate, setCurrentDate] = useState(new Date());
    
    // Helper to get a stable key for each date
    const getDateKey = (date: Date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.toISOString().split('T')[0];
    };

    // Lessons state: indexed by dateKey (YYYY-MM-DD), then slot index (1-5)
    const [lessons, setLessons] = useState<Record<string, Record<number, LessonData>>>({});
    
    const dateKey = getDateKey(currentDate);
    const oneDayMs = 24 * 60 * 60 * 1000;

    // Compute current day lessons including repeating ones
    const getCurrentDayLessons = () => {
        const result: Record<number, LessonData & { sourceDate?: string }> = {};
        const currentMs = new Date(dateKey).getTime();

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
                    if (savedDateKey === dateKey) {
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
    };

    const currentDayLessons = getCurrentDayLessons();

    // Modal state
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
    const [sourceKey, setSourceKey] = useState<string | null>(null);
    const [formData, setFormData] = useState<LessonData>({ 
        unitName: '', 
        time: '', 
        venue: '', 
        lecturer: '',
        repeat: 'never'
    });

    const formatDay = (date: Date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const changeDate = (days: number) => {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + days);
        setCurrentDate(nextDate);
    };

    const openModal = (slot: number) => {
        setSelectedSlot(slot);
        const currentLesson = currentDayLessons[slot];
        if (currentLesson) {
            setFormData({
                unitName: currentLesson.unitName,
                time: currentLesson.time,
                venue: currentLesson.venue,
                lecturer: currentLesson.lecturer,
                repeat: currentLesson.repeat
            });
            setSourceKey(currentLesson.sourceDate || dateKey);
        } else {
            setFormData({ 
                unitName: '', 
                time: '', 
                venue: '', 
                lecturer: '',
                repeat: 'never'
            });
            setSourceKey(dateKey);
        }
        setIsModalVisible(true);
    };

    const saveLesson = (cascade: boolean = false) => {
        if (!formData.unitName.trim()) return;

        if (selectedSlot !== null) {
            const targetKey = cascade && sourceKey ? sourceKey : dateKey;
            
            // Logic: This session only (not cascading) -> repeat must be never
            // UNLESS it's a completely NEW lesson that we want to save with a recurrence pattern.
            const isNew = !currentDayLessons[selectedSlot];
            const finalRepeat = (!isNew && !cascade) ? 'never' : formData.repeat;

            setLessons(prev => ({
                ...prev,
                [targetKey]: {
                    ...(prev[targetKey] || {}),
                    [selectedSlot]: { ...formData, repeat: finalRepeat }
                }
            }));
        }
        setIsModalVisible(false);
    };

    const removeLesson = () => {
        if (selectedSlot !== null) {
            const currentLesson = currentDayLessons[selectedSlot];
            const isInherited = currentLesson && currentLesson.sourceDate !== dateKey;

            if (isInherited) {
                // To remove a repeating instance, we save a HIDDEN entry on the current date
                setLessons(prev => ({
                    ...prev,
                    [dateKey]: {
                        ...(prev[dateKey] || {}),
                        [selectedSlot]: { unitName: '__HIDDEN__', repeat: 'never' }
                    }
                }));
            } else {
                setLessons(prev => {
                    const updatedDay = { ...(prev[dateKey] || {}) };
                    delete updatedDay[selectedSlot];
                    return { ...prev, [dateKey]: updatedDay };
                });
            }
            setIsModalVisible(false);
        }
    };

    const lessonSlots = [1, 2, 3, 4, 5];
    const addedCount = Object.values(currentDayLessons).length;

    return (
        <View style={styles.container}>
            {/* Modal for adding/editing lessons */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setIsModalVisible(false)}>
                    <Pressable style={[styles.modalContent, { backgroundColor: colors.background }]} onPress={(e) => e.stopPropagation()}>
                        <View style={styles.modalHeader}>
                            <Text style={[Typography.presets.Title, { color: colors.text }]}>
                                {selectedSlot !== null && currentDayLessons[selectedSlot] ? 'Edit Lesson' : 'Add Lesson'}
                            </Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <X size={24} color={colors.subtext} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                            <View style={styles.inputGroup}>
                                <Text style={[Typography.presets.subtitle, styles.inputLabel, { color: colors.subtext }]}>Unit Name *</Text>
                                <TextInput
                                    style={[styles.input, { borderColor: colors.primary + '8540', color: colors.text }]}
                                    value={formData.unitName}
                                    onChangeText={(text) => setFormData(f => ({ ...f, unitName: text }))}
                                    placeholder="e.g. Network Security"
                                    placeholderTextColor={colors.subtext + '60'}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[Typography.presets.subtitle, styles.inputLabel, { color: colors.subtext }]}>Start Time (Optional)</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeSlotsContainer}>
                                    {[
                                        '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', 
                                        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', 
                                        '19:00', '20:00'
                                    ].map((time) => (
                                        <TouchableOpacity
                                            key={time}
                                            style={[
                                                styles.timeSlotPill,
                                                { borderColor: colors.primary + '30' },
                                                formData.time === time && { backgroundColor: colors.button, borderColor: colors.button }
                                            ]}
                                            onPress={() => setFormData(f => ({ ...f, time: time === f.time ? '' : time }))}
                                        >
                                            <Text style={[
                                                styles.timeSlotText,
                                                { color: colors.text },
                                                formData.time === time && { color: '#FFF' }
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
                                    style={[styles.input, { borderColor: colors.primary + '95', color: colors.text }]}
                                    value={formData.venue}
                                    onChangeText={(text) => setFormData(f => ({ ...f, venue: text }))}
                                    placeholder="e.g. Lab 4"
                                    placeholderTextColor={colors.subtext + '60'}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[Typography.presets.subtitle, styles.inputLabel, { color: colors.subtext }]}>Lecturer (Optional)</Text>
                                <TextInput
                                    style={[styles.input, { borderColor: colors.primary + '95', color: colors.text }]}
                                    value={formData.lecturer}
                                    onChangeText={(text) => setFormData(f => ({ ...f, lecturer: text }))}
                                    placeholder="e.g. Prof. Smith"
                                    placeholderTextColor={colors.subtext + '60'}
                                />
                            </View>

                            {/* Only show repeat options for NEW lessons */}
                            {!(selectedSlot !== null && currentDayLessons[selectedSlot]) && (
                                <View style={[styles.inputGroup, { marginBottom: 24 }]}>
                                    <Text style={[Typography.presets.subtitle, styles.inputLabel, { color: colors.subtext }]}>Repeat</Text>
                                    <View style={styles.repeatOptions}>
                                        {(['never', 'weekly', 'bi-weekly'] as const).map((opt) => (
                                            <TouchableOpacity
                                                key={opt}
                                                style={[
                                                    styles.repeatOption,
                                                    { borderColor: colors.primary + '30' },
                                                    formData.repeat === opt && { backgroundColor: colors.button, borderColor: colors.button }
                                                ]}
                                                onPress={() => setFormData(f => ({ ...f, repeat: opt }))}
                                            >
                                                <Text style={[
                                                    styles.repeatOptionText,
                                                    formData.repeat === opt && { color: '#FFF' }
                                                ]}>
                                                    {opt === 'bi-weekly' ? '2 Weeks' : opt.charAt(0).toUpperCase() + opt.slice(1)}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {sourceKey !== dateKey ? (
                                <View style={styles.cascadeButtons}>
                                    <TouchableOpacity
                                        style={[styles.saveButton, { backgroundColor: colors.button, flex: 1, marginTop: 0 }]}
                                        onPress={() => saveLesson(false)}
                                    >
                                        <Text style={[Typography.presets.Slogan, styles.saveButtonText, { fontSize: 13 }]}>This Session</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.saveButton, { backgroundColor: colors.primary, flex: 1, marginTop: 0 }]}
                                        onPress={() => saveLesson(true)}
                                    >
                                        <Text style={[Typography.presets.Slogan, styles.saveButtonText, { fontSize: 13 }]}>All Sessions</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.saveButton, { backgroundColor: colors.button, opacity: formData.unitName.trim() ? 1 : 0.6 }]}
                                    onPress={() => saveLesson(false)}
                                    disabled={!formData.unitName.trim()}
                                >
                                    <Text style={[Typography.presets.Slogan, styles.saveButtonText,{ fontSize: 18 }]}>Save Lesson</Text>
                                </TouchableOpacity>
                            )}

                            {selectedSlot !== null && currentDayLessons[selectedSlot] && (
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={removeLesson}
                                >
                                    <Text style={[Typography.presets.subtitle, { color: '#EF4444' }]}>Remove Lesson</Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </Modal>

            {/* Date Navigation Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => changeDate(-1)}>
                    <ChevronLeft size={24} color={colors.subtext} />
                </TouchableOpacity>
                <View style={styles.dateInfo}>
                    <Text style={[Typography.presets.subtitle, styles.dayText, { color: colors.subtext }]}>
                        {formatDay(currentDate)}
                    </Text>
                    <Text style={[Typography.presets.Title, styles.dateText, { color: colors.text }]}>
                        {formatDate(currentDate)}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => changeDate(1)}>
                    <ChevronRight size={24} color={colors.subtext} />
                </TouchableOpacity>
            </View>

            {/* Progress/Lessons Info */}
            <View style={styles.progressContainer}>
                <Text style={[Typography.presets.body, styles.progressText, { color: colors.subtext }]}>
                    {addedCount} of 5 lessons added
                </Text>
                <View style={styles.progressBar}>
                    {lessonSlots.map((i) => (
                        <View
                            key={i}
                            style={[
                                styles.progressSegment,
                                { backgroundColor: currentDayLessons[i] ? colors.button : colors.subtext + '20' }
                            ]}
                        />
                    ))}
                </View>
            </View>

            {/* Lessons List */}
            <View style={styles.lessonsList}>
                {lessonSlots.map((slot) => {
                    const lesson = currentDayLessons[slot];
                    return (
                        <TouchableOpacity
                            key={slot}
                            style={[
                                styles.lessonCard,
                                { borderColor: colors.primary + '95' },
                                lesson && styles.activeLessonCard
                            ]}
                            onPress={() => openModal(slot)}
                        >
                            {lesson ? (
                                <View style={styles.filledCardContent}>
                                    <Text style={[Typography.presets.Title, { color: colors.text, marginBottom: 8, fontSize: 16 }]}>
                                        {lesson.unitName}
                                    </Text>
                                    <View style={styles.detailsRow}>
                                        {lesson.time && (
                                            <View style={styles.detailItem}>
                                                <Clock size={14} color={colors.subtext} />
                                                <Text style={[Typography.presets.body, styles.detailText, { color: colors.subtext }]}>
                                                    {lesson.time}
                                                </Text>
                                            </View>
                                        )}
                                        {lesson.venue && (
                                            <View style={styles.detailItem}>
                                                <MapPin size={14} color={colors.subtext} />
                                                <Text style={[Typography.presets.body, styles.detailText, { color: colors.subtext }]}>
                                                    {lesson.venue}
                                                </Text>
                                            </View>
                                        )}
                                        {lesson.lecturer && (
                                            <View style={styles.detailItem}>
                                                <User size={14} color={colors.subtext} />
                                                <Text style={[Typography.presets.body, styles.detailText, { color: colors.subtext }]}>
                                                    {lesson.lecturer}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ) : (
                                <>
                                    <View style={[styles.plusCircle, { backgroundColor: colors.primary + '10' }]}>
                                        <Plus size={20} color={colors.primary} />
                                    </View>
                                    <Text style={[Typography.presets.subtitle, styles.lessonText, { color: colors.subtext }]}>
                                        Lesson {slot}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    dateInfo: {
        alignItems: 'center',
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
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    progressText: {
        fontSize: 13,
        opacity: 0.8,
    },
    progressBar: {
        flexDirection: 'row',
        gap: 4,
    },
    progressSegment: {
        width: 16,
        height: 6,
        borderRadius: 3,
    },
    lessonsList: {
        gap: 16,
        paddingBottom: 95,
    },
    lessonCard: {
        minHeight: 110,
        borderRadius: 20,
        borderWidth: 1,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    activeLessonCard: {
        borderStyle: 'solid',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#FFFFFF',
        padding: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    filledCardContent: {
        width: '100%',
    },
    detailsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: {
        fontSize: 12,
    },
    plusCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    lessonText: {
        fontSize: 14,
        opacity: 0.7,
    },
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
        alignItems: 'center',
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
    }
});

export default DailyTTView;
