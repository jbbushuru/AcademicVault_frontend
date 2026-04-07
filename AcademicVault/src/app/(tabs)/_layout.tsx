// src/app/tabs/_layout.tsx

import { router, Tabs } from "expo-router";
import { LayoutDashboard, BookOpen, CalendarClock, ClipboardCheck, Menu } from "lucide-react-native";
import { View, Image, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback,Text } from "react-native";
import { theme } from "@/src/styles";
import { useAuth } from "@/src/context/AuthContext";


export default function TabsLayout() {
    const iconSize = 24;
    const colors = theme();
    if (!colors) return null;
    const { userProfile } = useAuth();
    const userName = userProfile?.firstName|| "User";

    return (
        <View style={{ flex: 1 }}>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.tabIconDefault,
                    tabBarStyle: {
                        backgroundColor: colors.tint,
                        borderTopWidth: 0,
                    },
                    headerShown: true,
                    headerBackground:()=>(
                        <View style={{ backgroundColor: colors.primary+'30', flex: 1}} />
                    ),
                    headerTitle:()=>(
                        <View>
                            <Text style={{ color: colors.secondary, fontFamily: 'LoveYa', fontSize: 20 }}>Academic Vault</Text>
                            <Text style={{ color: colors.primary, fontFamily: 'LoveYa', fontSize: 14 }}>Welcome {userName}</Text>
                        </View>
                    ),
                    headerLeft: () => (
                        <View style={{ marginLeft: 20 }}>
                            <Image source={require("@/assets/images/icon.png")} style={{ width: 45, height: 45, borderRadius: 45 }} resizeMode="contain" />
                        </View>
                    ),
                    headerRight: () => (
                        <View style={{ marginRight: 20 }}>
                            <TouchableOpacity 
                             onPress={() => {router.push("/account" as any);}}
                            >
                                <Menu size={24} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            >
                <Tabs.Screen name="index" options={{
                    tabBarLabel: "Dashboard",
                    tabBarIcon: ({ color }) => (
                        <LayoutDashboard size={iconSize} color={color} />
                    ),
                }} />
                <Tabs.Screen name="units" options={{
                    tabBarLabel: "Units",
                    tabBarIcon: ({ color }) => (
                        <BookOpen size={iconSize} color={color} />
                    ),
                }} />
                <Tabs.Screen name="timetable" options={{
                    tabBarLabel: "Timetable",
                    tabBarIcon: ({ color }) => (
                        <CalendarClock size={iconSize} color={color} />
                    ),
                }} />
                <Tabs.Screen name="tasks" options={{
                    tabBarLabel: "Tasks",
                    tabBarIcon: ({ color }) => (
                        <ClipboardCheck size={iconSize} color={color} />
                    ),
                }} />
            </Tabs>
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: '75%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingBottom: 20,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#e5e7eb',
        borderRadius: 2.5,
        alignSelf: 'center',
        marginVertical: 12,
    },
});