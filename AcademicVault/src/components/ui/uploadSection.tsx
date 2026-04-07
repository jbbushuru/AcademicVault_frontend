import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Upload as UploadIcon } from 'lucide-react-native';
import { theme, Typography } from '../../styles';

const UploadSection = () => {
    const colors = theme();

    return (
        <View style={styles.uploadCard}>
            <View style={styles.dropZone}>
                <View style={styles.iconCircle}>
                    <UploadIcon size={28} color={colors.secondary} />
                </View>
                
                <Text style={[Typography.presets.Title, { color: colors.text, textAlign: 'center', marginTop: 8, fontSize: 16 }]}>
                    Click here to upload files
                </Text>
                
                <Text style={[Typography.presets.body, { color: colors.subtext, textAlign: 'center', marginTop: 6, marginBottom: 16, fontSize: 12 }]}>
                    Supports PDF files only (Max 10MB each)
                </Text>

                <TouchableOpacity style={[styles.button, { backgroundColor: colors.button }]}>
                    <Text style={styles.buttonText}>Select Files</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    uploadCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    dropZone: {
        borderWidth: 1.5,
        borderColor: '#D4B4CE',
        borderStyle: 'dashed',
        borderRadius: 12,
        backgroundColor: '#F5EDF4',
        padding: 30,
        alignItems: 'center',
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FCE7F3',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 24,
        marginTop: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontFamily: Typography.fonts.bodyBold,
        fontSize: 14,
        fontWeight: '600',
    },
});

export default UploadSection;
