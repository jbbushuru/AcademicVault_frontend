//src/app/tabs/units.tsx

import { View,Text } from "react-native";
import { Typography } from "@/src/styles";

export default function Units(){
    return (
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text style={Typography.presets.Slogan}>Units</Text>
        </View>
    );
}