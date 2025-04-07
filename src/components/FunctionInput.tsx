import React, { useState } from 'react';
import { Calculator, BookOpen, FunctionSquare as Function, ChevronDown, History } from 'lucide-react';
import { predefinedFunctions } from '../utils/calculus';
import { ScientificKeypad } from './ScientificKeypad';
import { Button } from './Button';
import { validateMathFunction, validateBounds } from '../utils/validation';
import { useCalculusStore } from '../store/calculusStore';

interface FunctionInputProps {
  onSubmit: (func: string, lower: number, upper: number) => void;
}

export const FunctionInput: React.FC<FunctionInputProps> = ({ onSubmit }) => {
  const [function_, setFunction] = useState('x^2');
  const [lowerBound, setLowerBound] = useState('0');
  const [upperBound, setUpperBound] = useState('1');
  const [showPresets, setShowPresets] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const history = useCalculusStore(state => state.history);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate function
    const funcValidation = validateMathFunction(function_);
    if (!funcValidation.isValid) {
      setError(funcValidation.error);
      return;
    }

    // Validate bounds
    const boundsValidation = validateBounds(parseFloat(lowerBound), parseFloat(upperBound));
    if (!boundsValidation.isValid) {
      setError(boundsValidation.error);
      return;
    }

    onSubmit(
      funcValidation.sanitized || function_,
      parseFloat(lowerBound),
      parseFloat(upperBound)
    );
  };

  const handlePresetSelect = (expression: string) => {
    setFunction(expression);
    setShowPresets(false);
    setError(null);
  };

  const handleHistorySelect = (item: typeof history[0]) => {
    setFunction(item.function);
    setLowerBound(item.lowerBound.toString());
    setUpperBound(item.upperBound.toString());
    setShowHistory(false);
    setError(null);
  };

  const handleKeypadInput = (value: string) => {
    setFunction(prev => prev + value);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold">Masukkan Fungsi</h2>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center space-x-2"
        >
          <History className="w-4 h-4" />
          <span className="hidden sm:inline">Riwayat</span>
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">
            Fungsi f(x)
            <div className="mt-1 relative">
              <input
                type="text"
                value={function_}
                onChange={(e) => {
                  setFunction(e.target.value);
                  setError(null);
                }}
                className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  error ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Contoh: x^2, sin(x)"
              />
              <button
                type="button"
                onClick={() => setShowPresets(!showPresets)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </label>
          
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
          
          {showPresets && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="p-2 space-y-1">
                {Object.entries(predefinedFunctions).map(([name, expr]) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handlePresetSelect(expr)}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-md"
                  >
                    <span className="font-medium">{name}</span>
                    <span className="text-gray-500 ml-2">{expr}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showHistory && history.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                {history.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleHistorySelect(item)}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-md"
                  >
                    <div className="font-medium">{item.function}</div>
                    <div className="text-sm text-gray-500">
                      [{item.lowerBound}, {item.upperBound}]
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <ScientificKeypad onInput={handleKeypadInput} />

        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm font-medium text-gray-700">
            Batas Bawah
            <input
              type="number"
              value={lowerBound}
              onChange={(e) => {
                setLowerBound(e.target.value);
                setError(null);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              step="any"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Batas Atas
            <input
              type="number"
              value={upperBound}
              onChange={(e) => {
                setUpperBound(e.target.value);
                setError(null);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              step="any"
            />
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          type="submit"
          className="w-full flex items-center justify-center space-x-2"
        >
          <Function className="w-4 h-4" />
          <span>Hitung</span>
        </Button>

        <div className="bg-blue-50 p-4 rounded-md">
          <div className="flex items-center space-x-2 mb-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <h3 className="font-medium text-blue-800">Panduan Penggunaan</h3>
          </div>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Gunakan notasi matematika standar (Contoh: x^2, sin(x))</li>
            <li>• Fungsi tersedia: sin, cos, tan, exp, ln, sqrt</li>
            <li>• Gunakan * untuk perkalian (Contoh: 2*x)</li>
            <li>• Konstanta: pi, e</li>
            <li>• Klik tombol fungsi di keypad untuk input cepat</li>
          </ul>
        </div>
      </div>
    </form>
  );
};