import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Typography } from "@/src/styles";
import { useAcademic } from "@/src/context/AcademicContext";

const ContextTag = () => {
    const { currentContext } = useAcademic();

    return (
        <View style={styles.container}>
            <View style={styles.pill}>
                <Text style={styles.text}>{currentContext.toUpperCase()} REVIEW</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        paddingTop: 16,
    },
    pill: {
        backgroundColor: '#C8B6C4', // Matching the muted purple hue
        paddingVertical: 3,
        paddingHorizontal: 25,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#7B5E77',
        minWidth: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    text: {
        fontFamily: 'LoveYa', // from src/styles.ts Typography
        fontSize: 18,
        color: '#604C5F',
        textAlign: 'center',
        letterSpacing: 1,
    },
});

export default ContextTag;
