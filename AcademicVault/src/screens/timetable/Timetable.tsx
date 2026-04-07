import React from "react";
import { View,  ScrollView, TouchableOpacity } from "react-native";
import { theme } from "@/src/styles";
import DailyTTView from "@/src/components/dailyTTview";
import WeeklyTTView from "@/src/components/weeklyTTview";
import GenericPillSelector from "@/src/components/ui/pillSelector";
import { useTimetable, TTView } from "@/src/context/TimetableContext";
import { Settings as SettingsIcon, Upload } from "lucide-react-native";
import { useRouter } from "expo-router";
import { styles , width } from "./utils";

const Timetable: React.FC = () => {
  const { view, setView } = useTimetable();
  const colors = theme();
  const router = useRouter();

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
      
      {/* Floating Action Button - Navigate to Settings Screen */}
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.button}]}
        activeOpacity={0.8}
        onPress={() => router.push('/upload')}
      >
        <Upload size={24} color="#FFF" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.button, bottom: 70 }]}
        activeOpacity={0.8}
        onPress={() => router.push('/ttsettings')}
      >
        <SettingsIcon size={24} color="#FFF" />
      </TouchableOpacity>
      
    </View>
  );
};

export default Timetable;
