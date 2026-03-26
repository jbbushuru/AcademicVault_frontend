 //src/app/tabs/timetable.tsx

import { View,Text } from "react-native";
import { Typography } from "@/src/styles";

 export default function Timetable(){
    return (
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text style={Typography.presets.Slogan}>Timetable</Text>
        </View>
    );
 }