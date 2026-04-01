import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Svg, { Path, Circle, G, Line, Rect } from 'react-native-svg';
import { theme } from '@/src/styles';

const { width } = Dimensions.get('window');
const GRAPH_WIDTH = width - 64; // Account for padding
const GRAPH_HEIGHT = 200;

const mockData = [
  { label: 'Y1S1', value: 10.5 },
  { label: 'Y1S2', value: 11.2 },
  { label: 'Y2S1', value: 9.8 },
  { label: 'Y2S2', value: 10.8 },
  { label: 'Y3S1', value: 10.5 },
  { label: 'Y3S2', value: 11.8 },
  { label: 'Y4S1', value: 11.8 },
  { label: "Y4S2", value: 12 },
  { label: "Y5S1", value: 12 },
];

const GRADE_COLORS = {
  A: { bg: '#f0fdf4', stroke: '#22c55e', text: '#15803d' },
  B: { bg: '#eff6ff', stroke: '#3b82f6', text: '#1d4ed8' },
  C: { bg: '#fffbeb', stroke: '#f59e0b', text: '#b45309' },
  D: { bg: '#fef2f2', stroke: '#ef4444', text: '#b91c1c' },
};

const PerformanceGraph = () => {
  const colors = theme();
  if (!colors) return null;

  const maxValue = 12;
  const paddingX = 40;
  const paddingY = 20;
  const graphInnerWidth = GRAPH_WIDTH - paddingX;
  const graphInnerHeight = GRAPH_HEIGHT - paddingY * 2;
  const COLUMN_WIDTH = 40;
  const SCROLLABLE_CONTENT_WIDTH = Math.max(graphInnerWidth, (mockData.length - 1) * COLUMN_WIDTH + 40);

  const getY = (val: number) => paddingY + graphInnerHeight - (val / maxValue) * graphInnerHeight;
  const getX = (index: number) => (index / (mockData.length - 1)) * SCROLLABLE_CONTENT_WIDTH;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color:"black" }]}>Performance Over Time</Text>
      <Text style={styles.subtitle}>Trend analysis across all semesters</Text>

      <View style={styles.graphWrapper}>
        {/* Fixed Y-Axis Labels */}
        <View style={[styles.yAxis, { height: graphInnerHeight, top: paddingY }]}>
          {[12, 9, 6, 3, 0].map(val => (
            <Text key={`y-label-${val}`} style={styles.axisLabel}>{val}</Text>
          ))}
        </View>

        {/* Scrollable Graph Content */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.scrollContainer}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <View style={{ width: SCROLLABLE_CONTENT_WIDTH }}>
            <Svg width={SCROLLABLE_CONTENT_WIDTH} height={GRAPH_HEIGHT}>
              {/* Background Bands */}
              <Rect x={0} y={getY(12)} width={SCROLLABLE_CONTENT_WIDTH} height={(3 / 12) * graphInnerHeight} fill={GRADE_COLORS.A.bg} fillOpacity={0.9} />
              <Rect x={0} y={getY(9)} width={SCROLLABLE_CONTENT_WIDTH} height={(3 / 12) * graphInnerHeight} fill={GRADE_COLORS.B.bg} fillOpacity={0.9} />
              <Rect x={0} y={getY(6)} width={SCROLLABLE_CONTENT_WIDTH} height={(3 / 12) * graphInnerHeight} fill={GRADE_COLORS.C.bg} fillOpacity={0.9} />
              <Rect x={0} y={getY(3)} width={SCROLLABLE_CONTENT_WIDTH} height={(3 / 12) * graphInnerHeight} fill={GRADE_COLORS.D.bg} fillOpacity={0.9} />

              {/* Grid Lines (Vertical) */}
              {mockData.map((_, i) => (
                <Line
                  key={`grid-v-${i}`}
                  x1={getX(i)}
                  y1={paddingY}
                  x2={getX(i)}
                  y2={GRAPH_HEIGHT - paddingY}
                  stroke="#e5e7eb"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Grid Lines (Horizontal) */}
              {[0, 3, 6, 9, 12].map((val) => (
                <G key={`grid-h-${val}`}>
                  <Line
                    x1={0}
                    y1={getY(val)}
                    x2={SCROLLABLE_CONTENT_WIDTH}
                    y2={getY(val)}
                    stroke="#e5e7eb"
                    strokeDasharray="4 4"
                  />
                </G>
              ))}

              {/* Data Line - segmented for color change on drop */}
              {mockData.map((d, i) => {
                if (i === 0) return null;
                const prev = mockData[i - 1];
                const isDrop = d.value < prev.value;
                return (
                  <Line
                    key={`line-seg-${i}`}
                    x1={getX(i - 1)}
                    y1={getY(prev.value)}
                    x2={getX(i)}
                    y2={getY(d.value)}
                    stroke={isDrop ? GRADE_COLORS.D.stroke : GRADE_COLORS.A.stroke}
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Data Points */}
              {mockData.map((d, i) => (
                <Circle
                  key={`point-${i}`}
                  cx={getX(i)}
                  cy={getY(d.value)}
                  r={5}
                  fill={d.value >= 10 ? GRADE_COLORS.A.stroke : d.value >= 7 ? GRADE_COLORS.B.stroke : d.value >= 4 ? GRADE_COLORS.C.stroke : GRADE_COLORS.D.stroke}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Svg>

            {/* X-Axis Labels */}
            <View style={[styles.xAxis, { width: SCROLLABLE_CONTENT_WIDTH }]}>
              {mockData.map((d, i) => (
                <Text key={`x-label-${i}`} style={[styles.axisLabel, { width: 40, textAlign: 'center', marginLeft: -20, left: getX(i) }]}>
                  {d.label}
                </Text>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: GRADE_COLORS.A.stroke }]} />
          <Text style={styles.legendText}>A (10-12)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: GRADE_COLORS.B.stroke }]} />
          <Text style={styles.legendText}>B (7-9)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: GRADE_COLORS.C.stroke }]} />
          <Text style={styles.legendText}>C (4-6)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: GRADE_COLORS.D.stroke }]} />
          <Text style={styles.legendText}>F/D (0-3)</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f0ede6',
  },
  title: {
    fontFamily: 'LoveYa',
    fontSize: 18,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  graphWrapper: {
    position: 'relative',
    height: GRAPH_HEIGHT + 30, // Extra space for X-axis
  },
  scrollContainer: {
    marginLeft: 30, // Make room for fixed Y-axis
  },
  yAxis: {
    position: 'absolute',
    left: 0,
    width: 30,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
    zIndex: 10,
    backgroundColor: '#fff', // Ensure it overlays the scroll background bands
  },
  xAxis: {
    position: 'absolute',
    bottom: 5,
    flexDirection: 'row',
  },
  axisLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#9ca3af',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: '#4b5563',
  },
});

export default PerformanceGraph;
