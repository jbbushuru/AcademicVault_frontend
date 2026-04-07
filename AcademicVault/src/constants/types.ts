// src/constants/types.ts

//CreateUnit.tsx
export interface DraftUnit {
    id: string; // Internal local ID
    name: string;
    unitCode: string;
    grade: string;
    points: string;
    category: string;
    isSuggesting: boolean;
    suggestion?: string;
}