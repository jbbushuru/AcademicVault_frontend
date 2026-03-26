// src/app/tabs/_layout.tsx

import { Tabs } from "expo-router";
import { LayoutDashboard, BookOpen, CalendarClock, ClipboardCheck, Menu } from "lucide-react-native";
import { View, Image, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useState } from "react";
import NavBar from "@/src/components/ui/navBar";
import { theme } from "@/src/styles";


export default function TabsLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const iconSize = 24;
    const colors = theme();

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
                    headerTitle: "ACADEMIC VAULT",
                    headerTitleStyle: {
                        fontFamily: "LoveYa",
                        fontSize: 24,
                        color:colors.primary,
                    },
                    headerLeft: () => (
                        <View style={{ marginLeft: 20 }}>
                            <Image source={require("@/assets/images/icon.png")} style={{ width: 40, height: 40, borderRadius: 20 }} resizeMode="contain" />
                        </View>
                    ),
                    headerRight: () => (
                        <View style={{ marginRight: 20 }}>
                            <TouchableOpacity 
                            // onPress={() => setIsMenuOpen(true)}
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

            {/* <Modal
                animationType="slide"
                transparent={true}
                visible={isMenuOpen}
                onRequestClose={() => setIsMenuOpen(false)}
            >
                <TouchableWithoutFeedback onPress={() => setIsMenuOpen(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <View style={styles.handle} />
                                <NavBar />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal> */}
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
        height: '72%',
        backgroundColor: '#FFFEF5',
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