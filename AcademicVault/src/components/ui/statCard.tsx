// src/components/ui/statCard.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { Typography } from "@/src/styles";

interface StatCardProps {
    title: string;
    icon: LucideIcon;
    value: string | number;
    subtitle: string;
    iconColor?: string;
}


const StatCard = ({ title, icon: Icon, value, subtitle, iconColor = '#4A90D9' }: StatCardProps) => {
    return (
        <View style={styles.card}>
            <View style={styles.topRow}>
                <Text style={[Typography.presets.Title,styles.title]}>{title}</Text>
                <Icon size={22} color={iconColor} />    
            </View>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        flexDirection:"column",
        gap:6,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        elevation: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        color: '#000',
    },
    value: {
        fontFamily: 'LoveYa',
        fontSize: 22,
        color: '#9B7B95',
        paddingHorizontal:12
    },
    subtitle: {
        fontFamily: 'Inter',
        fontSize: 12,
        color: '#9ca3af',

    },
});

export default StatCard;
