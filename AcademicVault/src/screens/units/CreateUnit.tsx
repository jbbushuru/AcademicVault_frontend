// src/screens/CreateUnit.tsx

import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView, ActivityIndicator, Alert, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, Typography, uselogincardstyles } from "../../styles";
import { Sparkles, Hash, Award, Calendar, Trash2, Plus, Zap } from "lucide-react-native";
import { router } from "expo-router";
import RouteHeader from "../../components/ui/routeHeader";
import { useAcademic, Unit } from "../../context/AcademicContext";
import { useAuth } from "../../context/AuthContext";
import CustomDropdown from "../../components/ui/dropdown";
import NumberSelectorComponent from "../../components/ui/numberDropdown";
import { DraftUnit } from "../../constants/types";
import { INITIAL_DRAFT, gradeToPoints } from "./utils";

export default function CreateUnit() {
    const colors = theme();
    const logincardstyles = uselogincardstyles();
    const { bulkAddUnits, getSuggestedCategory, categories, refreshData } = useAcademic();
    const { userProfile } = useAuth();
    const duration = userProfile?.courseDuration;
    const system = userProfile?.academicSystem;

    // Global settings for this batch
    const [year, setYear] = useState<number>(userProfile?.year || 1);
    const [term, setTerm] = useState<number>(userProfile?.term || 1);

    // Rows
    const [rows, setRows] = useState<DraftUnit[]>([INITIAL_DRAFT()]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleGradeSelect = (id: string, grade: string) => {
        const points = gradeToPoints[grade] || "";
        updateRow(id, { grade, points });
    };

    useEffect(() => {
        if (categories.length === 0) refreshData();
    }, []);

    const addRow = () => setRows([...rows, INITIAL_DRAFT()]);

    const deleteRow = (id: string) => {
        if (rows.length === 1) return;
        setRows(rows.filter(r => r.id !== id));
    };

    const updateRow = (id: string, updates: Partial<DraftUnit>) => {
        setRows(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    };

    // Auto-suggestion logic per row
    const handleNameChange = (id: string, text: string) => {
        updateRow(id, { name: text });

        // Debounced suggestion
        const timer = setTimeout(async () => {
            if (text.trim().length > 3) {
                updateRow(id, { isSuggesting: true });
                const result = await getSuggestedCategory(text.trim());
                if (result?.suggestedCategory) {
                    updateRow(id, {
                        category: result.suggestedCategory._id,
                        suggestion: result.suggestedCategory.name,
                        isSuggesting: false
                    });
                } else {
                    updateRow(id, { isSuggesting: false, suggestion: undefined });
                }
            }
        }, 800);

        return () => clearTimeout(timer);
    };

    const handleSync = async () => {
        // Validate all rows
        const invalid = rows.find(r => !r.name || !r.unitCode || !r.grade || !r.points || !r.category);
        if (invalid) {
            Alert.alert("Incomplete Rows", "Please fill in all details for all units before syncing.");
            return;
        }

        setIsSubmitting(true);
        try {
            const batch = rows.map(r => ({
                name: r.name,
                unitCode: r.unitCode,
                grade: r.grade,
                points: parseFloat(r.points),
                year,
                term,
                category: r.category
            }));

            const result = await bulkAddUnits(batch);
            if (result) {
                Alert.alert("Vault Updated", `${rows.length} ${rows.length === 1? "unit": "units" } have been linked to your academic record.`);
                router.back();
            }
        } catch (e) {
            Alert.alert("Sync Failed", "Check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <RouteHeader title="Add Unit" />

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >

            {/* Global Settings Bar - Now Interactive */}
            <View style={[styles.headerBar, { backgroundColor: colors.background, borderBottomColor: isSubmitting ? 'transparent' : colors.primary + '20' }]}>
                <View style={styles.batchInfo}>
                    <Calendar size={16} color={colors.primary} />
                    <Text style={[styles.batchLabel, { color: colors.text }]}>Entry for: </Text>
                    <View style={styles.interactivePath}>
                        <View style={{ width: 90, marginRight: 8 }}>
                            <CustomDropdown
                                data={[...Array(duration).keys()].map(i => i + 1).map(h => ({ label: `Year ${h}`, value: h }))}
                                onSelect={(value) => setYear(value)}
                                placeholder={`Year ${year}`}
                            />
                        </View>
                        <View style={{ width: 120 }}>
                            <CustomDropdown
                                data={[...Array(system === 'Semester' ? 2 : 3).keys()].map(i => i + 1).map(h => ({ label: `${userProfile?.academicSystem} ${h}`, value: h }))}
                                onSelect={(value) => setTerm(value)}
                                placeholder={`${userProfile?.academicSystem} ${term}`}
                            />
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {rows.map((row, index) => (
                    <View key={row.id} style={[styles.rowCard, { backgroundColor: colors.tint }]}>
                        <View style={styles.rowHeader}>
                            <View style={[styles.indexPill, { backgroundColor: colors.primary + '20' }]}>
                                <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 12 }}>Unit #{index + 1}</Text>
                            </View>
                            <TouchableOpacity onPress={() => deleteRow(row.id)}>
                                <Trash2 size={18} color="#EF4444" opacity={rows.length > 1 ? 1 : 0.2} />
                            </TouchableOpacity>
                        </View>

                        <View style={[{ display: 'flex', flexDirection: 'row', gap: 12, width: '100%' }]}>
                            <View style={{ flex: 1 }}>
                            <Text style={[logincardstyles.label, Typography.presets.subtitle]}>Unit Code</Text>
                            <TextInput
                                style={[logincardstyles.input, { width: '100%' }, Typography.presets.subtitle]}
                                onChangeText={(t) => updateRow(row.id, { unitCode: t })}
                                placeholder="CS101"
                                placeholderTextColor={"#b1b1b1"}
                                keyboardType="default"
                                autoCapitalize='characters'
                                value={row.unitCode}
                            />
                            </View>

                            <View style={{ flex: 2.5 }}>
                            <Text style={[logincardstyles.label, Typography.presets.subtitle]}>Unit Name</Text>
                            <TextInput
                                style={[logincardstyles.input, { width: '100%' }, Typography.presets.subtitle]}
                                onChangeText={(t) => handleNameChange(row.id, t)}
                                placeholder="Introduction to Programming"
                                placeholderTextColor={"#b1b1b1"}
                                keyboardType="default"
                                autoCapitalize='words'
                                value={row.name}
                            />
                            {row.suggestion && (
                                <View style={styles.suggestionBadge}>
                                    <Sparkles size={10} color="#8B5CF6" />
                                    <Text style={styles.suggestionText}>Smart Categorized: {row.suggestion}</Text>
                                </View>
                            )}
                            </View>
                        </View>

                        <View style={[styles.fieldGrid, { marginTop: 12,flexDirection: 'row', flex: 1 ,gap:12}]}>
                            {/* Grade & Auto-filling Points */}
                            <View style={{ flex: 0.7 }}>
                                <Text style={[logincardstyles.label, Typography.presets.subtitle]}>Grade</Text>
                                <CustomDropdown
                                    data={["A", "B", "C", "D", "E", "F"]}
                                    onSelect={(v) => handleGradeSelect(row.id, v)}
                                    placeholder="A"
                                />
                            </View>
                            <View style={{ flex: 0.5 }}>
                                <Text style={[logincardstyles.label, Typography.presets.subtitle]}>Points</Text>
                                <TextInput
                                    style={[logincardstyles.input, Typography.presets.subtitle]}
                                    placeholder="Points"
                                    keyboardType="numeric"
                                    value={row.points}
                                    onChangeText={(t) => updateRow(row.id, { points: t })}
                                    editable={false}
                                />
                            </View>
                            {/* Category Mapping */}
                            <View style={{ flex: 2 }}>
                                <Text style={[logincardstyles.label, Typography.presets.subtitle]}>Category</Text>
                                <CustomDropdown
                                    data={categories.map(c => ({ label: c.name, value: c._id }))}
                                    onSelect={(v) => updateRow(row.id, { category: v })}
                                    placeholder="Mathematics"
                                />
                            </View>
                        </View>
                    </View>
                ))}

                <TouchableOpacity style={[styles.addButton, { borderColor: colors.primary }]} onPress={addRow}>
                    <Plus size={20} color={colors.primary} />
                    <Text style={[styles.addText, { color: colors.primary }]}>Add another unit</Text>
                </TouchableOpacity>

                <View style={{ height: 120 }} />
            </ScrollView>

            
            </KeyboardAvoidingView>
            {/* Bulk Submit Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.syncButton, { backgroundColor: colors.button }]}
                    onPress={handleSync}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <ActivityIndicator color="#FFF" /> : (
                        <>
                            <Text style={styles.syncText}>Add {rows.length} {rows.length === 1? "Unit": "Units" } to Yr {year} {system === 'Semester'?'Sem': 'Term'} {term}</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        zIndex: 50, // For dropdowns
    },
    batchInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    batchLabel: {
        fontSize: 13,
        marginLeft: 8,
        fontFamily: Typography.fonts.body,
    },
    interactivePath: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    scrollContent: {
        padding: 16,
    },
    // ... other styles same as before
    rowCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    rowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    indexPill: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    fieldGrid: {
        flexDirection: 'row',
    },
    compactInput: {
        height: 48,
        fontSize: 14,
    },
    suggestionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        marginLeft: 4,
    },
    suggestionText: {
        fontSize: 10,
        color: '#8B5CF6',
        marginLeft: 4,
        fontWeight: '600',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 16,
        marginTop: 8,
        gap: 8,
    },
    addText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    footer: {
        position: 'absolute',
        bottom: 3,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: 'transparent',
    },
    syncButton: {
        height: 60,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        elevation: 10,
    },
    syncText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    }
});