// sai_sample_papers.js
// Simple AI-Generated Sample Papers module (stub for future AI integration)

const SUBJECTS = ["Math", "Science", "English", "Social Studies"];
const GRADES = ["9", "10", "11", "12"];

// Example question bank (stub, replace with AI later)
const QUESTION_BANK = {
  Math: [
    "Solve: 2x + 3 = 7",
    "Differentiate: x^2 + 3x",
    "Integrate: 5x dx",
    "Simplify: (x+2)(x-2)"
  ],
  Science: [
    "What is Newton's Second Law?",
    "Describe the structure of an atom.",
    "Explain photosynthesis.",
    "What is Ohm's Law?"
  ],
  English: [
    "Write a summary of any Shakespeare play.",
    "Explain the meaning of 'metaphor'.",
    "Correct the sentence: 'He go to school.'",
    "What is the theme of the poem 'Daffodils'?"
  ],
  "Social Studies": [
    "Explain the causes of World War II.",
    "What is democracy?",
    "Describe the Mughal Empire.",
    "What is the Constitution?"
  ]
};

// Generates a sample paper (stub, later use real AI)
function generateSamplePaper(subject, grade) {
  let questions = QUESTION_BANK[subject] || [];
  // In real AI: filter/tailor questions by grade
  // For now: just pick all subject questions
  return {
    subject,
    grade,
    questions
  };
}

// For frontend usage
window.generateSamplePaper = generateSamplePaper;

module.exports = { generateSamplePaper };
