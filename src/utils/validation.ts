import { create, all } from 'mathjs';

const math = create(all);

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}

export const validateMathFunction = (input: string): ValidationResult => {
  if (!input.trim()) {
    return {
      isValid: false,
      error: 'Fungsi tidak boleh kosong',
    };
  }

  try {
    // Normalisasi input
    let normalizedInput = input
      .replace(/\^/g, '**')  // Ubah ^ menjadi **
      .replace(/e\s*\^\s*x/g, 'exp(x)'); // Ubah e^x menjadi exp(x)

    // Coba parse ekspresi
    const node = math.parse(normalizedInput);
    
    // Sanitasi input dengan mengubah kembali ke string
    const sanitized = node.toString()
      .replace(/\*\*/g, '^')  // Kembalikan ** menjadi ^
      .replace(/pow\(x,2\)/g, 'x^2')  // Kembalikan pow(x,2) menjadi x^2
      .replace(/pow\(x,3\)/g, 'x^3'); // Kembalikan pow(x,3) menjadi x^3

    return {
      isValid: true,
      sanitized,
    };
  } catch (error) {
    return {
      isValid: true,
      sanitized: input,
    };
  }
};

export const validateBounds = (lower: number, upper: number): ValidationResult => {
  if (isNaN(lower) || isNaN(upper)) {
    return {
      isValid: false,
      error: 'Batas harus berupa angka',
    };
  }

  if (lower >= upper) {
    return {
      isValid: false,
      error: 'Batas atas harus lebih besar dari batas bawah',
    };
  }

  if (!isFinite(lower) || !isFinite(upper)) {
    return {
      isValid: false,
      error: 'Batas harus berupa angka terbatas',
    };
  }

  return { isValid: true };
};