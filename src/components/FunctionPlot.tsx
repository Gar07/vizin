import React, { useEffect, useRef, useState } from 'react';
import functionPlot from 'function-plot';
import Plot from 'react-plotly.js';
import { PlotConfig } from '../types';
import { generate3DData } from '../utils/calculus';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { Download, Settings } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface FunctionPlotProps {
  function_: string;
  functions?: string[];
  lowerBound: number;
  upperBound: number;
  colors?: string[];
}

export const FunctionPlot: React.FC<FunctionPlotProps> = ({
  function_,
  functions = [],
  lowerBound,
  upperBound,
  colors = ['rgb(59, 130, 246)', 'rgb(234, 88, 12)', 'rgb(22, 163, 74)', 'rgb(168, 85, 247)'],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [quality, setQuality] = useState<'low' | 'high'>('high');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const dimensions = useResizeObserver(containerRef);

  const allFunctions = [function_, ...functions].filter(Boolean);

  useEffect(() => {
    if (!containerRef.current || !dimensions) return;

    const config: PlotConfig = {
      target: '#function-plot',
      width: dimensions.width,
      height: Math.min(400, dimensions.width * 0.6),
      grid: true,
      yAxis: { domain: [-10, 10] },
      xAxis: { domain: [lowerBound - 1, upperBound + 1] },
      data: allFunctions.map((fn, index) => ({
        fn,
        color: colors[index % colors.length],
      })),
      theme: theme === 'dark' ? {
        background: '#1f2937',
        grid: '#374151',
        text: '#f3f4f6',
      } : undefined,
    };

    try {
      functionPlot(config);
    } catch (error) {
      console.error('Error plotting function:', error);
    }
  }, [function_, functions, lowerBound, upperBound, dimensions, theme]);

  const steps = quality === 'high' ? 50 : 25;
  const theta = Array.from({ length: steps }, (_, i) => (2 * Math.PI * i) / (steps - 1));
  const x = Array.from({ length: steps }, (_, i) => 
    lowerBound + (upperBound - lowerBound) * (i / (steps - 1))
  );
  
  const surfaceData = generate3DData(function_, lowerBound, upperBound, steps);
  
  const surfaceX: number[][] = [];
  const surfaceY: number[][] = [];
  const surfaceZ: number[][] = [];
  
  for (let i = 0; i < steps; i++) {
    surfaceX[i] = [];
    surfaceY[i] = [];
    surfaceZ[i] = [];
    for (let j = 0; j < steps; j++) {
      surfaceX[i][j] = x[i];
      surfaceY[i][j] = surfaceData.y[i] * Math.cos(theta[j]);
      surfaceZ[i][j] = surfaceData.y[i] * Math.sin(theta[j]);
    }
  }

  const handleQualityToggle = () => {
    setIsLoading(true);
    setQuality(prev => prev === 'high' ? 'low' : 'high');
    setTimeout(() => setIsLoading(false), 100);
  };

  const handleThemeToggle = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const exportToPDF = async () => {
    if (!containerRef.current) return;

    const canvas = await html2canvas(containerRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('calculus-visualization.pdf');
  };

  return (
    <div className="space-y-8">
      <div className={`bg-${theme === 'dark' ? 'gray-800' : 'white'} p-4 sm:p-6 rounded-lg shadow-md`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Visualisasi Fungsi 2D
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={exportToPDF}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {showSettings && (
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <div className="space-y-2">
              <button
                onClick={handleThemeToggle}
                className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Tema: {theme === 'light' ? 'Terang' : 'Gelap'}
              </button>
            </div>
          </div>
        )}

        <div ref={containerRef} id="function-plot" className="w-full"></div>
      </div>

      <div className={`bg-${theme === 'dark' ? 'gray-800' : 'white'} p-4 sm:p-6 rounded-lg shadow-md`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Benda Putar 3D
          </h2>
          <button
            onClick={handleQualityToggle}
            className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Kualitas: {quality === 'high' ? 'Tinggi' : 'Rendah'}
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-[500px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <Plot
            data={[
              {
                type: 'surface',
                x: surfaceX,
                y: surfaceY,
                z: surfaceZ,
                colorscale: theme === 'dark' ? 'Viridis' : 'Blues',
                showscale: false,
              },
            ]}
            layout={{
              width: dimensions?.width || 800,
              height: Math.min(500, (dimensions?.width || 800) * 0.75),
              paper_bgcolor: theme === 'dark' ? '#1f2937' : '#ffffff',
              plot_bgcolor: theme === 'dark' ? '#1f2937' : '#ffffff',
              scene: {
                camera: {
                  eye: { x: 1.5, y: 1.5, z: 1.5 },
                },
                xaxis: { 
                  title: 'X',
                  gridcolor: theme === 'dark' ? '#374151' : '#e5e7eb',
                  zerolinecolor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                },
                yaxis: { 
                  title: 'Y',
                  gridcolor: theme === 'dark' ? '#374151' : '#e5e7eb',
                  zerolinecolor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                },
                zaxis: { 
                  title: 'Z',
                  gridcolor: theme === 'dark' ? '#374151' : '#e5e7eb',
                  zerolinecolor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                },
                aspectratio: { x: 1, y: 1, z: 1 },
              },
              margin: { l: 0, r: 0, t: 0, b: 0 },
              dragmode: 'orbit',
            }}
            config={{
              displayModeBar: true,
              displaylogo: false,
              responsive: true,
              modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'],
            }}
            className="w-full touch-manipulation"
          />
        )}
      </div>
    </div>
  );
};