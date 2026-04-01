// src/screens/Timetable.tsx  

import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { theme } from "@/src/styles";
import DailyTTView from "@/src/components/dailyTTview";
import WeeklyTTView from "@/src/components/weeklyTTview";
import GenericPillSelector, { TTView } from "@/src/components/ui/pillSelector";
import ContextTag from "../components/ui/contextTag";
import { Pencil } from "lucide-react-native";

const { width } = Dimensions.get('window');

const Timetable = () => {
  const [view, setView] = useState<TTView>('Daily');
  const colors = theme();
  if (!colors) return null;

  const handleViewChange = (val: TTView) => {
    setView(val);
  }; 

  return (
    <View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:colors.background}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{display:"flex",flexDirection:"column",gap:16,paddingHorizontal:16,paddingBottom:32, width: width}}>
          <GenericPillSelector
          selectedValue={view}
          onSelectionChange={(val) => handleViewChange(val as TTView)}
          options={[
            { label: 'Daily View', value: 'Daily' },
            { label: 'Weekly View', value: 'Weekly' },
          ]}
          containerStyle={{alignSelf: 'center',paddingTop:16}}
          />
          <View>
            {view === 'Daily' ? <DailyTTView /> : <WeeklyTTView />}
          </View>
        </View>
      </ScrollView>
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.button }]}
        activeOpacity={0.8}
      >
        <Pencil size={24} color="#FFF" />
      </TouchableOpacity>
      
      {/* <View style={styles.header}>
        <GenericPillSelector
          selectedValue={view}
          onSelectionChange={(val) => handleViewChange(val as TTView)}
          options={[
            { label: 'Daily View', value: 'Daily' },
            { label: 'Weekly View', value: 'Weekly' },
          ]}
        />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {view === 'Daily' ? <DailyTTView /> : <WeeklyTTView />}
        </View>
      </ScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  }
});

export default Timetable;
