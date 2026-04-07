import React from "react";
import Timetable from "@/src/screens/timetable/Timetable";
import TTOnboarding from "@/src/components/TTonboarding";
import { useTimetable } from "@/src/context/TimetableContext";

export default function TimetableRoute() {
    const { settings, updateSettings } = useTimetable();

    if (!settings.hasOnboarded) {
        return (
            <TTOnboarding
                onComplete={(newSettings) => {
                    updateSettings({ ...newSettings, hasOnboarded: true });
                }}
            />
        );
    }

    return (
        <Timetable />
    );
}