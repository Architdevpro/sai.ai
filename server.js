// server.js
// Express backend for SAI Sample Paper Generator

const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Static subject/grade data and sample paper logic (stub for future AI)
const SUBJECTS = ["Math", "Science", "English", "Social Studies"];
const GRADES = ["9", "10", "11", "12"];

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

function generateSamplePaper(subject, grade) {
  let questions = QUESTION_BANK[subject] || [];
  // In future: filter/tailor questions by grade
  return {
    subject,
    grade,
    questions
  };
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, JS, CSS)
app.use(express.static(__dirname));

// Sample Paper API
app.post('/api/generate-sample-paper', (req, res) => {
  const { subject, grade } = req.body;
  if (!subject || !grade) {
    return res.status(400).json({ error: "Subject and grade required." });
  }
  const paper = generateSamplePaper(subject, grade);
  res.json(paper);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
