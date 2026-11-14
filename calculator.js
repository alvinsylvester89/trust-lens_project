(() => {
  "use strict";

  const display = document.getElementById("calculatorDisplay");
  const keys = document.getElementById("calculatorKeys");
  if (!display || !keys) return;

  let expression = "";
  let showingResult = false;
  let showingError = false;

  function showExpression() {
    display.textContent = expression || "0";
    display.classList.remove("calculator-error");
    showingError = false;
  }

  function showError(message) {
    display.textContent = message;
    display.classList.add("calculator-error");
    showingError = true;
    showingResult = false;
  }

  function parseExpression(source) {
    let position = 0;

    function parseNumber() {
      const remainder = source.slice(position);
      const match = remainder.match(/^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i);
      if (!match) throw new Error("Invalid expression.");
      position += match[0].length;
      const value = Number(match[0]);
      if (!Number.isFinite(value)) throw new Error("Number is too large.");
      return value;
    }

    function parseFactor() {
      if (source[position] === "-") {
        position += 1;
        return -parseFactor();
      }
      return parseNumber();
    }

    function parseTerm() {
      let value = parseFactor();
      while (source[position] === "*" || source[position] === "/") {
        const operator = source[position++];
        const right = parseFactor();
        if (operator === "/" && right === 0) throw new Error("Cannot divide by zero.");
        value = operator === "*" ? value * right : value / right;
        if (!Number.isFinite(value)) throw new Error("Result is outside the supported range.");
      }
      return value;
    }

    function parseSum() {
      let value = parseTerm();
      while (source[position] === "+" || source[position] === "-") {
        const operator = source[position++];
        const right = parseTerm();
        value = operator === "+" ? value + right : value - right;
        if (!Number.isFinite(value)) throw new Error("Result is outside the supported range.");
      }
      return value;
    }

    const result = parseSum();
    if (position !== source.length) throw new Error("Invalid expression.");
    return Number(result.toPrecision(12));
  }

  function calculate() {
    if (!expression) {
      showError("Enter a calculation.");
      return;
    }
    try {
      expression = String(parseExpression(expression));
      showingResult = true;
      showExpression();
      showingResult = true;
    } catch (error) {
      showError(error.message);
    }
  }

  function press(key) {
    if (key === "clear") {
      expression = "";
      showingResult = false;
      showExpression();
      return;
    }
    if (key === "equals") {
      calculate();
      return;
    }
    if (showingError || (showingResult && /^\d$/.test(key))) {
      expression = "";
      showingResult = false;
    }
    if (expression.length >= 80) {
      showError("Expression is too long.");
      return;
    }
    if (key === ".") {
      const currentNumber = expression.split(/[+\-*/]/).pop();
      if (currentNumber.includes(".")) return;
      if (!currentNumber) expression += "0";
    }
    expression += key;
    showingResult = false;
    showExpression();
  }

  keys.addEventListener("click", event => {
    const button = event.target.closest("[data-key]");
    if (button) press(button.dataset.key);
  });

  document.addEventListener("keydown", event => {
    const target = event.target;
    if (target.closest("input, textarea, select, button, [contenteditable='true']")) return;
    const chatPanel = document.querySelector(".chatbot-panel");
    if (chatPanel && !chatPanel.hidden) return;
    if (/^\d$/.test(event.key) || ["+", "-", "*", "/", "."].includes(event.key)) {
      event.preventDefault();
      press(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
      event.preventDefault();
      press("equals");
    } else if (event.key === "Backspace") {
      event.preventDefault();
      if (showingError) expression = "";
      else expression = expression.slice(0, -1);
      showingResult = false;
      showExpression();
    } else if (event.key === "Escape") {
      event.preventDefault();
      press("clear");
    }
  });
})();
