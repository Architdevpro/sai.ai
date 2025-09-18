// sai.js
// External JS for SAI Chat Assistant
// NOTES:
// - This file intentionally contains only JavaScript logic (no static HTML/CSS).
// - It assumes your existing index.html already contains the static UI and elements
//   with IDs: chatContainer, messageInput and that the buttons/inputs call
//   handleKeyDown, autoResize, sendMessage and clearChat (these are exposed on window).
// - clearChat() here uses location.reload() to restore the original static welcome
//   markup from index.html (avoids re-creating that markup in JS).

// --- Helpers ---
function _escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function _extractRelatedTopicsText(topics) {
  if (!Array.isArray(topics)) return '';
  for (const t of topics) {
    if (t && typeof t.Text === 'string' && t.Text.trim()) return t.Text;
    if (t && Array.isArray(t.Topics) && t.Topics.length) {
      const inner = _extractRelatedTopicsText(t.Topics);
      if (inner) return inner;
    }
  }
  return '';
}

// --- DuckDuckGo Instant Answer fetch (returns string or empty string on no-answer) ---
async function fetchDuckDuckGo(query) {
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response not ok: ' + res.status);
    const data = await res.json();

    if (data.AbstractText && data.AbstractText.trim()) return data.AbstractText.trim();
    if (data.Answer && data.Answer.trim()) return data.Answer.trim();
    if (Array.isArray(data.RelatedTopics) && data.RelatedTopics.length) {
      const t = _extractRelatedTopicsText(data.RelatedTopics);
      if (t && t.trim()) return t.trim();
    }
    return '';
  } catch (err) {
    console.error('fetchDuckDuckGo error:', err);
    return '';
  }
}

// --- Public functions expected by index.html (exposed on window) ---
window.isTyping = false;

window.handleKeyDown = function (event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    window.sendMessage();
  }
};

window.autoResize = function (textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
};

function isMathQuery(query) {
  let keywords = ["differentiate", "integrate", "simplify", "+", "-", "*", "/", "=", "^"];
  return keywords.some(k => query.toLowerCase().includes(k));
}

async function generateResponse(userMessage) {
  // Check if it's a math query
  if (isMathQuery(userMessage)) {
    return solveMath(userMessage); // from sai_math.js
  }

  // Otherwise, use DuckDuckGo API (existing logic)
  const answer = await fetchDuckDuckGo(userMessage);
  if (answer) {
    return answer;
  }
  return "I couldn't find a concise Instant Answer for that. Try rephrasing!";
}

window.sendMessage = async function () {
  const input = document.getElementById('messageInput');
  if (!input) return;
  const message = input.value.trim();
  if (!message || window.isTyping) return;

  window.addMessage(message, 'user');
  input.value = '';
  input.style.height = 'auto';

  window.showTypingIndicator();
  const response = await window.generateResponse(message);
  window.hideTypingIndicator();
  window.addMessage(response || "Sorry, I couldn't fetch results right now.", 'assistant');
};

window.addMessage = function (content, sender) {
  const chatContainer = document.getElementById('chatContainer');
  if (!chatContainer) return;

  const messageDiv = document.createElement('div');
  messageDiv.className = 'flex items-start space-x-3 message-enter';

  const safe = _escapeHtml(content);

  if (sender === 'user') {
    messageDiv.innerHTML = `
      <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      </div>
      <div class="bg-blue-600 text-white rounded-lg px-4 py-3 max-w-3xl ml-auto">
        <p>${safe}</p>
      </div>
    `;
    messageDiv.classList.add('flex-row-reverse');
  } else {
    messageDiv.innerHTML = `
      <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>
      </div>
      <div class="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200 max-w-3xl">
        <p class="text-gray-800">${safe}</p>
      </div>
    `;
  }

  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
};

window.showTypingIndicator = function () {
  if (window.isTyping) return;
  window.isTyping = true;

  const chatContainer = document.getElementById('chatContainer');
  if (!chatContainer) return;

  const typingDiv = document.createElement('div');
  typingDiv.id = 'typingIndicator';
  typingDiv.className = 'flex items-start space-x-3 message-enter';
  typingDiv.innerHTML = `
    <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
      </svg>
    </div>
    <div class="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
      <div class="flex space-x-1">
        <div class="typing-animation"></div>
        <div class="typing-animation"></div>
        <div class="typing-animation"></div>
      </div>
    </div>
  `;

  chatContainer.appendChild(typingDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
};

window.hideTypingIndicator = function () {
  const typingIndicator = document.getElementById('typingIndicator');
  if (typingIndicator) typingIndicator.remove();
  window.isTyping = false;
};

window.clearChat = function () {
  location.reload();
};

document.addEventListener('DOMContentLoaded', function () {
  const input = document.getElementById('messageInput');
  if (input) input.focus();
});


