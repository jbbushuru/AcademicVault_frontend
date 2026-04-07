// src/components/ui/currentStats.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Swords, Sparkles, BookOpen } from "lucide-react-native";
import { useAuth } from "@/src/context/AuthContext";
import { useAcademic } from "@/src/context/AcademicContext";
import { theme } from "@/src/styles";

const CurrentStats = () => {
    const { userProfile } = useAuth();
    const { currentContext } = useAcademic();
    const colors = theme();

    const currentYear = userProfile?.year || 1;
    const currentTerm = userProfile?.term || 1;
    const courseDuration = userProfile?.courseDuration || 4;
    // 'semester' or 'trimester'
    const academicSystem: string = userProfile?.academicSystem || 'semester';
    const termsPerYear = academicSystem === 'trimester' ? 3 : 2;

    const termLabel = 'Term';

    // Determine what to display based on context
    const isOverall = currentContext === 'Overall';
    // Extract year number from "Year X" context
    const contextYear = isOverall ? null : parseInt(currentContext.replace('Year ', ''));

    // ---------- XP Calculation ----------
    let termsCovered: number;
    let termsToBeCovered: number;

    if (isOverall) {
        // Overall context
        termsCovered = (currentYear * termsPerYear) - (termsPerYear - currentTerm) - 1;
        termsToBeCovered = courseDuration * termsPerYear;
    } else {
        // Yearly context
        termsToBeCovered = termsPerYear;

        if (contextYear! < currentYear) {
            // Past year — fully completed
            termsCovered = termsToBeCovered;
        } else if (contextYear! === currentYear) {
            // Current year
            termsCovered = currentTerm - 1;
        } else {
            // Future year (shouldn't be reachable since it's locked, but safety)
            termsCovered = 0;
        }
    }

    // Clamp values
    termsCovered = Math.max(0, Math.min(termsCovered, termsToBeCovered));
    const progressPercent = termsToBeCovered > 0 ? (termsCovered / termsToBeCovered) * 100 : 0;

    // Display values for Level and Sublevel cards
    const displayYear = isOverall ? `Year ${currentYear}` : `Year ${contextYear}`;
    const displayTerm = isOverall
        ? `${termLabel} ${currentTerm}`
        : contextYear! < currentYear
            ? `${termLabel} ${termsPerYear}` // completed year shows last term
            : contextYear! === currentYear
                ? `${termLabel} ${currentTerm}`
                : `${termLabel} 1`; // future year

    // If it's overall OR it's the year the user is currently in
    const showsCurrent = isOverall || (contextYear === currentYear);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <Swords size={22} color={colors.secondary} style={styles.headerIcon} />
                <Text style={styles.headerText}>{showsCurrent ? "Your Current Stats" : "Your Stats"}</Text>
            </View>

            {/* Level + Sublevel Cards */}
            <View style={styles.cardsRow}>
                {/* Level Card */}
                <View style={[styles.card, styles.levelCard]}>
                    <View style={styles.cardLabelRow}>
                        <Sparkles size={16} color={colors.primary} />
                        <Text style={styles.cardLabel}>Level</Text>
                    </View>
                    <Text style={styles.cardValue}>{displayYear}</Text>
                </View>

                {/* Sublevel Card */}
                {showsCurrent && (
                    <View style={[styles.card, styles.sublevelCard]}>
                        <View style={styles.cardLabelRow}>
                            <BookOpen size={16} color="#6B8E7B" />
                            <Text style={[styles.cardLabel, { color: '#6B8E7B' }]}>Sublevel</Text>
                        </View>
                        <Text style={[styles.cardValue, { color: '#6B8E7B' }]}>{displayTerm}</Text>
                    </View>
                )}
            </View>

            {/* Scholar XP */}
            <View>
                <View style={styles.xpLabelRow}>
                    <View style={styles.xpLabelLeft}>
                        <Sparkles size={14} color={colors.primary} />
                        <Text style={styles.xpLabel}>Scholar Chapters</Text>
                    </View>
                    <Text style={styles.xpFraction}>
                        <Text style={styles.xpCurrent}>{termsCovered}</Text>
                        /{termsToBeCovered}
                    </Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                </View>
            </View>
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
        marginBottom: 12,
    },
    headerIcon: {
        marginRight: 8,
    },
    headerText: {
        fontFamily: 'LoveYa',
        fontSize: 18,
        color: '#374151',
    },
    cardsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom:16,
    },
    card: {
        flex: 1,
        borderRadius: 16,
        padding: 12,
        borderWidth: 1.5,
    },
    levelCard: {
        backgroundColor: '#f5f0f5',
        borderColor: '#C8B6C4',
    },
    sublevelCard: {
        backgroundColor: '#f0f5f2',
        borderColor: '#B6C8BC',
    },
    cardLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    cardLabel: {
        fontSize: 12,
        color: '#9B7B95',
        fontFamily: 'Inter',
    },
    cardValue: {
        fontFamily: 'LoveYa',
        fontSize: 22,
        color: '#604C5F',
    },
    xpLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    xpLabelLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    xpLabel: {
        fontSize: 13,
        color: '#6b7280',
        fontFamily: 'Indie',
    },
    xpFraction: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#374151',
    },
    xpCurrent: {
        fontWeight: 'bold',
        color: '#374151',
    },
    progressBarBg: {
        height: 10,
        borderRadius: 12,
        backgroundColor: '#f0ede6',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 12,
        backgroundColor: '#C8B6C4',
    },
});

export default CurrentStats;
