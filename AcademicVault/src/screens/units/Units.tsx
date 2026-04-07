// src/screens/Units.tsx

import { ScrollView, View, Dimensions, TouchableOpacity } from "react-native";
import { theme } from "@/src/styles";
import ContextTag from "@/src/components/ui/contextTag";
import GradeDistribution from "@/src/components/ui/gradeDist";
import SkillCompetencyMapping from "@/src/components/ui/skills";
import EvolutionTimeline from "@/src/components/ui/evolutionTimeline";
import AcademicMilestones from "@/src/components/ui/milestones";
import { router } from "expo-router";
import { Plus, Upload } from "lucide-react-native";

const { width } = Dimensions.get('window');

export default function Units(){
     const colors = theme();
     
    return (
        <View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:colors.background}}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{display:"flex",flexDirection:"column",gap:12,paddingHorizontal:16,paddingBottom:32, width: width}}>
                    <ContextTag/>
                    <GradeDistribution/>
                    <SkillCompetencyMapping />
                    <EvolutionTimeline />
                    <AcademicMilestones/>
                </View>                
            </ScrollView>
            <TouchableOpacity 
                            style={[{ backgroundColor: colors.button, position: 'absolute', bottom: 10,right: 10,width: 50,height: 50,borderRadius: 25,justifyContent: 'center',alignItems: 'center',elevation: 4,zIndex: 10}]}
                            activeOpacity={0.8}
                            onPress={() => router.push('/upload')}
                          >
                            <Upload size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity 
                            style={[{ backgroundColor: colors.button, position: 'absolute', bottom: 70,right: 10,width: 50,height: 50,borderRadius: 25,justifyContent: 'center',alignItems: 'center',elevation: 4,zIndex: 10}]}
                            activeOpacity={0.8}
                            onPress={() => router.push('/unitCreation')}
                          >
                            <Plus size={24} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
}
