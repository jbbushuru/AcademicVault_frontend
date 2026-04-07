import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, FileText } from 'lucide-react-native';
import { theme, Typography } from '../../styles';

const RecentDocs = () => {
    const colors = theme();

    return (
        <View style={styles.recentContainer}>
            <View style={styles.recentHeader}>
                <Clock size={20} color={colors.text} />
                <Text style={[Typography.presets.Title, { color: colors.text, marginLeft: 8 }]}>
                    Recently Uploaded Documents
                </Text>
            </View>
            
            <View style={styles.emptyStateCard}>
                <FileText size={48} color="#94A3B8" style={{ marginBottom: 16 }} />
                <Text style={[Typography.presets.Title, { color: colors.text, fontSize: 16 }]}>No Recent Documents</Text>
                <Text style={[Typography.presets.body, { color: colors.subtext, textAlign: 'center', marginTop: 8, fontSize: 12 }]}>
                    Uploaded PDF transcripts or timetables appear here.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    recentContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    recentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyStateCard: {
        backgroundColor: '#F4F6F8',
        borderRadius: 12,
        padding: 40,
        alignItems: 'center',
    },
});

export default RecentDocs;
