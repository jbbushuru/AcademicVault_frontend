// src/screens/timetable/utils.ts

import { TTView, useTimetable } from "@/src/context/TimetableContext";
import { theme } from "@/src/styles";
import { useRouter } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Upload } from "lucide-react-native";
import { Settings as SettingsIcon } from "lucide-react-native";
import GenericPillSelector from "@/src/components/ui/pillSelector";
import DailyTTView from "@/src/components/dailyTTview";
import WeeklyTTView from "@/src/components/weeklyTTview";
import { Dimensions, StyleSheet } from "react-native";

export const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },

    // Stats Card
    statsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
    },
    statItem: {
        alignItems: 'center',
        gap: 6,
    },
    statValue: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    statDivider: {
        width: 1,
        height: 40,
    },

    // Section Card
    section: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 18,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    sectionSubtitle: {
        fontSize: 13,
        marginTop: 2,
    },

    // Pill Selectors
    pillRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    pill: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 14,
        borderWidth: 1,
        minWidth: 52,
        alignItems: 'center',
    },
    pillWide: {
        paddingHorizontal: 16,
    },
    pillText: {
        fontSize: 15,
        fontWeight: '600',
    },

    // Danger Zone
    dangerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
    },
    dangerButtonTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    dangerButtonSub: {
        fontSize: 12,
        marginTop: 2,
    },

    // Save Bar
    saveBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingBottom: 24,
        borderTopWidth: 1,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 16,
        borderRadius: 16,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
    },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    zIndex: 10,
  },
});


