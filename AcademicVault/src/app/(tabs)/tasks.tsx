 //src/app/tabs/tasks.tsx

import { View,Text } from "react-native";
import { Typography } from "@/src/styles";

 export default function Tasks(){
    return (
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
           <Text style={Typography.presets.Slogan}>Tasks</Text>
        </View>
    );
 }