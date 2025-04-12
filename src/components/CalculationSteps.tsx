import React from 'react';
import { Book, ChevronDown } from 'lucide-react';
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
    .replace(/csc\(/g, '\\csc(')
    .replace(/sec\(/g, '\\sec(')
    .replace(/cot\(/g, '\\cot(')
    .replace(/asin\(/g, '\\arcsin(')
    .replace(/acos\(/g, '\\arccos(')
    .replace(/atan\(/g, '\\arctan(')
    .replace(/exp\(/g, '\\exp(')
    .replace(/ln\(/g, '\\ln(')
    .replace(/log\(/g, '\\log(')
    .replace(/\^(\d+)/g, '^{$1}')
    .replace(/\^([a-z])/g, '^{$1}')
    .replace(/\^\(([^)]+)\)/g, '^{($1)}')
    .replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}')
    .replace(/\(([^)]+)\)\/\(([^)]+)\)/g, '\\frac{$1}{$2}');
};

export const CalculationSteps: React.FC<CalculationStepsProps> = ({
  function_,
  derivative,
  arcLengthIntegral,
  surfaceAreaIntegral,
  volumeIntegral,
}) => {
  const [expandedSections, setExpandedSections] = React.useState<{[key: string]: boolean}>({
    'function': true,
    'derivative': true,
    'arcLength': true,
    'surfaceArea': true,
    'volume': true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const SectionHeader = ({ title, section }: { title: string; section: string }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-t-lg hover:bg-blue-100 transition-colors"
    >
      <h3 className="text-lg font-medium text-blue-900">{title}</h3>
      <ChevronDown
        className={`w-5 h-5 text-blue-500 transform transition-transform ${
          expandedSections[section] ? 'rotate-180' : ''
        }`}
      />
    </button>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-6">
        <Book className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-semibold">Langkah-langkah Perhitungan</h2>
      </div>

      <div className="space-y-6">
        {/* 1. Fungsi dan Domain */}
        <div className="border rounded-lg">
          <SectionHeader title="1. Fungsi dan Domain" section="function" />
          {expandedSections.function && (
            <div className="p-4 space-y-4">
              <div>
                <p className="text-gray-700 mb-2">Fungsi yang akan dianalisis:</p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <BlockMath math={`f(x) = ${convertToLatex(function_)}`} />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">Catatan penting:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Pastikan fungsi kontinu pada domain yang diberikan</li>
                  <li>Perhatikan pembatasan domain untuk fungsi-fungsi khusus (mis. logaritma, akar)</li>
                  <li>Fungsi harus bernilai real pada interval yang ditentukan</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* 2. Turunan */}
        <div className="border rounded-lg">
          <SectionHeader title="2. Turunan Fungsi" section="derivative" />
          {expandedSections.derivative && (
            <div className="p-4 space-y-4">
              <div>
                <p className="text-gray-700 mb-2">Turunan pertama:</p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <BlockMath math={`f'(x) = ${convertToLatex(derivative)}`} />
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-md">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">Mengapa kita perlu turunan?</span>
                  <br />
                  Turunan diperlukan untuk:
                </p>
                <ul className="list-disc list-inside text-sm text-yellow-800 mt-2">
                  <li>Menghitung panjang busur melalui formula <InlineMath math="\sqrt{1 + [f'(x)]^2}" /></li>
                  <li>Menentukan luas permukaan benda putar</li>
                  <li>Menganalisis kemiringan kurva di setiap titik</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* 3. Panjang Busur */}
        <div className="border rounded-lg">
          <SectionHeader title="3. Panjang Busur" section="arcLength" />
          {expandedSections.arcLength && (
            <div className="p-4 space-y-4">
              <div>
                <p className="text-gray-700 mb-2">Rumus umum panjang busur:</p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <BlockMath math="L = \int_a^b \sqrt{1 + [f'(x)]^2} \, dx" />
                </div>
              </div>
              <div>
                <p className="text-gray-700 mb-2">Substitusi turunan:</p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <BlockMath math={`L = \\int_a^b ${convertToLatex(arcLengthIntegral)} \\, dx`} />
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Penjelasan formula:</span>
                </p>
                <ol className="list-decimal list-inside text-sm text-blue-800 mt-2 space-y-2">
                  <li>Formula ini berasal dari pendekatan panjang kurva menggunakan segmen-segmen kecil</li>
                  <li>Setiap segmen kecil memiliki panjang <InlineMath math="\sqrt{(\Delta x)^2 + (\Delta y)^2}" /></li>
                  <li>Saat <InlineMath math="\Delta x \to 0" />, kita mendapatkan integral di atas</li>
                  <li>Bagian <InlineMath math="\sqrt{1 + [f'(x)]^2}" /> mewakili faktor pemanjangan kurva</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* 4. Luas Permukaan */}
        <div className="border rounded-lg">
          <SectionHeader title="4. Luas Permukaan Benda Putar" section="surfaceArea" />
          {expandedSections.surfaceArea && (
            <div className="p-4 space-y-4">
              <div>
                <p className="text-gray-700 mb-2">Rumus umum luas permukaan:</p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <BlockMath math="S = 2\pi \int_a^b f(x) \sqrt{1 + [f'(x)]^2} \, dx" />
                </div>
              </div>
              <div>
                <p className="text-gray-700 mb-2">Substitusi fungsi dan turunan:</p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <BlockMath math={`S = \\int_a^b ${convertToLatex(surfaceAreaIntegral)} \\, dx`} />
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-md">
                <p className="text-sm text-green-800">
                  <span className="font-medium">Penjelasan formula:</span>
                </p>
                <ol className="list-decimal list-inside text-sm text-green-800 mt-2 space-y-2">
                  <li>Faktor <InlineMath math="2\pi f(x)" /> adalah keliling lingkaran pada setiap titik x</li>
                  <li>Faktor <InlineMath math="\sqrt{1 + [f'(x)]^2}" /> adalah panjang busur elemen</li>
                  <li>Integral menghitung total luas permukaan dari semua "cincin" infinitesimal</li>
                  <li>Hasil akhir adalah luas permukaan total benda putar</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* 5. Volume */}
        <div className="border rounded-lg">
          <SectionHeader title="5. Volume Benda Putar" section="volume" />
          {expandedSections.volume && (
            <div className="p-4 space-y-4">
              <div>
                <p className="text-gray-700 mb-2">Rumus umum volume:</p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <BlockMath math="V = \pi \int_a^b [f(x)]^2 \, dx" />
                </div>
              </div>
              <div>
                <p className="text-gray-700 mb-2">Substitusi fungsi:</p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <BlockMath math={`V = \\int_a^b ${convertToLatex(volumeIntegral)} \\, dx`} />
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-md">
                <p className="text-sm text-purple-800">
                  <span className="font-medium">Penjelasan formula:</span>
                </p>
                <ol className="list-decimal list-inside text-sm text-purple-800 mt-2 space-y-2">
                  <li>Formula ini menggunakan metode cakram (disk method)</li>
                  <li>Faktor <InlineMath math="\pi [f(x)]^2" /> adalah luas penampang lingkaran</li>
                  <li>Setiap "irisan" memiliki ketebalan dx</li>
                  <li>Integral menjumlahkan volume semua irisan infinitesimal</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};