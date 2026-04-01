// src/screens/Units.tsx

import { ScrollView, View, Dimensions } from "react-native";
import { theme } from "../styles";
import ContextTag from "../components/ui/contextTag";
import GradeDistribution from "../components/ui/gradeDist";
import SkillCompetencyMapping from "../components/ui/skills";
import EvolutionTimeline from "../components/ui/evolutionTimeline";
import AcademicMilestones from "../components/ui/milestones";

const { width } = Dimensions.get('window');

export default function Units(){
     const colors = theme();
     
    return (
        <View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:colors.background}}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{display:"flex",flexDirection:"column",gap:16,paddingHorizontal:16,paddingBottom:32, width: width}}>
                    <ContextTag/>
                    <GradeDistribution/>
                    <SkillCompetencyMapping />
                    <EvolutionTimeline />
                    <AcademicMilestones/>
                </View>
            </ScrollView>
        </View>
    );
}
