import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { theme, Typography } from '@/src/styles';
import { Lightbulb } from 'lucide-react-native';
import UploadSection from '@/src/components/ui/uploadSection';
import RecentDocs from '@/src/components/ui/recentDocs';
import { SafeAreaView } from 'react-native-safe-area-context';
import RouteHeader from '@/src/components/ui/routeHeader';

const { width } = Dimensions.get('window');


const UploadScreen = () => {
  const colors = theme();
  const isDark = colors.background === '#151718';
  const cardBorder = isDark ? '#2A2A2A' : '#F0EDF5';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} >
      {/* Header */}
      <RouteHeader title="Document Upload & Scanning" />
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
        {/* Header section */}
        <View style={styles.headerContainer}>
          <Text style={[Typography.presets.body, { color: colors.subtext }]}>
            Upload your PDF transcripts or timetables for intelligent scanning.
          </Text>
        </View>

        {/* How it works section */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Lightbulb size={20} color="#3B82F6" style={{ opacity: 0.8 }} />
            <Text style={styles.infoTitle}>How it works</Text>
          </View>

          <View style={styles.infoStep}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={styles.stepText}>Upload your academic transcript or timetable PDF</Text>
          </View>

          <View style={styles.infoStep}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <Text style={styles.stepText}>Our application extracts course names, grades, and schedule details</Text>
          </View>

          <View style={styles.infoStep}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <Text style={styles.stepText}>Review and confirm the extracted information</Text>
          </View>
        </View>

        {/* Upload action section */}
        <UploadSection />

        {/* Recent documents section */}
        <RecentDocs />

      </ScrollView>
    </SafeAreaView>

  );
};

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
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 18,
    paddingBottom: 2,
    borderWidth: 1,
    borderColor: '#BEDBFF',
    marginBottom: 12,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontFamily: Typography.fonts.bodyBold,
    fontSize: 16,
    color: '#1C398E',
    marginLeft: 8,
    fontWeight: '700',
  },
  infoStep: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
    paddingRight: 0,
  },
  stepNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#BEDBFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumber: {
    color: '#1C398E',
    fontFamily: Typography.fonts.bodyBold,
    fontSize: 12,
    fontWeight: '700',
  },
  stepText: {
    fontFamily: Typography.fonts.body,
    fontSize: 12,
    color: '#193CB8',
    flex: 1,
    lineHeight: 16,
  },


});

export default UploadScreen;
