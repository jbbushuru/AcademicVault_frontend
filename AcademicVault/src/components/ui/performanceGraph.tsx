import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Svg, { Circle, G, Line, Rect, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { theme, Typography } from '@/src/styles';
import { useAcademic } from '@/src/context/AcademicContext';
import { BarChart3, Database } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const GRAPH_WIDTH = width - 40; // Full width with side margins
const GRAPH_HEIGHT = 180;

const GRADE_COLORS = {
  A: { bg: '#f0fdf4', stroke: '#22c55e', text: '#15803d' },
  B: { bg: '#eff6ff', stroke: '#3b82f6', text: '#1d4ed8' },
  C: { bg: '#fffbeb', stroke: '#f59e0b', text: '#b45309' },
  D: { bg: '#fef2f2', stroke: '#ef4444', text: '#b91c1c' },
};

const PerformanceGraph = () => {
  const colors = theme();
  const { units, currentContext } = useAcademic();

  const graphData = useMemo(() => {
    let filteredUnits = units;
    if (currentContext !== 'Overall') {
      const yearMatch = currentContext.match(/\d+/);
      if (yearMatch) {
          const yearValue = parseInt(yearMatch[0]);
          filteredUnits = units.filter(u => u.year === yearValue);
      }
    }

    if (filteredUnits.length === 0) return [];

    const groups: { [key: string]: { totalPoints: number; count: number; year: number; term: number; label: string } } = {};
    
    filteredUnits.forEach(u => {
      const label = currentContext === 'Overall' ? `Y${u.year}S${u.term}` : `S${u.term}`;
      const key = `${u.year}-${u.term}`;
      if (!groups[key]) {
        groups[key] = { totalPoints: 0, count: 0, year: u.year, term: u.term, label };
      }
      groups[key].totalPoints += u.points || 0;
      groups[key].count += 1;
    });

    return Object.entries(groups)
      .map(([key, data]: any) => ({
        label: data.label,
        value: parseFloat((data.totalPoints / data.count).toFixed(2)),
        year: data.year,
        term: data.term
      }))
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.term - b.term;
      });
  }, [units, currentContext]);

  if (!colors) return null;

  const maxValue = 12;
  const paddingX = 40;
  const paddingY = 20;
  const graphInnerWidth = GRAPH_WIDTH - paddingX;
  const graphInnerHeight = GRAPH_HEIGHT - paddingY * 2;
  const COLUMN_WIDTH = 70;
  const SCROLLABLE_CONTENT_WIDTH = Math.max(graphInnerWidth, (graphData.length - 1) * COLUMN_WIDTH + 80);

  const getY = (val: number) => paddingY + graphInnerHeight - (val / maxValue) * graphInnerHeight;
  const getX = (index: number) => {
      if (graphData.length <= 1) return SCROLLABLE_CONTENT_WIDTH / 2;
      return (index / (graphData.length - 1)) * (SCROLLABLE_CONTENT_WIDTH - 60) + 30;
  };

  // Helper to build a smooth path (Cubic Bezier)
  const buildSmoothPath = (data: any[]) => {
    if (data.length < 2) return "";
    let d = `M ${getX(0)},${getY(data[0].value)}`;
    
    for (let i = 0; i < data.length - 1; i++) {
      const x1 = getX(i);
      const y1 = getY(data[i].value);
      const x2 = getX(i + 1);
      const y2 = getY(data[i + 1].value);
      
      // Control points for smooth curves
      const cp1x = x1 + (x2 - x1) / 2;
      const cp1y = y1;
      const cp2x = x1 + (x2 - x1) / 2;
      const cp2y = y2;
      
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;
    }
    return d;
  };

  return (
    <View style={styles.container}>
      {/* Premium Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <BarChart3 size={20} color="#4A90D9" />
          </View>
          <View>
            <Text style={Typography.presets.Title}>Performance Insights</Text>
          </View>
        </View>
      </View>
      <Text style={styles.subtitle}>
        {currentContext === 'Overall' ? 'Trend analysis across all years' : `Trend analysis for ${currentContext}`}
      </Text>

      <View style={styles.graphWrapper}>
        {graphData.length === 0 ? (
          <View style={styles.emptyState}>
            <Database size={23} color={'#9CA3AF'} style={{ marginBottom: 6 }} />
            <Text style={styles.emptyText}>No data to plot for {currentContext}.</Text>
            <Text style={styles.emptySubtext}>Add units to see your progress.</Text>
          </View>
        ) : (
          <>
            {/* Fixed Y-Axis Labels */}
            <View style={[styles.yAxis, { height: graphInnerHeight, top: paddingY }]}>
              {[12,9,6,3,0].map(val => (
                <Text key={`y-label-${val}`} style={styles.axisLabel}>{val}</Text>
              ))}
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.scrollContainer}
              contentContainerStyle={{ paddingRight: 40 }}
            >
              <View style={{ width: SCROLLABLE_CONTENT_WIDTH }}>
                <Svg width={SCROLLABLE_CONTENT_WIDTH} height={GRAPH_HEIGHT}>
                  
                  {/* Background Bands */}
                  <Rect x={0} y={getY(12)} width={SCROLLABLE_CONTENT_WIDTH} height={(3 / 12) * graphInnerHeight} fill={GRADE_COLORS.A.bg} fillOpacity={0.9} />
                  <Rect x={0} y={getY(9)} width={SCROLLABLE_CONTENT_WIDTH} height={(3 / 12) * graphInnerHeight} fill={GRADE_COLORS.B.bg} fillOpacity={0.9} />
                  <Rect x={0} y={getY(6)} width={SCROLLABLE_CONTENT_WIDTH} height={(3 / 12) * graphInnerHeight} fill={GRADE_COLORS.C.bg} fillOpacity={0.9} />
                  <Rect x={0} y={getY(3)} width={SCROLLABLE_CONTENT_WIDTH} height={(3 / 12) * graphInnerHeight} fill={GRADE_COLORS.D.bg} fillOpacity={0.9} />

                  
                  {/* Background Grid (Subtle Horizontal Lines) */}
                  {[0,3,6,9,12].map((val) => (
                    <Line
                      key={`grid-${val}`}
                      x1={0} y1={getY(val)}
                      x2={SCROLLABLE_CONTENT_WIDTH} y2={getY(val)}
                      stroke="#e5e7eb"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Vertical Grid Lines */}
                  {graphData.map((d, i) => (
                    <Line
                      key={`v-grid-${i}`}
                      x1={getX(i)} y1={getY(0)}
                      x2={getX(i)} y2={getY(12)}
                      stroke="#e5e7eb"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Smooth Trend Path */}
                  <Path
                    d={buildSmoothPath(graphData)}
                    fill="none"
                    stroke="#4A90D9"
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Highlighting Points */}
                  {graphData.map((d, i) => (
                    <G key={`point-group-${i}`}>
                        {/* Glow effect for points */}
                        <Circle
                            cx={getX(i)}
                            cy={getY(d.value)}
                            r={8}
                            fill="#4A90D9"
                            fillOpacity={0.15}
                        />
                        <Circle
                            key={`point-${i}`}
                            cx={getX(i)}
                            cy={getY(d.value)}
                            r={4}
                            fill="#4A90D9"
                            stroke="#fff"
                            strokeWidth={2}
                        />
                    </G>
                  ))}
                </Svg>

                <View style={[styles.xAxis, { width: SCROLLABLE_CONTENT_WIDTH }]}>
                  {graphData.map((d, i) => (
                    <View key={`x-label-view-${i}`} style={[styles.xLabelContainer, { left: getX(i) - 25 }]}>
                        <Text style={styles.axisLabel}>{d.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </>
        )}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendPill}>
          <View style={[styles.statusDot, { backgroundColor: GRADE_COLORS.A.stroke }]} />
          <Text style={styles.legendText}>A (10-12)</Text>
        </View>
        <View style={styles.legendPill}>
          <View style={[styles.statusDot, { backgroundColor: GRADE_COLORS.B.stroke }]} />
          <Text style={styles.legendText}>B (7-9)</Text>
        </View>
        <View style={styles.legendPill}>
          <View style={[styles.statusDot, { backgroundColor: GRADE_COLORS.C.stroke }]} />
          <Text style={styles.legendText}>C (4-6)</Text>
        </View>
        <View style={styles.legendPill}>
          <View style={[styles.statusDot, { backgroundColor: GRADE_COLORS.D.stroke }]} />
          <Text style={styles.legendText}>F/D (0-3)</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'InterBold',
    fontSize: 15,
    color: '#111827',
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#6B7280',
  },
  graphWrapper: {
    position: 'relative',
    height: GRAPH_HEIGHT + 20,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    height: GRAPH_HEIGHT,
    backgroundColor: '#e5e7eb60',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  emptyText: {
    fontFamily: 'InterBold',
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  emptySubtext: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  scrollContainer: {
    marginLeft: 25,
  },
  yAxis: {
    position: 'absolute',
    left: 0,
    width: 25,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 10,
    backgroundColor: '#fff',
  },
  xAxis: {
    position: 'absolute',
    bottom: 0,
    height: 20,
  },
  xLabelContainer: {
    position: 'absolute',
    width: 50,
    alignItems: 'center',
  },
  axisLabel: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F9FAFB',
  },
  legendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '500',
  },
});

export default PerformanceGraph;
