import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Pressable, ScrollView } from 'react-native';
import { Typography, theme } from '@/src/styles';
import { ChevronLeft, ChevronRight, Plus, X, MapPin, User } from 'lucide-react-native';
import { useTimetable, LessonData } from '@/src/context/TimetableContext';

const DailyTTView: React.FC = () => {
    const colors = theme();
    const { 
        currentDate, 
        settings, 
        getDateKey, 
        changeDate, 
        getCurrentDayLessons, 
        saveLesson, 
        removeLesson
    } = useTimetable();

    if (!colors) return null;

    const dateKey = getDateKey(currentDate);

    // Compute current day lessons including repeating ones
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

    const handleSaveLesson = (cascade: boolean = false) => {
        if (!formData.unitName.trim() || selectedSlot === null) return;
        saveLesson(selectedSlot, formData, dateKey, cascade, sourceKey);
        setIsModalVisible(false);
    };

    const handleRemoveLesson = (removeAll: boolean = false) => {
        if (selectedSlot !== null) {
            removeLesson(selectedSlot, dateKey, currentDayLessons, removeAll);
            setIsModalVisible(false);
        }
    };

    const getLessonStatus = (lessonTime: string) => {
        if (!lessonTime) return 'upcoming';

        const now = new Date();
        const viewDate = new Date(currentDate);
        viewDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (viewDate.getTime() < today.getTime()) return 'done';
        if (viewDate.getTime() > today.getTime()) return 'upcoming';

        const [hours, minutes] = lessonTime.split(':').map(Number);
        const startTime = new Date(today);
        startTime.setHours(hours, minutes, 0, 0);
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + settings.lessonDuration);

        if (now.getTime() > endTime.getTime()) return 'done';
        if (now.getTime() >= startTime.getTime() && now.getTime() <= endTime.getTime()) return 'session';
        return 'upcoming';
    };

    const getEndTime = (time: string) => {
        if (!time) return '';
        const [h, m] = time.split(':').map(Number);
        const d = new Date();
        d.setHours(h, m + (settings.lessonDuration * 60));
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    const getStatusConfig = (status: string, index: number) => {
        switch (status) {
            case 'done':
                return {
                    bg: colors.background === '#151718' ? '#1E1E1E' : '#FFFFFF',
                    border: colors.background === '#151718' ? '#333' : '#E9ECEF',
                    accent: '#8E8E93',
                    dot: '#C7C7CC',
                    text: '#8E8E93',
                    label: 'Done'
                };
            case 'session':
                return {
                    bg: colors.background === '#151718' ? '#1A212E' : '#EBF5FF',
                    border: colors.background === '#151718' ? '#2C3E50' : '#D0E7FF',
                    accent: '#F59E0B',
                    dot: '#F59E0B',
                    text: '#2563EB',
                    label: 'NOW IN SESSION'
                };
            case 'upcoming':
                const isEven = index % 2 === 0;
                return isEven ? {
                    bg: colors.background === '#151718' ? '#1B241B' : '#EDFDF2',
                    border: colors.background === '#151718' ? '#2D3B2D' : '#D1FAE5',
                    accent: '#10B981',
                    dot: '#10B981',
                    text: '#10B981',
                    label: 'Upcoming'
                } : {
                    bg: colors.background === '#151718' ? '#2A1A1A' : '#FEF2F2',
                    border: colors.background === '#151718' ? '#402424' : '#FEE2E2',
                    accent: '#EF4444',
                    dot: '#EF4444',
                    text: '#EF4444',
                    label: 'Upcoming'
                };
            default: return { bg: '#FFF', border: '#EEE', accent: '#000', dot: '#000', text: '#000', label: '' };
        }
    };

    const lessonSlots = Array.from({ length: settings.maxLessons }, (_, i) => i + 1);
    const addedCount = Object.values(currentDayLessons).length;

    // Generate time labels based on start time
    const timeLabels = Array.from({ length: 14 }, (_, i) => {
        const hour = settings.firstLessonStartTime + i;
        return `${String(hour).padStart(2, '0')}:00`;
    });

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
                                    {timeLabels.map((time) => (
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

                            {selectedSlot !== null && currentDayLessons[selectedSlot] && (
                                sourceKey !== dateKey ? (
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
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => handleRemoveLesson(false)}
                                    >
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
                <View style={{ width: 22 }} />
            </View>

            {/* Progress/Lessons Info */}
            <View style={styles.progressContainer}>
                <Text style={[Typography.presets.body, styles.progressText, { color: colors.subtext }]}>
                    {addedCount} of {settings.maxLessons} lessons added
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
                    const status = lesson ? getLessonStatus(lesson.time || '') : 'idle';
                    const config = lesson ? getStatusConfig(status, slot) : null;

                    return (
                        <TouchableOpacity
                            key={slot}
                            activeOpacity={0.8}
                            style={[
                                styles.lessonCard,
                                lesson ? [
                                    styles.lessonCard,
                                    styles.activeLessonCard,
                                    {
                                        backgroundColor: config?.bg,
                                        borderColor: config?.border,
                                        borderStyle: 'solid',
                                        borderWidth: 1.5,
                                    }
                                ] : [
                                    styles.lessonCard,
                                    {
                                        borderColor: colors.primary + '35',
                                        backgroundColor: colors.background,
                                    }
                                ]
                            ]}
                            onPress={() => openModal(slot)}
                        >
                            {lesson ? (
                                    <View style={styles.premiumCardContent}>
                                        <View style={styles.headerRow}>
                                            <View style={styles.statusGroup}>
                                                <View style={[styles.statusDot, { backgroundColor: config?.dot }]} />
                                                <Text style={[styles.statusLabel, { color: config?.accent, fontSize: 13 }]}>
                                                    {status === 'session' ? 'NOW IN SESSION' : `Lesson ${slot} · ${config?.label}`}
                                                </Text>
                                            </View>
                                            {lesson.time && (
                                                <Text style={[styles.timeLabel, { color: config?.accent + '95', fontSize: 13 }]}>
                                                    {lesson.time} — {getEndTime(lesson.time)}
                                                </Text>
                                            )}
                                        </View>

                                        <Text style={[Typography.presets.Title, styles.previewTitle, { color: status === 'done' ? config?.text : colors.text, fontSize: 20, marginLeft: 15 }]}>
                                            {lesson.unitName}
                                        </Text>

                                        <View style={styles.infoFooter}>
                                            {lesson.venue && (
                                                <View style={styles.footerItem}>
                                                    <MapPin size={15} color={config?.accent + '85'} />
                                                    <Text style={[styles.footerText, { color: config?.accent + '95', fontSize: 13 }]}>{lesson.venue}</Text>
                                                </View>
                                            )}
                                            {lesson.lecturer && (
                                                <View style={styles.footerItem}>
                                                    <User size={15} color={config?.accent + '85'} />
                                                    <Text style={[styles.footerText, { color: config?.accent + '95', fontSize: 13 }]}>{lesson.lecturer}</Text>
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
        height: 110,
        borderRadius: 20,
        borderWidth: 1,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    activeLessonCard: {
        padding: 14,
        alignItems: 'stretch',
        justifyContent: 'space-between',
        borderStyle: 'solid',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 5,
        elevation: 1,
    },
    premiumCardContent: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    statusGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusLabel: {
        fontWeight: '600',
    },
    timeLabel: {
        fontWeight: '500',
    },
    previewTitle: {
        fontWeight: 'bold',
        letterSpacing: -0.2,
        lineHeight: 22,
    },
    infoFooter: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 2,
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    footerText: {
        fontWeight: '500',
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
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 16,
    },
    optionsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    optionPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    optionText: {
        fontSize: 14,
        fontWeight: '500',
    },
    dateControl: {
        flex:1,
        justifyContent:"space-between",
        alignItems:"center",
        flexDirection: 'row',
        gap: 20,
    }
});

export default DailyTTView;
