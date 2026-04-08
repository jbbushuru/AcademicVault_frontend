import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Typography, theme } from '@/src/styles';
import NumberSelectorComponent from './ui/numberDropdown';
import CustomDropdown from './ui/dropdown';

interface OnboardingSettings {
    maxLessons: number;
    lessonDuration: number;
    firstLessonStartTime: number;
    notificationsEnabled: boolean;
    alertLeadTime: number;
}

interface TTOnboardingProps {
    onComplete: (settings: OnboardingSettings) => void;
}

const TTOnboarding: React.FC<TTOnboardingProps> = ({ onComplete }) => {
    const colors = theme();
    if (!colors) return null;

    const [tempSettings, setTempSettings] = useState<OnboardingSettings>({
        maxLessons: 0,
        lessonDuration: 0,
        firstLessonStartTime: 0,
        notificationsEnabled: true,
        alertLeadTime: 15,
    });

    const isComplete = 
        tempSettings.maxLessons > 0 && 
        tempSettings.lessonDuration > 0 && 
        tempSettings.firstLessonStartTime > 0;

    return (
        <View style={[styles.onboardingOverlay, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.onboardingContent} showsVerticalScrollIndicator={false}>
                <View style={styles.onboardingHeader}>
                    <Text style={[Typography.presets.Slogan, { color: colors.primary }]}>Setup Timetable</Text>
                    <Text style={[Typography.presets.subtitle, { color: colors.subtext, textAlign: 'center', marginTop: 10 }]}>
                        Let's customize your academic routine to fit your needs.
                    </Text>
                </View>

                <View style={styles.onboardingSection}>
                    <Text style={[styles.onboardingLabel, { color: colors.text }]}>What is the maximum number of lessons you can have in a day?</Text>
                    <NumberSelectorComponent
                    maxNumber={8}
                    onNumberSelected={(value) => setTempSettings(s => ({ ...s, maxLessons: value }))}
                    placeholder="Select number of lessons"
                    />
                </View>

                <View style={styles.onboardingSection}>
                    <Text style={[styles.onboardingLabel, { color: colors.text }]}>Lesson duration (hours)?</Text>
                    <CustomDropdown
                        data={[1,2,3,4,5]}
                        onSelect={(value) => setTempSettings(s => ({ ...s, lessonDuration: value }))}
                        placeholder="Select duration"
                    />
                </View>

                <View style={styles.onboardingSection}>
                    <Text style={[styles.onboardingLabel, { color: colors.text }]}>What time does the first lesson start?</Text>
                    <CustomDropdown
                        data={[6, 7, 8, 9, 10, 11].map(h => ({ label: `${h}:00 AM`, value: h }))}
                        onSelect={(value) => setTempSettings(s => ({ ...s, firstLessonStartTime: value }))}
                        placeholder="Select start time"
                    />
                </View>

                <View style={[styles.onboardingSection, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
                    <Text style={[styles.onboardingLabel, { color: colors.text, marginBottom: 0 }]}>Enable Lesson Reminders</Text>
                    <TouchableOpacity 
                        style={[styles.toggleButton, tempSettings.notificationsEnabled ? styles.toggleOn : styles.toggleOff, { borderColor: colors.primary }]}
                        onPress={() => setTempSettings(s => ({ ...s, notificationsEnabled: !s.notificationsEnabled }))}
                    >
                        <Text style={{ color: tempSettings.notificationsEnabled ? '#FFF' : colors.primary }}>
                            {tempSettings.notificationsEnabled ? 'ON' : 'OFF'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {tempSettings.notificationsEnabled && (
                    <View style={styles.onboardingSection}>
                        <Text style={[styles.onboardingLabel, { color: colors.text }]}>Remind me before class starts (minutes)</Text>
                        <CustomDropdown
                            data={[5, 10, 15, 30, 60].map(m => ({ label: `${m} mins`, value: m }))}
                            onSelect={(value) => setTempSettings(s => ({ ...s, alertLeadTime: value }))}
                            placeholder="Select lead time"
                        />
                    </View>
                )}

                <TouchableOpacity 
                    style={[
                        styles.getStartedButton, 
                        { backgroundColor: isComplete ? colors.button : colors.subtext + '30' }
                    ]}
                    onPress={() => isComplete && onComplete(tempSettings)}
                    disabled={!isComplete}
                >
                    <Text style={[styles.getStartedText, { opacity: isComplete ? 1 : 0.6 }]}>Start Timetable</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    onboardingOverlay: {
        flex: 1,   
        padding: 20,
        paddingTop: 12,
    },
    onboardingContent: {
        flex:1,
        justifyContent:'center',
        alignItems: 'center',
    },
    onboardingHeader: {
        alignItems: 'center',
        marginBottom: 12,
    },
    onboardingSection: {
        width: '100%',
        marginBottom: 24,
    },
    onboardingLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 16,
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    optionsScroll: {
        flexDirection: 'row',
    },
    optionPill: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    optionText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748B',
    },
    getStartedButton: {
        width: '100%',
        padding: 18,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
    },
    getStartedText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    toggleButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1.5,
    },
    toggleOn: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
    },
    toggleOff: {
        backgroundColor: 'transparent',
    }
});

export default TTOnboarding;
