import React from 'react';
import { CalculusResult } from '../types';
import { Ruler, Box, Cylinder } from 'lucide-react';

interface ResultsDisplayProps {
  results: CalculusResult;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (results.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{results.error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Hasil</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Ruler className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium text-gray-800">Panjang Busur</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {results.arcLength.toFixed(4)}
          </p>
          <p className="text-sm text-blue-600 mt-1">
            Panjang Kurva
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Box className="w-5 h-5 text-green-500" />
            <h3 className="font-medium text-gray-800">Luas Permukaan</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {results.surfaceArea.toFixed(4)}
          </p>
          <p className="text-sm text-green-600 mt-1">
            Luas ketika diputar di sekitar sumbu x
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Cylinder className="w-5 h-5 text-purple-500" />
            <h3 className="font-medium text-gray-800">Volume</h3>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {(results.volume || 0).toFixed(4)}
          </p>
          <p className="text-sm text-purple-600 mt-1">
            Volume ketika diputar di sekitar sumbu x
          </p>
        </div>
      </div>
    </div>
  );
};