import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Compass, EyeOff, Target, TrendingUp, TrendingDown, Clock } from "lucide-react-native";
import { useAuth } from "@/src/context/AuthContext";
import { theme } from "@/src/styles";

// Grade system definition
const GRADE_SYSTEM = [
    { letter: 'A', points: 12, range: '10 – 12', color: '#22c55e', bg: '#f0fdf4' },
    { letter: 'B', points: 9, range: '7 – 9', color: '#3b82f6', bg: '#eff6ff' },
    { letter: 'C', points: 6, range: '4 – 6', color: '#f59e0b', bg: '#fffbeb' },
    { letter: 'D', points: 3, range: '1 – 3', color: '#ef4444', bg: '#fef2f2' },
];

// Helper: get the minimum average threshold for a grade letter
const getTargetThreshold = (grade: string): number => {
    switch (grade) {
        case 'A': return 10;
        case 'B': return 7;
        case 'C': return 4;
        case 'D': return 1;
        default: return 0;
    }
};

// Helper: get grade color
const getGradeColor = (grade: string): string => {
    return GRADE_SYSTEM.find(g => g.letter === grade)?.color ?? '#9ca3af';
};

interface AcademicCompassProps {
    performanceAverage?: number | null;
}

const AcademicCompass = ({ performanceAverage = null }: AcademicCompassProps) => {
    const { userProfile, updateProfile } = useAuth();
    const colors = theme();
    if (!colors) return null;

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showTargetModal, setShowTargetModal] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

    const isVisible = userProfile?.isTargetVisible ?? true;
    const target = userProfile?.target ?? null;

    if (!isVisible) return null;

    const hasTarget = !!target;

    // --- Determine status when target is set ---
    const getStatus = () => {
        if (performanceAverage == null) {
            return { type: 'pending' as const };
        }
        const threshold = getTargetThreshold(target!);
        if (performanceAverage >= threshold) {
            return { type: 'ontrack' as const };
        }
        return { type: 'slipping' as const };
    };

    // --- Handle target confirmation ---
    const handleSetTarget = async () => {
        if (selectedGrade) {
            await updateProfile({ target: selectedGrade });
            setShowTargetModal(false);
            setSelectedGrade(null);
        }
    };

    // =================== STATE 1: No target set ===================
    if (!hasTarget) {
        return (
            <View style={styles.container}>
                {/* Header Row */}
                <View style={styles.headerRow}>
                    <Compass size={20} color={colors.secondary} style={styles.headerIcon} />
                    <Text style={styles.headerText}>Academic Compass</Text>
                </View>

                {/* Prompt */}
                <View style={styles.content}>
                    <Text style={[styles.questionText, { marginBottom: 3 }]}>Based on your current perfomance, are you on track or slipping?</Text>
                    <Text style={styles.questionText}>Set a target to be able to find out!</Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: colors.primary }]}
                            activeOpacity={0.8}
                            onPress={() => setShowTargetModal(true)}
                        >
                            <Text style={styles.primaryButtonText}>Set target now</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            activeOpacity={0.7}
                            onPress={() => setShowConfirmModal(true)}
                        >
                            <Text style={styles.secondaryButtonText}>No,thank you</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ---- Hide Confirmation Modal ---- */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={showConfirmModal}
                    onRequestClose={() => setShowConfirmModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalIconContainer}>
                                <EyeOff size={32} color={colors.primary} />
                            </View>

                            <Text style={styles.modalTitle}>Hide Academic Compass?</Text>
                            <Text style={styles.modalDescription}>
                                Would you like to remove this from your dashboard?
                                {"\n\n"}
                                <Text style={{ fontWeight: '600' }}>Note:</Text> You can toggle this feature back on later in your Account Management settings.
                            </Text>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: '#f3f4f6' }]}
                                    onPress={() => setShowConfirmModal(false)}
                                >
                                    <Text style={[styles.modalButtonText, { color: '#4b5563' }]}>Keep it</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: colors.primary }]}
                                    onPress={async () => {
                                        setShowConfirmModal(false);
                                        await updateProfile({ isTargetVisible: false });
                                    }}
                                >
                                    <Text style={[styles.modalButtonText, { color: '#fff' }]}>Hide it</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* ---- Set Target Modal ---- */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showTargetModal}
                    onRequestClose={() => {
                        setShowTargetModal(false);
                        setSelectedGrade(null);
                    }}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { paddingBottom: 20 }]}>
                            <View style={[styles.modalIconContainer, { backgroundColor: '#f5f0f5' }]}>
                                <Target size={32} color={colors.primary} />
                            </View>

                            <Text style={styles.modalTitle}>Set Your Target</Text>

                            {/* Grading System Explanation */}
                            <Text style={styles.gradingIntro}>
                                Academic Vault uses a <Text style={{ fontWeight: '700' }}>12-point</Text> grading system. Here's how it works:
                            </Text>

                            {/* Grade Table */}
                            <View style={styles.gradeTable}>
                                {/* Table Header */}
                                <View style={styles.gradeTableHeaderRow}>
                                    <Text style={[styles.gradeTableHeaderCell, { flex: 0.8 }]}>Grade</Text>
                                    <Text style={[styles.gradeTableHeaderCell, { flex: 1.2 }]}>Points / Unit</Text>
                                    <Text style={[styles.gradeTableHeaderCell, { flex: 1 }]}>Avg Range</Text>
                                </View>
                                {/* Table Rows */}
                                {GRADE_SYSTEM.map((g) => (
                                    <View key={g.letter} style={[styles.gradeTableRow, { backgroundColor: g.bg }]}>
                                        <Text style={[styles.gradeTableCell, { flex: 0.8, fontWeight: '700', color: g.color }]}>{g.letter}</Text>
                                        <Text style={[styles.gradeTableCell, { flex: 1.2 }]}>{g.points} pts</Text>
                                        <Text style={[styles.gradeTableCell, { flex: 1 }]}>{g.range}</Text>
                                    </View>
                                ))}
                                {/* F row */}
                                <View style={[styles.gradeTableRow, { backgroundColor: '#fafafa' }]}>
                                    <Text style={[styles.gradeTableCell, { flex: 0.8, fontWeight: '700', color: '#9ca3af' }]}>F</Text>
                                    <Text style={[styles.gradeTableCell, { flex: 1.2 }]}>0 pts</Text>
                                    <Text style={[styles.gradeTableCell, { flex: 1 }]}>Below 1</Text>
                                </View>
                            </View>

                            {/* Grade Picker */}
                            <Text style={styles.pickerLabel}>Pick your target grade:</Text>
                            <View style={styles.gradePickerRow}>
                                {GRADE_SYSTEM.map((g) => (
                                    <TouchableOpacity
                                        key={g.letter}
                                        style={[
                                            styles.gradePill,
                                            { borderColor: g.color },
                                            selectedGrade === g.letter && { backgroundColor: g.color },
                                        ]}
                                        onPress={() => setSelectedGrade(g.letter)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[
                                            styles.gradePillText,
                                            { color: g.color },
                                            selectedGrade === g.letter && { color: '#fff' },
                                        ]}>
                                            {g.letter}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Confirm / Cancel */}
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: '#f3f4f6' }]}
                                    onPress={() => {
                                        setShowTargetModal(false);
                                        setSelectedGrade(null);
                                    }}
                                >
                                    <Text style={[styles.modalButtonText, { color: '#4b5563' }]}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.modalButton,
                                        { backgroundColor: selectedGrade ? colors.primary : '#d1d5db' },
                                    ]}
                                    onPress={handleSetTarget}
                                    disabled={!selectedGrade}
                                >
                                    <Text style={[styles.modalButtonText, { color: '#fff' }]}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    // =================== STATE 2: Target is set ===================
    const status = getStatus();
    const targetGrade = GRADE_SYSTEM.find(g => g.letter === target);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Compass size={20} color={colors.secondary} style={styles.headerIcon} />
                <Text style={styles.headerText}>Academic Compass</Text>
            </View>

            {/* Target Badge */}
            <View style={styles.targetBadgeRow}>
                <View style={[styles.targetBadge, { borderColor: getGradeColor(target!) }]}>
                    <Target size={14} color={getGradeColor(target!)} />
                    <Text style={[styles.targetBadgeText, { color: getGradeColor(target!) }]}>Target: Grade {target}</Text>
                </View>
                <TouchableOpacity onPress={async () => { await updateProfile({ target: null }); }} activeOpacity={0.6}>
                    <Text style={styles.changeTargetText}>Change</Text>
                </TouchableOpacity>
            </View>

            {/* Status Display */}
            {status.type === 'pending' && (
                <View style={[styles.statusCard, { backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }]}>
                    <Clock size={22} color="#9ca3af" />
                    <View style={styles.statusTextContainer}>
                        <Text style={[styles.statusTitle, { color: '#6b7280' }]}>Awaiting Data</Text>
                        <Text style={styles.statusSubtitle}>A comparison will appear once your performance average is available.</Text>
                    </View>
                </View>
            )}

            {status.type === 'ontrack' && (
                <View style={[styles.statusCard, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
                    <TrendingUp size={22} color="#22c55e" />
                    <View style={styles.statusTextContainer}>
                        <Text style={[styles.statusTitle, { color: '#16a34a' }]}>On Track!</Text>
                        <Text style={styles.statusSubtitle}>
                            Your average of <Text style={{ fontWeight: '700' }}>{performanceAverage?.toFixed(1)}</Text> meets your Grade {target} target ({targetGrade?.range}).
                        </Text>
                    </View>
                </View>
            )}

            {status.type === 'slipping' && (
                <View style={[styles.statusCard, { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}>
                    <TrendingDown size={22} color="#ef4444" />
                    <View style={styles.statusTextContainer}>
                        <Text style={[styles.statusTitle, { color: '#dc2626' }]}>Slipping</Text>
                        <Text style={styles.statusSubtitle}>
                            Your average of <Text style={{ fontWeight: '700' }}>{performanceAverage?.toFixed(1)}</Text> is below your Grade {target} target ({targetGrade?.range}).
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        borderWidth: 1,
        borderColor: '#f0ede6',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    headerIcon: {
        marginRight: 8,
    },
    headerText: {
        fontFamily: 'LoveYa',
        fontSize: 20,
        color: '#374151',
    },
    content: {
        marginTop: 6,
    },
    questionText: {
        fontFamily: 'Inter',
        fontSize: 14,
        color: '#4b5563be',
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonText: {
        color: '#FFF',
        fontFamily: 'Inter',
        fontWeight: 800,
        fontSize: 13,
    },
    secondaryButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    secondaryButtonText: {
        color: '#6B7280',
        fontFamily: 'Inter',
        fontSize: 13,
    },
    // ========== Modal Styles ==========
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        alignItems: 'center',
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
    },
    modalIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#f3f0f3',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontFamily: 'LoveYa',
        fontSize: 22,
        color: '#374151',
        marginBottom: 12,
        textAlign: 'center',
    },
    modalDescription: {
        fontFamily: 'Inter',
        fontSize: 15,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalButtonText: {
        fontFamily: 'Inter',
        fontWeight: '700',
        fontSize: 14,
    },
    // ========== Target Modal - Grading Table ==========
    gradingIntro: {
        fontFamily: 'Inter',
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 21,
        marginBottom: 16,
    },
    gradeTable: {
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginBottom: 20,
    },
    gradeTableHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#f9fafb',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    gradeTableHeaderCell: {
        fontFamily: 'Inter',
        fontWeight: '600',
        fontSize: 12,
        color: '#9ca3af',
        textTransform: 'uppercase',
    },
    gradeTableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    gradeTableCell: {
        fontFamily: 'Inter',
        fontSize: 14,
        color: '#374151',
    },
    // ========== Target Modal - Grade Picker ==========
    pickerLabel: {
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    gradePickerRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    gradePill: {
        width: 52,
        height: 52,
        borderRadius: 16,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gradePillText: {
        fontFamily: 'LoveYa',
        fontSize: 22,
    },
    // ========== State 2 - Target Set View ==========
    targetBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
        marginBottom: 12,
    },
    targetBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderWidth: 1.5,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    targetBadgeText: {
        fontFamily: 'Inter',
        fontWeight: '600',
        fontSize: 13,
    },
    changeTargetText: {
        fontFamily: 'Inter',
        fontSize: 13,
        color: '#9B7B95',
        textDecorationLine: 'underline',
    },
    statusCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        borderRadius: 14,
        borderWidth: 1,
        padding: 14,
    },
    statusTextContainer: {
        flex: 1,
    },
    statusTitle: {
        fontFamily: 'LoveYa',
        fontSize: 18,
        marginBottom: 4,
    },
    statusSubtitle: {
        fontFamily: 'Inter',
        fontSize: 13,
        color: '#6b7280',
        lineHeight: 19,
    },
});

export default AcademicCompass;
