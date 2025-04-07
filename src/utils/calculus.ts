import { create, all } from 'mathjs';

const math = create(all);

export const calculateDerivative = (expression: string): string => {
  try {
    const node = math.parse(expression);
    const derivative = math.derivative(node, 'x');
    return derivative.toString();
  } catch (error) {
    console.error('Error calculating derivative:', error);
    return '';
  }
};

export const calculateSecondDerivative = (expression: string): string => {
  try {
    const firstDerivative = calculateDerivative(expression);
    return calculateDerivative(firstDerivative);
  } catch (error) {
    console.error('Error calculating second derivative:', error);
    return '';
  }
};

export const findCriticalPoints = (expression: string): number[] => {
  try {
    const derivative = calculateDerivative(expression);
    const points: number[] = [];
    
    // Find zeros of the derivative using numerical methods
    for (let x = -10; x <= 10; x += 0.1) {
      const scope = { x };
      const value = math.evaluate(derivative, scope);
      
      if (Math.abs(value) < 0.01) {
        points.push(parseFloat(x.toFixed(2)));
      }
    }
    
    return points;
  } catch (error) {
    console.error('Error finding critical points:', error);
    return [];
  }
};

export const findInflectionPoints = (expression: string): number[] => {
  try {
    const secondDerivative = calculateSecondDerivative(expression);
    const points: number[] = [];
    
    // Find zeros of the second derivative
    for (let x = -10; x <= 10; x += 0.1) {
      const scope = { x };
      const value = math.evaluate(secondDerivative, scope);
      
      if (Math.abs(value) < 0.01) {
        points.push(parseFloat(x.toFixed(2)));
      }
    }
    
    return points;
  } catch (error) {
    console.error('Error finding inflection points:', error);
    return [];
  }
};

export const analyzeConcavity = (expression: string, x: number): 'up' | 'down' | 'none' => {
  try {
    const secondDerivative = calculateSecondDerivative(expression);
    const scope = { x };
    const value = math.evaluate(secondDerivative, scope);
    
    if (value > 0.01) return 'up';
    if (value < -0.01) return 'down';
    return 'none';
  } catch (error) {
    console.error('Error analyzing concavity:', error);
    return 'none';
  }
};

export const analyzeMonotonicity = (expression: string, x: number): 'increasing' | 'decreasing' | 'constant' => {
  try {
    const derivative = calculateDerivative(expression);
    const scope = { x };
    const value = math.evaluate(derivative, scope);
    
    if (value > 0.01) return 'increasing';
    if (value < -0.01) return 'decreasing';
    return 'constant';
  } catch (error) {
    console.error('Error analyzing monotonicity:', error);
    return 'constant';
  }
};

export const calculateIntegral = (
  func: string,
  lowerBound: number,
  upperBound: number,
  steps = 1000
): number => {
  try {
    const dx = (upperBound - lowerBound) / steps;
    let sum = 0;
    
    for (let i = 0; i < steps; i++) {
      const x = lowerBound + i * dx;
      const scope = { x };
      sum += math.evaluate(func, scope) * dx;
    }
    
    return sum;
  } catch (error) {
    console.error('Error calculating integral:', error);
    return 0;
  }
};

export const calculateArcLength = (
  func: string,
  lowerBound: number,
  upperBound: number
): number => {
  try {
    const derivative = calculateDerivative(func);
    const integrand = `sqrt(1 + (${derivative})^2)`;
    return calculateIntegral(integrand, lowerBound, upperBound);
  } catch (error) {
    console.error('Error calculating arc length:', error);
    return 0;
  }
};

export const calculateSurfaceArea = (
  func: string,
  lowerBound: number,
  upperBound: number
): number => {
  try {
    const derivative = calculateDerivative(func);
    const integrand = `2 * pi * (${func}) * sqrt(1 + (${derivative})^2)`;
    return calculateIntegral(integrand, lowerBound, upperBound);
  } catch (error) {
    console.error('Error calculating surface area:', error);
    return 0;
  }
};

export const calculateVolume = (
  func: string,
  lowerBound: number,
  upperBound: number
): number => {
  try {
    const integrand = `pi * (${func})^2`;
    return calculateIntegral(integrand, lowerBound, upperBound);
  } catch (error) {
    console.error('Error calculating volume:', error);
    return 0;
  }
};

export const calculateAreaBetweenCurves = (
  func1: string,
  func2: string,
  lowerBound: number,
  upperBound: number
): number => {
  try {
    const integrand = `abs((${func1}) - (${func2}))`;
    return calculateIntegral(integrand, lowerBound, upperBound);
  } catch (error) {
    console.error('Error calculating area between curves:', error);
    return 0;
  }
};

export const generate3DData = (
  func: string,
  lowerBound: number,
  upperBound: number,
  steps = 50
): { x: number[]; y: number[]; z: number[][] } => {
  const x = Array.from({ length: steps }, (_, i) => 
    lowerBound + (upperBound - lowerBound) * (i / (steps - 1))
  );
  
  const y: number[] = [];
  const z: number[][] = [];
  
  try {
    for (let i = 0; i < steps; i++) {
      const scope = { x: x[i] };
      const radius = math.evaluate(func, scope);
      y.push(radius);
    }
    
    return { x, y, z };
  } catch (error) {
    console.error('Error generating 3D data:', error);
    return { x: [], y: [], z: [[]] };
  }
};

export const predefinedFunctions: { [key: string]: string } = {
  'Quadratic': 'x^2',
  'Cubic': 'x^3',
  'Sine': 'sin(x)',
  'Cosine': 'cos(x)',
  'Exponential': 'exp(x)',
  'Linear': '2*x + 1',
  'Polynomial': 'x^4 - 2*x^2 + 1',
  'Logarithmic': 'ln(x + 1)',
  'Trigonometric': 'sin(x) + cos(x)',
  'Rational': '1/(x^2 + 1)',
  'Absolute': 'abs(x)',
  'Hyperbolic': 'sinh(x)',
};

export const unitConversions = {
  length: {
    m: 1,
    cm: 0.01,
    mm: 0.001,
    km: 1000,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.344,
  },
  area: {
    m2: 1,
    cm2: 0.0001,
    mm2: 0.000001,
    km2: 1000000,
    in2: 0.00064516,
    ft2: 0.092903,
    yd2: 0.836127,
    mi2: 2589988.11,
  },
  volume: {
    m3: 1,
    cm3: 0.000001,
    mm3: 1e-9,
    km3: 1e9,
    in3: 1.63871e-5,
    ft3: 0.0283168,
    yd3: 0.764555,
    mi3: 4.168e9,
  },
};