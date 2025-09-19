const BACKEND_API_URL = "http://localhost:5000/api/chat"; // Change if deploying remotely

// --- API Call ---
async function generateResponse(userMessage) {
  try {
    const res = await fetch(BACKEND_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage })
    });
    const data = await res.json();
    return data.response || "Sorry, couldn't get a response from AI.";
  } catch (err) {
    console.error("Backend error:", err);
    return "Sorry, there was a server error. Try again later!";
  }
}

// --- Helper: Add message to chat container ---
function addMessage(content, isUser = false) {
  const chatContainer = document.getElementById("chatContainer");
  const messageDiv = document.createElement("div");
  messageDiv.className = `flex items-start space-x-3 message-enter ${isUser ? 'justify-end' : ''}`;
  messageDiv.innerHTML = isUser
    ? `<div class="bg-blue-100 rounded-lg px-4 py-3 shadow-sm border border-blue-200 max-w-3xl ml-auto text-gray-900">${content}</div>`
    : `<div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
         <!-- Replace with full Heroicons SVG -->
         <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
             d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707M9.663 17h4.673M12 21v-1"/>
         </svg>
       </div>
       <div class="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200 max-w-3xl">${content}</div>`;
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// --- Send Message Function ---
async function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, true); // Show user message
  input.value = "";

  // Typing animation
  const chatContainer = document.getElementById("chatContainer");
  const typingDiv = document.createElement("div");
  typingDiv.className = "flex items-start space-x-3 message-enter";
  typingDiv.innerHTML = `<div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0"></div>
      <div class="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200 max-w-3xl">
        <span class="typing-animation"></span>
        <span class="typing-animation"></span>
        <span class="typing-animation"></span>
      </div>`;
  chatContainer.appendChild(typingDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  try {
    const botResponse = await generateResponse(message);
    addMessage(botResponse, false);
  } catch (e) {
    addMessage("Failed to reach AI server.", false);
  } finally {
    chatContainer.removeChild(typingDiv);
  }
}

// --- Handle Enter Key Press ---
function handleKeyDown(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

// --- Auto Resize Textarea ---
function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = (textarea.scrollHeight) + 'px';
}
