// ========== INTERACTIVE PROFILE ENHANCEMENTS ==========
(function initInteractiveFeatures() {
  let coffeeClicks = 0;
  const coffeeSpan = document.getElementById('coffeeCount');
  const coffeeCard = document.getElementById('coffeeStat');
  const commitCard = document.getElementById('commitStat');
  const commitSpan = document.getElementById('commitNumber');
  const iceCream = document.getElementById('iceCreamGif');
  const expBlock = document.getElementById('expBlock');

  if (coffeeCard) {
    coffeeCard.addEventListener('click', () => {
      coffeeClicks++;
      coffeeSpan.innerText = coffeeClicks;
      if (coffeeClicks === 5) alert("☕ 5 coffees — that's the spirit of a backend engineer!");
      else if (coffeeClicks === 10) alert("🚀 10 coffees! You are unstoppable. Want more .NET energy?");
      else if (coffeeClicks === 20) alert("🔥 Legendary! 20 coffees. You truly understand microservices resilience.");
    });
  }

  if (commitCard) {
    commitCard.addEventListener('click', () => {
      let current = parseInt(commitSpan.innerText);
      let newCommits = current + 128;
      commitSpan.innerText = newCommits;
      alert(`🎉 +128 commits simulated! Now showing ${newCommits}+ contributions. Evgenii's real impact: even bigger!`);
    });
  }

  if (iceCream) {
    iceCream.addEventListener('click', () => {
      iceCream.style.transform = 'scale(1.1) rotate(2deg)';
      setTimeout(() => { iceCream.style.transform = ''; }, 300);
      alert('🍦 Yay! Coding should always bring this smile. Check the chatbot for more stories!');
    });
  }

  if (expBlock) {
    expBlock.addEventListener('click', (e) => {
      if (e.target.tagName !== 'LI' && e.target.tagName !== 'SPAN' && e.target.tagName !== 'DIV') {
        alert('💼 PSJ Sovcombank: Evgenii engineered high-load C# microservices, event-driven systems, and payment gateways. Ask the chatbot for in-depth details!');
      }
    });
  }

  if (coffeeSpan) coffeeSpan.innerText = '0';
})();

// ========== ADVANCED CHATBOT (with full UI and context) ==========
(function initChatbot() {
  // Create and inject chatbot styles
  const style = document.createElement('style');
  style.textContent = `
    .chat-window {
      position: fixed;
      bottom: 95px;
      right: 24px;
      width: 390px;
      max-width: calc(100vw - 40px);
      background: #ffffff;
      border-radius: 32px;
      box-shadow: 0 25px 45px -10px rgba(0,0,0,0.35);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: 'Segoe UI', system-ui;
      z-index: 1001;
      border: 1px solid #ffcd94;
    }
    .chat-header {
      background: #2c2e3a;
      color: white;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      border-bottom: 2px solid #ffb347;
    }
    .close-chat {
      background: none;
      border: none;
      color: #ffcd94;
      font-size: 1.3rem;
      cursor: pointer;
      transition: 0.1s;
    }
    .close-chat:hover { color: white; }
    .chat-messages {
      height: 350px;
      overflow-y: auto;
      padding: 1rem;
      background: #fefcf8;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .message {
      max-width: 85%;
      padding: 8px 14px;
      border-radius: 24px;
      font-size: 0.85rem;
      line-height: 1.4;
      word-break: break-word;
      animation: fadeMsg 0.2s ease;
    }
    .bot-msg {
      background: #e9eef3;
      color: #1f2a3a;
      align-self: flex-start;
      border-bottom-left-radius: 6px;
    }
    .user-msg {
      background: #ffb347;
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 6px;
    }
    .chat-input-area {
      display: flex;
      border-top: 1px solid #f0e2d0;
      background: white;
      padding: 10px 12px;
      gap: 10px;
      align-items: center;
    }
    .chat-input {
      flex: 1;
      border: 1px solid #ffdfb8;
      border-radius: 60px;
      padding: 8px 14px;
      font-size: 0.8rem;
      outline: none;
      transition: 0.1s;
    }
    .chat-input:focus {
      border-color: #ffb347;
      box-shadow: 0 0 0 2px rgba(255,180,71,0.2);
    }
    .send-btn {
      background: #ffb347;
      border: none;
      border-radius: 30px;
      padding: 6px 14px;
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: 0.1s;
    }
    .send-btn:hover { background: #ff9c1a; }
    .typing {
      font-size: 0.75rem;
      color: #aa8e6c;
      padding: 4px 12px;
      font-style: italic;
    }
    .hidden-window { display: none; }
    .chat-suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 10px;
      background: #fffbf5;
      border-top: 1px solid #ffe3c2;
    }
    .suggestion-chip {
      background: #f0e7de;
      border-radius: 50px;
      padding: 5px 12px;
      font-size: 0.7rem;
      cursor: pointer;
      transition: 0.1s;
      font-weight: 500;
    }
    .suggestion-chip:hover {
      background: #ffb347;
      color: white;
      transform: scale(1.02);
    }
    @keyframes fadeMsg {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  const container = document.getElementById('chatbot-root');
  if (!container) return;

  let chatWindow = null;
  let messagesDiv = null;
  let inputField = null;
  let lastContext = 'general';

  const CORRECT_LINKEDIN = "https://www.linkedin.com/in/evgenii-gavrilenko-3b538a272/";
  const EMAIL = "gawrila33395@gmail.com";

  function getSmartReply(userMessage) {
    let msg = userMessage.toLowerCase().trim();
    
    if (msg.match(/^(hi|hello|hey|good morning|good afternoon|hola|sup)/)) {
      lastContext = 'greeting';
      return `👋 Hello! I'm Evgenii's intelligent assistant — fully aware of his C# journey at PSJ Sovcombank, contact details, and tech philosophy. Ask me about his microservices, LinkedIn (${CORRECT_LINKEDIN}), email, or achievements!`;
    }
    
    if (msg.match(/sovcombank|psj|experience|role|job description|what did he do|work at|banking system/)) {
      lastContext = 'sovcombank';
      return "Evgenii was a Software Engineer (C#) at PSJ Sovcombank from July 2019 to March 2023. He designed & scaled microservices for 1M+ users, used .NET Core, RabbitMQ, Docker, and led the payment gateway migration to .NET 6 (5k req/sec). He also improved transaction performance by 30% and reduced deployment time by 40%. Want to hear about tech stack or a specific project?";
    }
    
    if (msg.match(/tech stack|c#|\.net|asp\.net core|entity framework|rabbitmq|docker|ms sql|kubernetes|microservices/)) {
      lastContext = 'tech';
      return "⚙️ Core stack: C#, .NET Core 3.1 → .NET 6, ASP.NET Web API, Entity Framework Core, MS SQL, RabbitMQ (event bus), Docker, Kubernetes (basics), GitLab CI. He's also experienced with RESTful design, unit testing (xUnit), and high-throughput systems. Ask me about his event-driven architecture!";
    }
    
    if (msg.match(/achievement|accomplishment|proud|key result|milestone|payment gateway|99.99|uptime|performance/)) {
      lastContext = 'achievements';
      return "🏆 Top achievements at PSJ Sovcombank:\n• Led migration of critical payment gateway to .NET 6, handling 5k+ requests/sec with 99.99% uptime.\n• Improved transaction processing by 30% through async patterns and caching.\n• Reduced deployment time by 40% with Docker + GitLab CI.\n• Mentored 4 junior engineers and raised code coverage to 85%.";
    }
    
    if (msg.match(/linkedin|email|contact|gawrila|gmail|reach out|connect|profile/)) {
      lastContext = 'contact';
      return `📬 You can find Evgenii on LinkedIn: ${CORRECT_LINKEDIN}  |  Direct email: ${EMAIL} — he's open to networking, backend roles, and technical discussions!`;
    }
    
    if (msg.match(/coffee|commit|ice cream|gif|stat|click|interactive|fun feature/)) {
      lastContext = 'interactive';
      return "🎮 On this page: click the coffee counter to track your dev-fuel (try 5 clicks!). The commit counter grows each time you click it, and the ice-cream GIF gives a sweet surprise. The experience block also reveals insights. It's all about making engineering fun!";
    }
    
    // fallback with context memory
    if (lastContext === 'sovcombank') {
      return "More about his PSJ Sovcombank role: He also implemented real-time dashboards for risk assessment, refactored legacy monolith, and introduced message-driven architecture. Would you like details about the C# microservices design pattern?";
    } else if (lastContext === 'tech') {
      return "He's particularly fond of clean architecture, MediatR, and vertical slice patterns. Do you want to know about his experience with message brokers or high-load optimizations?";
    } else if (lastContext === 'contact') {
      return `LinkedIn profile: ${CORRECT_LINKEDIN}  |  Email: ${EMAIL}. Don't hesitate to send a message!`;
    }
    
    return `🤖 I'm here to answer anything about Evgenii's background: PSJ Sovcombank (C# engineer, 2019-2023), his tech stack (.NET, RabbitMQ, Docker), LinkedIn (${CORRECT_LINKEDIN}), email, or interactive page elements. Try: 'Tell me about PSJ Sovcombank', 'tech stack', 'contact info', 'achievements', or 'coffee counter'.`;
  }

  function addMessage(text, isUser) {
    if (!messagesDiv) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isUser ? 'user-msg' : 'bot-msg'}`;
    msgDiv.textContent = text;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  function showTypingAndRespond(userText) {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing';
    typingDiv.textContent = '🧠 Evgenii AI is reasoning...';
    typingDiv.id = 'dynamicTyping';
    messagesDiv.appendChild(typingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    setTimeout(() => {
      const temp = document.getElementById('dynamicTyping');
      if (temp) temp.remove();
      const reply = getSmartReply(userText);
      addMessage(reply, false);
    }, 500);
  }

  function sendMessage() {
    if (!inputField) return;
    const text = inputField.value.trim();
    if (text === "") return;
    addMessage(text, true);
    inputField.value = "";
    showTypingAndRespond(text);
  }

  function handleSuggestion(suggestionText) {
    addMessage(suggestionText, true);
    showTypingAndRespond(suggestionText);
  }

  function buildChatInterface() {
    const win = document.createElement('div');
    win.className = 'chat-window hidden-window';
    win.innerHTML = `
      <div class="chat-header">
        <h4>🤖 Evgenii AI · C# expert</h4>
        <button class="close-chat" id="closeChatBtn">✕</button>
      </div>
      <div class="chat-messages" id="chatMessagesArea"></div>
      <div class="chat-suggestions">
        <span class="suggestion-chip" data-suggest="Tell me about PSJ Sovcombank experience">💼 PSJ Sovcombank</span>
        <span class="suggestion-chip" data-suggest="C# .NET tech stack details">⚙️ Tech stack (.NET/C#)</span>
        <span class="suggestion-chip" data-suggest="LinkedIn and email contact">📧 LinkedIn & Email</span>
        <span class="suggestion-chip" data-suggest="Key achievements at bank">🏆 Key achievements</span>
        <span class="suggestion-chip" data-suggest="Interactive features on this page">🎮 Page interactions</span>
      </div>
      <div class="chat-input-area">
        <input type="text" class="chat-input" id="chatInputField" placeholder="Ask anything about Evgenii...">
        <button class="send-btn" id="sendChatBtn">Send</button>
      </div>
    `;
    return win;
  }

  function toggleChat() {
    if (!chatWindow) {
      chatWindow = buildChatInterface();
      container.appendChild(chatWindow);
      messagesDiv = chatWindow.querySelector('#chatMessagesArea');
      inputField = chatWindow.querySelector('#chatInputField');
      const closeBtn = chatWindow.querySelector('#closeChatBtn');
      const sendBtn = chatWindow.querySelector('#sendChatBtn');
      const chips = chatWindow.querySelectorAll('.suggestion-chip');

      closeBtn.addEventListener('click', () => {
        chatWindow.classList.add('hidden-window');
      });
      sendBtn.addEventListener('click', sendMessage);
      inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
      });
      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          const suggestion = chip.getAttribute('data-suggest');
          if (suggestion) handleSuggestion(suggestion);
        });
      });
      addMessage(`✨ Hey! I'm the upgraded chatbot. Ask me anything: his 4 years at PSJ Sovcombank (C#), LinkedIn (${CORRECT_LINKEDIN}), email, tech achievements, or the fun stats on this page. Let's explore!`, false);
    }
    if (chatWindow.classList.contains('hidden-window')) {
      chatWindow.classList.remove('hidden-window');
    } else {
      chatWindow.classList.add('hidden-window');
    }
  }

  // Create floating button
  const floatingBtn = document.createElement('button');
  floatingBtn.className = 'chat-toggle-btn';
  floatingBtn.innerHTML = '💬';
  floatingBtn.setAttribute('aria-label', 'Open assistant');
  floatingBtn.addEventListener('click', toggleChat);
  container.appendChild(floatingBtn);
})();
