import React, { useState, useEffect, useCallback } from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from './Button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { usePreferencesStore } from '../store/preferencesStore';

interface TutorialStep {
  title: string;
  description: string;
  highlight?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Selamat Datang di Vizin',
    description: 'Aplikasi ini akan membantu Anda memahami konsep kalkulus integral melalui visualisasi interaktif.',
  },
  {
    title: 'Masukkan Fungsi',
    description: 'Gunakan kalkulator sains untuk memasukkan fungsi matematika. Anda dapat menggunakan fungsi trigonometri, eksponensial, dan operasi dasar.',
    highlight: '.function-input',
  },
  {
    title: 'Tentukan Batas',
    description: 'Masukkan batas bawah dan atas untuk menentukan interval perhitungan integral.',
    highlight: '.bounds-input',
  },
  {
    title: 'Visualisasi 2D dan 3D',
    description: 'Lihat grafik fungsi dalam bentuk 2D dan visualisasi benda putar 3D yang dapat dirotasi.',
    highlight: '.visualization',
  },
  {
    title: 'Hasil Perhitungan',
    description: 'Dapatkan hasil perhitungan panjang busur, luas permukaan, dan volume benda putar.',
    highlight: '.results',
  },
];

interface TutorialProps {
  forceShow?: boolean;
}

export const Tutorial: React.FC<TutorialProps> = ({ forceShow = false }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const tutorialSeen = usePreferencesStore(state => state.tutorialSeen);
  const isManualTutorial = usePreferencesStore(state => state.isManualTutorial);
  const setTutorialSeen = usePreferencesStore(state => state.setTutorialSeen);
  const setManualTutorial = usePreferencesStore(state => state.setManualTutorial);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show tutorial on first visit or when manually triggered
    if (!tutorialSeen || (forceShow && isManualTutorial)) {
      setIsOpen(true);
    }
  }, [tutorialSeen, forceShow, isManualTutorial]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setTutorialSeen(true);
    setManualTutorial(false);
  }, [setTutorialSeen, setManualTutorial]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isOpen) {
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrevious();
        if (e.key === 'Escape') handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, handleClose]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrevious();

    setTouchStart(0);
    setTouchEnd(0);
  };

  useEffect(() => {
    if (isOpen && tutorialSteps[currentStep].highlight) {
      const element = document.querySelector(tutorialSteps[currentStep].highlight!);
      if (element) {
        element.classList.add('tutorial-highlight');
      }
      return () => {
        if (element) {
          element.classList.remove('tutorial-highlight');
        }
      };
    }
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="min-h-screen px-4 flex items-center justify-center">
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

        <div 
          className="relative bg-white rounded-xl w-full max-w-md mx-auto p-6 shadow-xl transform transition-all"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>

          <Dialog.Title className="text-xl sm:text-2xl font-semibold text-gray-900 pr-8">
            {tutorialSteps[currentStep].title}
          </Dialog.Title>

          <div className="mt-4">
            <p className="text-base sm:text-lg text-gray-600">
              {tutorialSteps[currentStep].description}
            </p>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              className={`min-w-[44px] min-h-[44px] ${currentStep === 0 ? 'invisible' : ''}`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline ml-2">Sebelumnya</span>
            </Button>

            <Button
              onClick={handleNext}
              className="min-w-[44px] min-h-[44px]"
            >
              {currentStep === tutorialSteps.length - 1 ? (
                'Selesai'
              ) : (
                <>
                  <span className="hidden sm:inline mr-2">Lanjut</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>

          <div className="mt-6 flex justify-center space-x-2">
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
};