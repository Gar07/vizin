export interface PlotConfig {
  target: string;
  width: number;
  height: number;
  grid: boolean;
  yAxis: { domain: [number, number] };
  xAxis: { domain: [number, number] };
  data: Array<{
    fn: string;
    color?: string;
    graphType?: 'polyline' | 'scatter';
    points?: Array<[number, number]>;
    fnType?: 'linear' | 'implicit';
  }>;
  theme?: {
    background: string;
    grid: string;
    text: string;
  };
}

export interface CalculusResult {
  arcLength: number;
  surfaceArea: number;
  volume?: number;
  error?: string;
  criticalPoints?: number[];
  inflectionPoints?: number[];
  areaBetweenCurves?: number;
}

export interface MathFunction {
  name: string;
  expression: string;
  description: string;
}

export interface PlotData {
  x: number[];
  y: number[];
  z?: number[];
}

export interface AnalysisPoint {
  x: number;
  y: number;
  type: 'critical' | 'inflection';
  description: string;
}

export interface ConcavityInterval {
  start: number;
  end: number;
  direction: 'up' | 'down';
}

export interface MonotonicityInterval {
  start: number;
  end: number;
  type: 'increasing' | 'decreasing' | 'constant';
}

export interface UnitConversion {
  from: string;
  to: string;
  value: number;
}

export interface ThemeConfig {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
  grid: string;
}

export interface PlotStyle {
  lineWidth: number;
  pointSize: number;
  showGrid: boolean;
  showAxes: boolean;
  showLabels: boolean;
  colorScheme: string[];
}

export interface ExportConfig {
  format: 'pdf' | 'png' | 'svg';
  quality: number;
  includeCalculations: boolean;
  includePlots: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
}