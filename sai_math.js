// sai_math.js
// Math solving module for Sai Assistant
// Requires math.js (loaded in index.html)

function solveMath(query) {
  try {
    query = query.trim();

    // Differentiation
    if (query.toLowerCase().startsWith("differentiate")) {
      let expr = query.replace(/differentiate/i, "").trim();
      let derivative = math.derivative(expr, "x").toString();
      return "Derivative: " + derivative;
    }

    // Simplification
    if (query.toLowerCase().startsWith("simplify")) {
      let expr = query.replace(/simplify/i, "").trim();
      let simplified = math.simplify(expr).toString();
      return "Simplified: " + simplified;
    }

    // Arithmetic or general math evaluation
    let result = math.evaluate(query);
    return "Answer: " + result;

  } catch (err) {
    return "Sorry, I couldn’t solve that math problem. Error: " + err.message;
  }
}

// Expose globally
window.solveMath = solveMath;
