// src/screens/AccountMgt.tsx

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch, 
  ScrollView
} from 'react-native';
import { 
  User, 
  ChevronLeft, 
  Settings, 
  Bell, 
  Eye, 
  ShieldCheck, 
  BadgeCheck 
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { Typography, theme } from '../styles';
import { useRouter } from 'expo-router';

export default function AccountMgtScreen() {
    const { userProfile, updateProfile } = useAuth();
    if (!userProfile) return null;
    const router = useRouter();
    const colors = theme();
    if (!colors) return null;

    // Local states for toggles (initialized from profile)
    const [isTargetVisible, setIsTargetVisible] = useState(userProfile?.isTargetVisible ?? true);
    const [studyReminders, setStudyReminders] = useState(userProfile?.studyReminders ?? true);
    const [assignmentAlerts, setAssignmentAlerts] = useState(userProfile?.assignmentAlerts ?? true);

    const handleToggleTargetVisibility = async (value: boolean) => {
        setIsTargetVisible(value);
        await updateProfile({ isTargetVisible: value });
    };

    const handleToggleStudyReminders = async (value: boolean) => {
        setStudyReminders(value);
        await updateProfile({ studyReminders: value });
    };

    const handleToggleAssignmentAlerts = async (value: boolean) => {
        setAssignmentAlerts(value);
        await updateProfile({ assignmentAlerts: value });
    };



    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={28} color={colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, Typography.presets.Headertitle]}>Vault Settings</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Profile Overview */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <User size={50} color="#fff" />
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{userProfile?.firstName} {userProfile?.lastName}</Text>
                        <Text style={styles.userEmail}>{userProfile?.email || "YourEmail@email.com"}</Text>
                        <View style={styles.badgeRow}>
                            <View style={styles.badge}>
                                <BadgeCheck size={14} color={colors.primary} />
                                <Text style={styles.badgeText}>{userProfile?.course || ""}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Dashboard Settings Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Settings size={20} color={colors.primary} />
                        <Text style={styles.sectionTitle}>DASHBOARD DISPLAY</Text>
                    </View>
                    
                    <View style={styles.settingItem}>
                        <View style={styles.settingLabelGroup}>
                            <Eye size={20} color="#6B7280" />
                            <View style={{ marginLeft: 12 }}>
                                <Text style={styles.settingLabel}>Display Academic Target</Text>
                                <Text style={styles.settingSubLabel}>Toggle the Compass visibility</Text>
                            </View>
                        </View>
                        <Switch
                            value={isTargetVisible}
                            onValueChange={handleToggleTargetVisibility}
                            trackColor={{ false: '#D1D5DB', true: colors.primary + '80' }}
                            thumbColor={isTargetVisible ? colors.primary : '#F3F4F6'}
                        />
                    </View>
                </View>

                {/* App Preferences */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Bell size={20} color={colors.primary} />
                        <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
                    </View>
                    
                    <View style={styles.settingItem}>
                        <View style={styles.settingLabelGroup}>
                            <Text style={styles.settingLabel}>Study Reminders</Text>
                        </View>
                        <Switch 
                            value={studyReminders} 
                            onValueChange={handleToggleStudyReminders}
                            trackColor={{ false: '#D1D5DB', true: colors.primary + '80' }} 
                            thumbColor={studyReminders ? colors.primary : '#F3F4F6'}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLabelGroup}>
                            <Text style={styles.settingLabel}>Assignment Alerts</Text>
                        </View>
                        <Switch 
                            value={assignmentAlerts} 
                            onValueChange={handleToggleAssignmentAlerts}
                            trackColor={{ false: '#D1D5DB', true: colors.primary + '80' }} 
                            thumbColor={assignmentAlerts ? colors.primary : '#F3F4F6'}
                        />
                    </View>
                </View>

                {/* Privacy & Security */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <ShieldCheck size={20} color={colors.primary} />
                        <Text style={styles.sectionTitle}>PRIVACY & SECURITY</Text>
                    </View>
                    
                    <View style={styles.settingItem}>
                        <TouchableOpacity style={styles.settingLabelGroup}>
                            <Text style={styles.settingLabel}>Change Password</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.settingItem}>
                        <TouchableOpacity style={styles.settingLabelGroup}>
                            <Text style={[styles.settingLabel, { color: '#EF4444' }]}>Delete Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.versionText}>Academic Vault v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        color: '#374151',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    avatarContainer: {
        width: 70,
        height: 70,
        backgroundColor: '#C8B6C4',
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        borderWidth: 2,
        borderColor: '#F3F4F6',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        fontFamily: 'InterBold',
    },
    userEmail: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    badgeRow: {
        flexDirection: 'row',
        marginTop: 8,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        gap: 6,
    },
    badgeText: {
        fontSize: 12,
        color: '#4B5563',
        fontWeight: '500',
    },
    section: {
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '700',
        letterSpacing: 1,
    },
    settingItem: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
        borderWidth:0.5,
        borderColor:'#C8B6C4',
    },
    settingLabelGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingLabel: {
        fontSize: 16,
        color: '#374151',
        fontWeight: '500',
    },
    settingSubLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 10,
    }
});
