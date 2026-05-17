export interface Question {
  id: string;
  questionEn: string;
  questionHi: string;
  optionsEn: string[];
  optionsHi: string[];
  correctAnswerIndex: number;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateOptions(correct: number, variance: number): string[] {
  const opts = new Set<number>();
  opts.add(correct);
  while (opts.size < 4) {
    const fake = correct + Math.floor(Math.random() * variance * 2) - variance;
    if (fake !== correct && fake >= 0) opts.add(fake);
  }
  
  // Failsafe: if we couldn't get 4 unique options quickly
  let fallback = correct + 1;
  while(opts.size < 4) {
    if (!opts.has(fallback)) opts.add(fallback);
    fallback++;
  }
  
  return Array.from(opts).map(String);
}

export function generateQuiz(count: number = 75): Question[] {
  const questions: Question[] = [];
  const types = 8;
  
  for (let i = 0; i < count; i++) {
    const type = Math.floor(Math.random() * types);
    let qEn = '', qHi = '', correct = 0;
    let pVariance = 10;
    
    switch (type) {
      case 0: { // Addition
        const a = Math.floor(Math.random() * 90) + 10;
        const b = Math.floor(Math.random() * 90) + 10;
        qEn = `What is ${a} + ${b}?`;
        qHi = `${a} + ${b} का मान क्या है?`;
        correct = a + b;
        pVariance = 15;
        break;
      }
      case 1: { // Subtraction
        const a = Math.floor(Math.random() * 100) + 50;
        const b = Math.floor(Math.random() * 40) + 10;
        qEn = `What is ${a} - ${b}?`;
        qHi = `${a} - ${b} का मान क्या है?`;
        correct = a - b;
        pVariance = 12;
        break;
      }
      case 2: { // Multiplication
        const a = Math.floor(Math.random() * 15) + 5;
        const b = Math.floor(Math.random() * 15) + 5;
        qEn = `What is ${a} × ${b}?`;
        qHi = `${a} × ${b} कितना होता है?`;
        correct = a * b;
        pVariance = 20;
        break;
      }
      case 3: { // Division
        const b = Math.floor(Math.random() * 15) + 2;
        const correctAns = Math.floor(Math.random() * 20) + 2;
        const a = b * correctAns;
        qEn = `What is ${a} ÷ ${b}?`;
        qHi = `${a} ÷ ${b} कितना होता है?`;
        correct = correctAns;
        pVariance = 8;
        break;
      }
      case 4: { // Square
        const a = Math.floor(Math.random() * 20) + 5;
        qEn = `What is the square of ${a}?`;
        qHi = `${a} का वर्ग (square) क्या है?`;
        correct = a * a;
        pVariance = 30;
        break;
      }
      case 5: { // Square Root
        const a = Math.floor(Math.random() * 20) + 5;
        correct = a;
        const sq = a * a;
        qEn = `What is the square root of ${sq}?`;
        qHi = `${sq} का वर्गमूल (square root) क्या है?`;
        pVariance = 6;
        break;
      }
      case 6: { // Algebra
        const x = Math.floor(Math.random() * 30) + 5;
        const b = Math.floor(Math.random() * 20) + 5;
        const c = x + b;
        qEn = `If x + ${b} = ${c}, what is the value of x?`;
        qHi = `यदि x + ${b} = ${c}, तो x का मान क्या है?`;
        correct = x;
        pVariance = 10;
        break;
      }
      case 7: { // Percentage
        const p = (Math.floor(Math.random() * 9) + 1) * 10; 
        const val = (Math.floor(Math.random() * 20) + 5) * 10;
        qEn = `What is ${p}% of ${val}?`;
        qHi = `${val} का ${p}% क्या है?`;
        correct = (p * val) / 100; // This is always an integer since p & val are multiples of 10
        pVariance = 20;
        break;
      }
    }

    const rawOpts = generateOptions(correct, pVariance);
    const shuffledOpts = shuffle(rawOpts);
    const correctIndex = shuffledOpts.indexOf(String(correct));

    questions.push({
      id: `q-${Date.now()}-${i}`,
      questionEn: qEn,
      questionHi: qHi,
      optionsEn: shuffledOpts,
      optionsHi: shuffledOpts,
      correctAnswerIndex: correctIndex
    });
  }

  return questions;
}
