import React from 'react';
import { Book } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface CalculationStepsProps {
  function_: string;
  derivative: string;
  arcLengthIntegral: string;
  surfaceAreaIntegral: string;
  volumeIntegral: string;
}

const convertToLatex = (expr: string): string => {
  return expr
    .replace(/\*/g, ' \\cdot ')
    .replace(/pi/g, '\\pi')
    .replace(/sqrt/g, '\\sqrt')
    .replace(/sin\(/g, '\\sin(')
    .replace(/cos\(/g, '\\cos(')
    .replace(/tan\(/g, '\\tan(')
    .replace(/exp\(/g, '\\exp(')
    .replace(/ln\(/g, '\\ln(')
    .replace(/\^(\d+)/g, '^{$1}')
    .replace(/\^([a-z])/g, '^{$1}')
    .replace(/\^\(([^)]+)\)/g, '^{($1)}');
};

export const CalculationSteps: React.FC<CalculationStepsProps> = ({
  function_,
  derivative,
  arcLengthIntegral,
  surfaceAreaIntegral,
  volumeIntegral,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-4">
        <Book className="w-5 h-5 text-blue-500" />
        <h2 className="text-xl font-semibold">Langkah-langkah Perhitungan</h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-gray-800 mb-2">1. Fungsi dan Turunan</h3>
          <div className="bg-gray-50 p-4 rounded-md space-y-4">
            <div>
              <p className="text-gray-600 mb-2">Fungsi yang diberikan:</p>
              <div className="ml-4">
                <InlineMath math={`f(x) = ${convertToLatex(function_)}`} />
              </div>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Turunan pertama:</p>
              <div className="ml-4">
                <InlineMath math={`f'(x) = ${convertToLatex(derivative)}`} />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Turunan diperlukan untuk menghitung panjang busur dan luas permukaan.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-800 mb-2">2. Panjang Busur</h3>
          <div className="bg-gray-50 p-4 rounded-md space-y-4">
            <div>
              <p className="text-gray-600 mb-2">Rumus panjang busur:</p>
              <BlockMath math="L = \int_a^b \sqrt{1 + [f'(x)]^2} \, dx" />
              <p className="text-sm text-gray-500 mt-2">
                Panjang busur dihitung dengan mengintegralkan akar dari 1 ditambah turunan kuadrat.
                Ini berasal dari formula panjang kurva dalam kalkulus.
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Substitusi fungsi:</p>
              <BlockMath math={`L = \\int_{a}^{b} ${convertToLatex(arcLengthIntegral)} \\, dx`} />
              <p className="text-sm text-gray-500 mt-2">
                Integral ini dihitung secara numerik menggunakan metode trapesium.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-800 mb-2">3. Luas Permukaan Benda Putar</h3>
          <div className="bg-gray-50 p-4 rounded-md space-y-4">
            <div>
              <p className="text-gray-600 mb-2">Rumus luas permukaan:</p>
              <BlockMath math="S = 2\pi \int_a^b f(x) \sqrt{1 + [f'(x)]^2} \, dx" />
              <p className="text-sm text-gray-500 mt-2">
                Luas permukaan benda putar diperoleh dengan mengalikan keliling lingkaran (2πr)
                dengan panjang busur elemen. Di sini, r = f(x) adalah jari-jari pada setiap titik x.
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Substitusi fungsi:</p>
              <BlockMath math={`S = \\int_{a}^{b} ${convertToLatex(surfaceAreaIntegral)} \\, dx`} />
              <p className="text-sm text-gray-500 mt-2">
                Integral ini menghitung total luas permukaan ketika kurva diputar 360° mengelilingi sumbu x.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-800 mb-2">4. Volume Benda Putar</h3>
          <div className="bg-gray-50 p-4 rounded-md space-y-4">
            <div>
              <p className="text-gray-600 mb-2">Rumus volume:</p>
              <BlockMath math="V = \pi \int_a^b [f(x)]^2 \, dx" />
              <p className="text-sm text-gray-500 mt-2">
                Volume benda putar dihitung dengan mengintegralkan luas penampang lingkaran (πr²)
                pada setiap titik x. Jari-jari lingkaran pada setiap titik adalah f(x).
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Substitusi fungsi:</p>
              <BlockMath math={`V = \\int_{a}^{b} ${convertToLatex(volumeIntegral)} \\, dx`} />
              <p className="text-sm text-gray-500 mt-2">
                Integral ini menghasilkan volume total benda yang terbentuk dari rotasi kurva
                mengelilingi sumbu x dari x = a hingga x = b.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};