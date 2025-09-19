const BACKEND_API_URL = "http://localhost:5000/api/chat"; // Change if deploying remotely
async function generateResponse(userMessage) {
  // Call Python backend API
  try {
    const res = await fetch(BACKEND_API_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({message: userMessage})
    });
    const data = await res.json();
    return data.response || "Sorry, couldn't get a response from AI.";
  } catch (err) {
    console.error("Backend error:", err);
    return "Sorry, there was a server error. Try again later!";
  }
}
