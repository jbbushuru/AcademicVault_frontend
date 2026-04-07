//src/screens/Dashboard.tsx

import { View } from "react-native";
import { ScrollView } from "react-native";
import ContextTag from "@/src/components/ui/contextTag";
import { theme } from "@/src/styles";
import CurrentStats from "@/src/components/ui/currentStats";
import StatCard from "@/src/components/ui/statCard";
import { BookOpen, Award, Zap, AlertCircle } from "lucide-react-native";
import AcademicCompass from "@/src/components/ui/academicCompass";
import PerformanceGraph from "@/src/components/ui/performanceGraph";
import AptitudeCard from "@/src/components/ui/aptitudeCard";
import { useAcademic } from "@/src/context/AcademicContext";

interface DashboardViewProps {
    colors: any;
}

function DashboardView({ colors }: DashboardViewProps) {
    const { stats, currentContext } = useAcademic();
    const { totalUnits, performanceAverage, performanceGrade, aptitude } = stats;
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ display: "flex", flexDirection: "column", gap: 12, paddingHorizontal: 16, paddingBottom: 32 }}>
                    <ContextTag />
                    <CurrentStats />
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                        <StatCard
                            title="Units"
                            icon={BookOpen}
                            value={totalUnits}
                            subtitle={currentContext === 'Overall' ? `Completed ${currentContext}` : `Completed in ${currentContext}`}
                            iconColor="#4A90D9"
                        />
                        <StatCard
                            title="Performance"
                            icon={Award}
                            value={performanceAverage + "/12"}
                            subtitle={performanceGrade === 'N/A' ? "No data" : ("Grade " + performanceGrade)}
                            iconColor="#4A90D9"
                        />
                    </View>
                    <AcademicCompass performanceAverage={parseFloat(performanceAverage as string)} />
                    <PerformanceGraph />
                    <AptitudeCard
                        icon={Zap}
                        title={currentContext === 'Overall' ? "Current Primary Strength" : currentContext + " Primary Strength"}
                        category={aptitude.strength.name}
                        categoryPoints={aptitude.strength.points}
                    />
                    <AptitudeCard
                        icon={AlertCircle}
                        title={currentContext === 'Overall' ? "Current Area To Watch" : currentContext + " Area To Watch"}
                        category={aptitude.watch.name}
                        categoryPoints={aptitude.watch.points}
                    />
                </View>
            </ScrollView>
        </View>
    );
}
export default function Dashboard() {
    const colors = theme();


    return (
        <DashboardView
            colors={colors}
        />
    );
}