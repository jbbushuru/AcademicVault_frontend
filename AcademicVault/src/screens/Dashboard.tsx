//src/screens/Dashboard.tsx

import { View, Text } from "react-native";
import { Typography } from "@/src/styles";
import { ScrollView } from "react-native";
import ContextTag from "../components/ui/contextTag";
import { theme } from "@/src/styles";
import CurrentStats from "../components/ui/currentStats";
import StatCard from "../components/ui/statCard";
import { BookOpen, Award } from "lucide-react-native";

export default function Dashboard() {
    const colors = theme();
    const totalUnits = 4;
    const performance = 3.5;
    return (
        <View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:colors.background}}>
            <ScrollView style={{paddingHorizontal:3}} showsVerticalScrollIndicator={false}>
                <ContextTag />
                <CurrentStats />
                <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:10, gap:12}}>
                    <StatCard
                        title="Total Units"
                        icon={BookOpen}
                        value={totalUnits}
                        subtitle="Completed"
                        iconColor={colors.primary}
                    />
                    <StatCard
                        title="Performance"
                        icon={Award}
                        value={performance}
                        subtitle="Grade Point"
                        iconColor={colors.primary}
                    />
                </View>
                <Text style={Typography.presets.Slogan}>Dashboard</Text>
            </ScrollView>
        </View>    
    );
}