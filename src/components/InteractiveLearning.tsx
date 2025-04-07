import React, { useState } from 'react';
import { BlockMath } from 'react-katex';
import { Play, Pause, SkipBack, SkipForward, Brain } from 'lucide-react';
import { Button } from './Button';
import 'katex/dist/katex.min.css';

interface Step {
  title: string;
  description: string;
  formula: string;
  animation?: string;
}

interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface InteractiveLearningProps {
  function_: string;
  derivative: string;
}

export const InteractiveLearning: React.FC<InteractiveLearningProps> = ({
  function_,
  derivative,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const steps: Step[] = [
    {
      title: 'Fungsi Awal',
      description: 'Kita mulai dengan fungsi f(x) yang akan diputar mengelilingi sumbu x.',
      formula: `f(x) = ${function_}`,
    },
    {
      title: 'Turunan Fungsi',
      description: 'Langkah pertama adalah mencari turunan f\'(x) untuk menghitung panjang busur.',
      formula: `f'(x) = ${derivative}`,
    },
    {
      title: 'Panjang Busur',
      description: 'Panjang busur dihitung menggunakan integral dari akar 1 + [f\'(x)]².',
      formula: `L = \\int_a^b \\sqrt{1 + (${derivative})^2} \\, dx`,
    },
    {
      title: 'Luas Permukaan',
      description: 'Luas permukaan benda putar dihitung dengan mengintegralkan keliling lingkaran × panjang busur.',
      formula: `S = 2\\pi \\int_a^b ${function_} \\sqrt{1 + (${derivative})^2} \\, dx`,
    },
    {
      title: 'Volume',
      description: 'Volume benda putar dihitung dengan mengintegralkan luas penampang lingkaran.',
      formula: `V = \\pi \\int_a^b (${function_})^2 \\, dx`,
    },
  ];

  const quiz: Quiz = {
    question: `Jika f(x) = ${function_}, berapakah pangkat tertinggi dalam rumus volume benda putar?`,
    options: [
      'Pangkat 1',
      'Pangkat 2',
      'Pangkat 3',
      'Pangkat 4',
    ],
    correctAnswer: 1, // index 1 = Pangkat 2
    explanation: 'Dalam rumus volume benda putar, fungsi dikuadratkan sehingga pangkat tertingginya adalah 2 kali pangkat tertinggi fungsi asli.',
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowQuiz(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setIsPlaying(false);
            setShowQuiz(true);
            return prev;
          }
        });
      }, 3000);
    }
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold">Mode Pembelajaran Interaktif</h2>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="p-2"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            onClick={togglePlayPause}
            className="p-2"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={handleNext}
            disabled={currentStep === steps.length - 1 && !showQuiz}
            className="p-2"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!showQuiz ? (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              {steps[currentStep].title}
            </h3>
            <p className="text-blue-700 mb-4">
              {steps[currentStep].description}
            </p>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <BlockMath math={steps[currentStep].formula} />
            </div>
          </div>

          <div className="flex justify-center">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full mx-1 transition-colors ${
                  index === currentStep
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-purple-900 mb-4">
              Quiz: {quiz.question}
            </h3>
            <div className="space-y-2">
              {quiz.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-3 rounded-md transition-colors ${
                    selectedAnswer === index
                      ? index === quiz.correctAnswer
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </button>
              ))}
            </div>
            {showExplanation && (
              <div className="mt-4 p-4 bg-blue-50 rounded-md">
                <p className="text-blue-800">{quiz.explanation}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};