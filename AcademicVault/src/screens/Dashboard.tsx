//src/screens/Dashboard.tsx

import { View, Text } from "react-native";
import { Typography } from "@/src/styles";
import { ScrollView } from "react-native";
import ContextTag from "../components/ui/contextTag";
import { theme } from "@/src/styles";
import CurrentStats from "../components/ui/currentStats";
import StatCard from "../components/ui/statCard";
import { BookOpen, Award, Zap, AlertCircle } from "lucide-react-native";
import AcademicCompass from "../components/ui/academicCompass";
import PerformanceGraph from "../components/ui/performanceGraph";
import AptitudeCard from "../components/ui/aptitudeCard";
import NavBar from "../components/ui/navBar";

export default function Dashboard() {
    const colors = theme();
    const totalUnits = 4;
    const performance = 6.9;
    const performanceGrade="A"
    return (
        <View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:colors.background}}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{display:"flex",flexDirection:"column",gap:16,paddingHorizontal:16,paddingBottom:32}}>
                <ContextTag />
                <CurrentStats />
                <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center", gap:12}}>
                    <StatCard
                        title="Total Units"
                        icon={BookOpen}
                        value={totalUnits}
                        subtitle="Completed"            
                        iconColor="#4A90D9"
                    />
                    <StatCard
                        title="Performance"
                        icon={Award}
                        value={performance}
                        subtitle={"Grade " + performanceGrade}
                        iconColor={colors.primary}
                    />
                </View>
                <AcademicCompass performanceAverage={performance} />
                <PerformanceGraph />
                <AptitudeCard 
                    icon={Zap} 
                    title="Current Primary Strength" 
                    category="Software Engineering" 
                    categoryPoints={8.2} 
                />
                <AptitudeCard 
                    icon={AlertCircle} 
                    title="Current Area To watch" 
                    category="Mathematics" 
                    categoryPoints={-8.2} 
                />
               <NavBar /> 
                </View>                
            </ScrollView>
        </View>    
    );
}