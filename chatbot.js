(() => {
  "use strict";

  if (document.getElementById("trustlensChat")) return;

  const widget = document.createElement("div");
  widget.id = "trustlensChat";
  widget.className = "chatbot";

  const fab = document.createElement("button");
  fab.className = "chatbot-fab";
  fab.type = "button";
  fab.setAttribute("aria-label", "Open TrustLens assistant");
  fab.setAttribute("aria-expanded", "false");
  fab.setAttribute("aria-controls", "chatbotPanel");
  fab.textContent = "✦";

  const panel = document.createElement("section");
  panel.className = "chatbot-panel";
  panel.id = "chatbotPanel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "false");
  panel.setAttribute("aria-labelledby", "chatbotTitle");

  const header = document.createElement("header");
  header.className = "chatbot-header";
  const headerCopy = document.createElement("div");
  const title = document.createElement("h2");
  title.id = "chatbotTitle";
  title.textContent = "TrustLens assistant";
  const subtitle = document.createElement("p");
  subtitle.textContent = "Automated demo help";
  headerCopy.append(title, subtitle);

  const closeButton = document.createElement("button");
  closeButton.className = "chatbot-close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close assistant");
  closeButton.textContent = "×";
  header.append(headerCopy, closeButton);

  const log = document.createElement("div");
  log.className = "chatbot-log";
  log.setAttribute("role", "log");
  log.setAttribute("aria-live", "polite");
  log.setAttribute("aria-relevant", "additions");

  const form = document.createElement("form");
  form.className = "chatbot-form";
  const inputLabel = document.createElement("label");
  inputLabel.className = "chatbot-sr-only";
  inputLabel.htmlFor = "chatbotInput";
  inputLabel.textContent = "Message the TrustLens assistant";
  const input = document.createElement("input");
  input.id = "chatbotInput";
  input.name = "message";
  input.type = "text";
  input.maxLength = 500;
  input.autocomplete = "off";
  input.placeholder = "Ask about TrustLens...";
  const send = document.createElement("button");
  send.className = "chatbot-send";
  send.type = "submit";
  send.setAttribute("aria-label", "Send message");
  send.textContent = "↑";
  form.append(inputLabel, input, send);

  const note = document.createElement("p");
  note.className = "chatbot-note";
  note.textContent = "Local demo replies. Don’t share sensitive information.";

  panel.append(header, log, form, note);
  widget.append(fab, panel);
  document.body.appendChild(widget);

  function appendMessage(type, text) {
    const message = document.createElement("div");
    message.className = `chat-msg ${type}-msg`;
    const author = document.createElement("span");
    author.className = "chat-author";
    author.textContent = type === "user" ? "You" : "TrustLens assistant";
    const content = document.createElement("p");
    content.className = "chat-bubble";
    content.textContent = text;
    message.append(author, content);
    log.appendChild(message);
    log.scrollTop = log.scrollHeight;
  }

  function replyFor(message) {
    const text = message.toLowerCase();
    if (/\b(hi|hello|hey)\b/.test(text)) return "Hello! Ask me about dashboard features, registration, privacy, or the demo workflows.";
    if (/\b(register|registration|employee id|division)\b/.test(text)) return "The Registration page checks name, employee ID, email, mobile, division, and password format locally. It doesn’t send or save entries.";
    if (/\b(sign[\s-]?in|login|log in)\b/.test(text)) return "Sign in is a format-checking demo only. Authentication is not connected, and credentials are not sent or stored.";
    if (/\b(sign[\s-]?up|create account|account)\b/.test(text)) return "Sign up checks an email, password, and Terms of Service consent. Account creation is not connected.";
    if (/\b(password|show|hide)\b/.test(text)) return "The sign-in page has a show/hide password control. The registration page checks password complexity and confirmation.";
    if (/\b(privacy|data|stored|save|saved|sent)\b/.test(text)) return "This assistant uses local keyword matching. Don’t enter sensitive information; chat messages aren’t sent to a service.";
    if (/\b(media|image|video|audio|file)\b/.test(text)) return "Media forensics creates a local demo record from file details. It doesn’t upload or analyze file contents.";
    if (/\b(threat|phishing|url|website)\b/.test(text)) return "The Threat analyzer checks URL format and illustrative string patterns locally. It doesn’t query live reputation or security feeds.";
    if (/\b(graph|trust score|score|investigation|dashboard)\b/.test(text)) return "The dashboard includes investigation records, TrustGraph, reports, and an illustrative trust score. Results are demo data.";
    if (/\b(help|what can you do)\b/.test(text)) return "I can explain dashboard modules, registration, sign-in/up, and this demo’s privacy limits. Try asking about a feature.";
    return "I don’t have a matching local answer for that. Try asking about registration, sign-in, privacy, media, threats, or the dashboard.";
  }

  function setOpen(open) {
    panel.hidden = !open;
    fab.setAttribute("aria-expanded", String(open));
    fab.setAttribute("aria-label", open ? "Close TrustLens assistant" : "Open TrustLens assistant");
    if (open) input.focus();
    else fab.focus();
  }

  appendMessage("bot", "Hello! I can help you navigate TrustLens. I’m an automated demo assistant; replies are generated locally.");
  fab.addEventListener("click", () => setOpen(panel.hidden));
  closeButton.addEventListener("click", () => setOpen(false));
  form.addEventListener("submit", event => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    appendMessage("user", message);
    input.value = "";
    appendMessage("bot", replyFor(message));
    input.focus();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !panel.hidden) setOpen(false);
  });
})();
