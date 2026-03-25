// src/app/tabs/_layout.tsx

import { Tabs } from "expo-router";

export default function TabsLayout(){

    return  <Tabs>
        <Tabs.Screen name="dashboard"/>
        <Tabs.Screen name="units"/>
        <Tabs.Screen name="timetable"/>
        <Tabs.Screen name="units"/>
    </Tabs>;
}