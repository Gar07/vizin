import React from 'react';
import { Button } from './Button';

interface ScientificKeypadProps {
  onInput: (value: string) => void;
}

export const ScientificKeypad: React.FC<ScientificKeypadProps> = ({ onInput }) => {
  const functions = [
    { label: 'sin', value: 'sin(' },
    { label: 'cos', value: 'cos(' },
    { label: 'tan', value: 'tan(' },
    { label: 'ln', value: 'ln(' },
    { label: 'log', value: 'log(' },
    { label: 'sqrt', value: 'sqrt(' },
    { label: 'x²', value: 'x^2' },
    { label: 'x³', value: 'x^3' },
    { label: 'x^n', value: 'x^' },
    { label: 'e^x', value: 'exp(' },
    { label: 'π', value: 'pi' },
    { label: 'e', value: 'e' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {functions.map((func) => (
        <Button
          key={func.label}
          onClick={() => onInput(func.value)}
          className="p-2 text-sm bg-blue-500 hover:bg-blue-700 rounded"
        >
          {func.label}
        </Button>
      ))}
    </div>
  );
};