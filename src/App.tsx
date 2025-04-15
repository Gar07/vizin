import React, { useState } from 'react';
import { FunctionInput } from './components/FunctionInput';
import { FunctionPlot } from './components/FunctionPlot';
import { ResultsDisplay } from './components/ResultsDisplay';
import { CalculationSteps } from './components/CalculationSteps';
import { InteractiveLearning } from './components/InteractiveLearning';
import { Tutorial } from './components/Tutorial';
import { calculateArcLength, calculateSurfaceArea, calculateVolume, calculateDerivative } from './utils/calculus';
import { CalculusResult } from './types';
import { Github, HelpCircle } from 'lucide-react';
import { useCalculusStore } from './store/calculusStore';
import { usePreferencesStore } from './store/preferencesStore';
import { Button } from './components/Button';

function App() {
  const [currentFunction, setCurrentFunction] = useState('x^2');
  const [bounds, setBounds] = useState({ lower: 0, upper: 1 });
  const [results, setResults] = useState<CalculusResult>({
    arcLength: 0,
    surfaceArea: 0,
    volume: 0,
  });
  const [calculationSteps, setCalculationSteps] = useState({
    derivative: '',
    arcLengthIntegral: '',
    surfaceAreaIntegral: '',
    volumeIntegral: '',
  });
  const [showTutorial, setShowTutorial] = useState(false);

  const addToHistory = useCalculusStore(state => state.addToHistory);
  const setManualTutorial = usePreferencesStore(state => state.setManualTutorial);

  const handleFunctionSubmit = (func: string, lower: number, upper: number) => {
    try {
      const derivative = calculateDerivative(func);
      const arcLength = calculateArcLength(func, lower, upper);
      const surfaceArea = calculateSurfaceArea(func, lower, upper);
      const volume = calculateVolume(func, lower, upper);

      setCurrentFunction(func);
      setBounds({ lower, upper });
      
      const newResults = { arcLength, surfaceArea, volume };
      setResults(newResults);
      
      setCalculationSteps({
        derivative,
        arcLengthIntegral: `√(1 + (${derivative})²)`,
        surfaceAreaIntegral: `2π × ${func} × √(1 + (${derivative})²)`,
        volumeIntegral: `π × (${func})²`,
      });

      addToHistory({
        function: func,
        lowerBound: lower,
        upperBound: upper,
        results: newResults,
      });
    } catch (error) {
      setResults({
        arcLength: 0,
        surfaceArea: 0,
        volume: 0,
        error: 'Terjadi kesalahan dalam perhitungan. Mohon periksa input Anda.',
      });
    }
  };

  const handleShowTutorial = () => {
    setManualTutorial(true);
    setShowTutorial(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-8 px-3 sm:px-4">
      <Tutorial forceShow={showTutorial} />
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <header className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
            <img 
              src="/favicon.svg" 
              alt="Vizin Logo" 
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Vizin: Visualisasi Kalkulus Integral
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">
            Jelajahi konsep kalkulus integral melalui visualisasi interaktif.
            Pahami panjang busur, luas permukaan putaran, dan volume dengan
            bantuan visualisasi 2D dan 3D yang dinamis.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-3 sm:mt-4">
            <a
              href="https://github.com/Gar07/vizin"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-blue-500 hover:text-blue-600"
            >
              <Github className="w-5 h-5" />
              <span>Lihat di GitHub</span>
            </a>
            <Button
              variant="secondary"
              onClick={handleShowTutorial}
              className="inline-flex items-center space-x-2"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Tutorial</span>
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="lg:col-span-1">
            <FunctionInput onSubmit={handleFunctionSubmit} />
          </div>
          
          <div className="lg:col-span-2 space-y-4 sm:space-y-8">
            <FunctionPlot
              function_={currentFunction}
              lowerBound={bounds.lower}
              upperBound={bounds.upper}
            />
            <ResultsDisplay results={results} />
            <InteractiveLearning
              function_={currentFunction}
              derivative={calculationSteps.derivative}
            />
            <CalculationSteps
              function_={currentFunction}
              derivative={calculationSteps.derivative}
              arcLengthIntegral={calculationSteps.arcLengthIntegral}
              surfaceAreaIntegral={calculationSteps.surfaceAreaIntegral}
              volumeIntegral={calculationSteps.volumeIntegral}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;