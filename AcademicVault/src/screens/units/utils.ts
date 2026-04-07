// src/screens/units/utils.js

import { DraftUnit } from "@/src/constants/types";

export const INITIAL_DRAFT = (): DraftUnit => ({
    id: Math.random().toString(36).substr(2, 9),
    name: "",
    unitCode: "",
    grade: "",
    points: "",
    category: "",
    isSuggesting: false
});
export const gradeToPoints: Record<string, string> = {
        'A': '12',
        'B': '9',
        'C': '6',
        'D': '3',
        'E': '2',
        'F': '0'
};

    