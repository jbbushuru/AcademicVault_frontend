import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from "react-native";
import { User, LogOut, Lock, ChevronRight, LayoutDashboard, Circle } from "lucide-react-native";
import { useAuth } from "@/src/context/AuthContext";
import { useAcademic } from "@/src/context/AcademicContext";
import { Typography, theme } from "@/src/styles";
import { useRouter } from "expo-router";

const NavBar = () => {
    const { logout, userProfile } = useAuth();
    const { currentContext, setCurrentContext } = useAcademic();
    const router = useRouter();
    const colors = theme();

    const userYear = userProfile?.year || 1;
    const userSemester = userProfile?.semester || 1;
    const courseDuration = userProfile?.courseDuration || 4;

    const menuItems = [
        { label: 'Overall', locked: false },
        ...Array.from({ length: courseDuration }, (_, i) => ({
            label: `Year ${i + 1}`,
            locked: userYear < (i + 1)
        }))
    ];

    const handleAccountManagement = () => {
        // router.push("/account"); // Screen to be created later as per user request
    };

    return (
        <View style={{padding:20,paddingBottom:30}}>
            {/* User Profile Header */}
            <View style={styles.header}>
                <View style={styles.avatarWrapper}>
                    <View style={styles.avatarContainer}>
                        <User size={40} color={"#fff"} />
                    </View>
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{userProfile?.name || "STUDENT ONE"}</Text>
                    <Text style={styles.userCourse}>{userProfile?.course || "SOFTWARE ENGINEERING"}</Text>
                    <Text style={styles.userDetails}>YEAR {userYear} | SEMESTER {userSemester}</Text>
                </View>
            </View>

            {/* Menu Items */}
            <ScrollView showsVerticalScrollIndicator={false} style={styles.menuContainer}>
                {menuItems.map((item, index) => {
                    const isActive = currentContext === item.label;
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.menuItem,
                                isActive && styles.activeMenuItem,
                                item.locked && styles.lockedMenuItem
                            ]}
                            onPress={() => !item.locked && setCurrentContext(item.label)}
                            disabled={item.locked}
                        >
                            <View style={styles.menuItemContent}>
                                <Circle 
                                    size={12} 
                                    fill={isActive ? "#000" : item.locked ? "#9ca3af" : "#7B5E77"} 
                                    color={isActive ? "#000" : item.locked ? "#9ca3af" : "#7B5E77"}
                                    style={styles.circleIcon}
                                />
                                <Text style={[
                                    styles.menuItemText,
                                    isActive && styles.activeText,
                                    item.locked && styles.lockedText
                                ]}>
                                    {item.label}
                                </Text>
                            </View>
                            {item.locked && <Lock size={20} color="#6b7280" />}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Text style={styles.logoutText}>Log out</Text>
                    <LogOut size={20} color="#f97316" />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.accountLink}
                    onPress={handleAccountManagement}
                >
                    <Text style={styles.accountText}>MANAGE YOUR VAULT ACCOUNT</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFEF5', // Cream background from image
        padding: 24,
        borderRadius: 32,
        margin: 10,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
    },
    avatarWrapper: {
        borderWidth: 1,
        borderColor: '#C8B6C4',
        borderRadius: 50,
        padding: 3,
        marginRight: 15,
    },
    avatarContainer: {
        width: 50,
        height: 50,
        backgroundColor: '#C8B6C4',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 14,
        color: '#374151',
        textTransform: 'uppercase',
        fontFamily: 'InterBold',
    },
    userCourse: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
        marginTop: 2,
    },
    userDetails: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 4,
        textTransform: 'uppercase',
    },
    menuContainer: {
        marginTop: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 50,
        backgroundColor: '#e5e7eb', // Default gray
        marginBottom: 12,
    },
    activeMenuItem: {
        backgroundColor: '#C8B6C4', // Muted purple gray
    },
    lockedMenuItem: {
        backgroundColor: '#e5e7eb',
        opacity: 0.7,
    },
    menuItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    circleIcon: {
        marginRight: 12,
    },
    menuItemText: {
        fontSize: 18,
        color: '#374151',
        fontWeight: '500',
    },
    activeText: {
        color: '#000',
        fontWeight: '600',
    },
    lockedText: {
        color: '#9ca3af',
    },
    footer: {
        marginTop: 'auto',
        alignItems: 'center',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef3c7',
        borderWidth: 1.5,
        borderColor: '#f97316',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 30,
        alignSelf: 'flex-end',
        marginBottom: 12,
    },
    logoutText: {
        color: '#f97316',
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 8,
        fontFamily: 'LoveYa',
    },
    accountLink: {
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        width: '100%',
        paddingTop: 15,
        alignItems: 'center',
    },
    accountText: {
        fontFamily: 'LoveYa',
        fontSize: 16,
        color: '#C6005C',
        textAlign: 'center',
    },
});

export default NavBar;
