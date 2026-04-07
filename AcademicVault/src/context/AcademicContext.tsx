import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as SecureStore from 'expo-secure-store';
import BASE_url from '../constants/baseURL';
import { useAuth } from './AuthContext';

export interface Unit {
  _id: string;
  name: string;
  unitCode: string;
  grade: string;
  points: number;
  year: number;
  term: number;
  category?: Category | string; // Can be a populated object or a string ID
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  signatureColor?: string;
}

export interface Milestone {
  _id: string;
  title: string;
  description: string;
  type: 'medal' | 'shield' | 'zap' | 'award';
  isUnlocked?: boolean;
}

export interface EvolutionYear {
  year: number;
  primaryName: string;
  primaryColor: string;
  hasData: boolean;
}

export interface AptitudeInsight {
  name: string;
  points: string;
}

export interface SkillUnit {
    name: string;
    year: number;
    term: number;
    points: number;
}

export interface ProcessedCategory {
  name: string;
  description: string;
  signatureColor: string;
  unitCount: number;
  averagePoints: number;
  units: SkillUnit[];
}

export interface AcademicStats {
  totalUnits: number;
  performanceAverage: string;
  performanceGrade: string;
  aptitude: {
    strength: AptitudeInsight;
    watch: AptitudeInsight;
  };
  evolutionData: EvolutionYear[];
  skillsData: ProcessedCategory[];
}

type AcademicContextType = {
  currentContext: string;
  setCurrentContext: (context: string) => void;
  units: Unit[];
  contextUnits: Unit[]; // Pre-filtered units based on currentContext
  stats: AcademicStats;  // Pre-calculated stats based on currentContext
  categories: Category[];
  milestones: Milestone[];
  loading: boolean;
  refreshData: () => Promise<void>;
  addUnit: (unitData: Partial<Unit>) => Promise<any>;
  bulkAddUnits: (units: Partial<Unit>[]) => Promise<any>;
  getSuggestedCategory: (unitName: string) => Promise<any>;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
};

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

export const useAcademic = () => {
  const context = useContext(AcademicContext);
  if (!context) throw new Error('useAcademic must be used within AcademicProvider');
  return context;
};

export const AcademicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [currentContext, setCurrentContext] = useState('Overall');
  const [units, setUnits] = useState<Unit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(false);
  const { userProfile } = useAuth();

  // --- DERIVED INTELLIGENCE ---
  const contextUnits = useMemo(() => {
    if (currentContext === 'Overall') return units;
    const yearMatch = currentContext.match(/\d+/);
    if (!yearMatch) return units;
    const yearNum = parseInt(yearMatch[0]);
    return units.filter(u => u.year === yearNum);
  }, [units, currentContext]);

  const stats = useMemo((): AcademicStats => {
    const totalUnits = contextUnits.length;
    const totalPoints = contextUnits.reduce((acc: number, current: Unit) => acc + (current.points || 0), 0);
    const performanceAverage = totalUnits > 0 ? (totalPoints / totalUnits).toFixed(1) : "0.0";

    // Aptitude mapping
    const categoryMap: { [key: string]: { totalPoints: number; count: number; name: string } } = {};
    contextUnits.forEach((u: Unit) => {
        const catId = typeof u.category === 'object' ? u.category?._id : u.category;
        const catName = typeof u.category === 'object' ? u.category?.name : (categories.find(c => c._id === u.category)?.name || "Uncategorized");

        if (catId) {
            if (!categoryMap[catId]) categoryMap[catId] = { totalPoints: 0, count: 0, name: catName || "Uncategorized" };
            categoryMap[catId].totalPoints += u.points || 0;
            categoryMap[catId].count += 1;
        }
    });

    const catStats = Object.values(categoryMap).map(c => ({
        name: c.name,
        avg: c.totalPoints / c.count
    })).sort((a, b) => b.avg - a.avg);

    const strength = catStats.length > 0 ? { name: catStats[0].name, points: catStats[0].avg.toFixed(1) } : { name: "N/A", points: "0.0" };
    const watch = catStats.length > 1 ? { name: catStats[catStats.length - 1].name, points: catStats[catStats.length - 1].avg.toFixed(1) } : { name: "N/A", points: "0.0" };

    // --- EVOLUTION DATA (Yearly Strengths) ---
    const courseDuration = userProfile?.courseDuration || 4;
    const yearSummary: { [key: number]: { strength: string; color: string; avg: number } } = {};
    for (let i = 1; i <= courseDuration; i++) {
        yearSummary[i] = { strength: "No data", color: "#E5E7EB", avg: 0 };
    }

    const tempGroups: { [key: number]: { [catId: string]: { total: number; count: number; name: string; color: string } } } = {};
    units.forEach((u: Unit) => {
        if (!tempGroups[u.year]) tempGroups[u.year] = {};
        const catId = typeof u.category === 'object' ? u.category?._id : u.category;
        const catName = typeof u.category === 'object' ? u.category?.name : (categories.find(c => c._id === u.category)?.name || "Uncategorized");
        const catColor = typeof u.category === 'object' ? u.category?.signatureColor : (categories.find(c => c._id === u.category)?.signatureColor || "#4A90D9");

        if (catId) {
            if (!tempGroups[u.year][catId]) {
                tempGroups[u.year][catId] = { total: 0, count: 0, name: catName || "Uncategorized", color: catColor || "#4A90D9" };
            }
            tempGroups[u.year][catId].total += u.points || 0;
            tempGroups[u.year][catId].count += 1;
        }
    });

    Object.keys(tempGroups).forEach(yearStr => {
        const year = parseInt(yearStr);
        const cats = tempGroups[year];
        let bestCat = { name: "N/A", avg: -1, color: "#E5E7EB" };
        Object.values(cats).forEach(c => {
            const avg = c.total / c.count;
            if (avg > bestCat.avg) {
                bestCat = { name: c.name, avg, color: c.color };
            }
        });
        if (yearSummary[year]) yearSummary[year] = { strength: bestCat.name, color: bestCat.color, avg: bestCat.avg };
    });

    const evolutionData: EvolutionYear[] = Object.entries(yearSummary).map(([year, data]) => ({
        year: parseInt(year),
        primaryName: data.strength,
        primaryColor: data.color,
        hasData: data.strength !== "No data"
    }));

    // --- SKILLS DATA (Radar Chart & Breakdown) ---
    const skillsData: ProcessedCategory[] = categories.map(cat => {
        const catUnits = contextUnits.filter(u => {
            const catId = typeof u.category === 'object' ? u.category?._id : u.category;
            return catId === cat._id;
        });

        const averagePointsVal = catUnits.length > 0 
            ? Math.round((catUnits.reduce((sum, u) => sum + (u.points || 0), 0) / (catUnits.length * 12)) * 100)
            : 0;

        return {
            name: cat.name,
            description: cat.description || "Comprehensive skill development in this area.",
            signatureColor: cat.signatureColor || "#9B7B95",
            unitCount: catUnits.length,
            averagePoints: averagePointsVal,
            units: catUnits.map(u => ({
                name: u.name,
                year: u.year,
                term: u.term,
                points: u.points || 0
            }))
        };
    }).filter(cat => cat.unitCount > 0)
      .sort((a, b) => b.averagePoints - a.averagePoints);

    // Grade Mapping
    let performanceGrade = "N/A";
    const perfNum = parseFloat(performanceAverage);
    if (perfNum >= 10) performanceGrade = "A";
    else if (perfNum >= 7) performanceGrade = "B";
    else if (perfNum >= 4) performanceGrade = "C";
    else if (perfNum >= 1) performanceGrade = "D";
    else if (totalUnits > 0) performanceGrade = "F";

    return {
        totalUnits,
        performanceAverage,
        performanceGrade,
        aptitude: { strength, watch },
        evolutionData,
        skillsData
    };
  }, [contextUnits, categories, units, userProfile]);

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = await SecureStore.getItemAsync('userToken');
    return fetch(`${BASE_url}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });
  };

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [uRes, cRes, mRes] = await Promise.all([
        fetchWithAuth('/api/academic/units'),
        fetchWithAuth('/api/academic/categories'),
        fetchWithAuth('/api/milestones')
      ]);

      if (uRes.ok) setUnits(await uRes.json());
      if (cRes.ok) setCategories(await cRes.json());
      if (mRes.ok) setMilestones(await mRes.json());
    } catch (error) {
      console.error('Refresh academic data error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      refreshData();
    }
  }, [isLoggedIn, refreshData]);

  const addUnit = async (unitData: Partial<Unit>) => {
    try {
      const res = await fetchWithAuth('/api/academic/units', {
        method: 'POST',
        body: JSON.stringify(unitData),
      });
      if (res.ok) {
        const newUnit = await res.json();
        setUnits(prev => [...prev, newUnit]);
        return newUnit;
      }
    } catch (error) {
      console.error('Add unit error:', error);
    }
  };

  const bulkAddUnits = async (units: Partial<Unit>[]) => {
    try {
      const res = await fetchWithAuth('/api/academic/units/bulk', {
        method: 'POST',
        body: JSON.stringify(units),
      });
      if (res.ok) {
        const newUnits = await res.json();
        setUnits(prev => [...prev, ...newUnits]);
        return newUnits;
      }
    } catch (error) {
      console.error('Bulk add error:', error);
    }
  };

  const getSuggestedCategory = async (unitName: string) => {
    try {
      const res = await fetchWithAuth(`/api/academic/units/suggest?unitName=${encodeURIComponent(unitName)}`);
      if (res.ok) return await res.json();
    } catch (error) {
      console.error('Suggestion error:', error);
    }
    return null;
  };

  return (
    <AcademicContext.Provider value={{ 
      currentContext,
      setCurrentContext, 
      units, 
      contextUnits, 
      stats, 
      categories, 
      milestones, 
      loading, 
      refreshData, 
      addUnit, 
      bulkAddUnits, 
      getSuggestedCategory, 
      fetchWithAuth
    }}>
      {children}
    </AcademicContext.Provider>
  );
};
