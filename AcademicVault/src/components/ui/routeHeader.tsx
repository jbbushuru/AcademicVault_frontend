// src/screens/CreateUnit.tsx

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme, Typography } from "@/src/styles";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";

export default function RouteHeader({title}: {title: string}) {
    const colors = theme();
    const isDark = colors.background === '#151718';
    const cardBorder = isDark ? '#2A2A2A' : '#F0EDF5';

    return (
            <View style={[styles.header, { borderBottomColor: cardBorder, backgroundColor: colors.tint }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={28} color={colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, Typography.presets.Headertitle, { color: colors.text }]}>
                    {title}
                </Text>
                <View style={{ width: 28 }} />
            </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
    }
});