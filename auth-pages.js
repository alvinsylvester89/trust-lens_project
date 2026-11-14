(() => {
  "use strict";

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    const status = document.getElementById("signupStatus");
    signupForm.addEventListener("input", () => { status.textContent = ""; });
    signupForm.addEventListener("change", () => { status.textContent = ""; });
    signupForm.addEventListener("submit", event => {
      event.preventDefault();
      status.textContent = "The form is valid, but account creation is not connected. No information was sent or saved.";
    });
  }

  const signinForm = document.getElementById("signinForm");
  if (!signinForm) return;

  const email = document.getElementById("signinEmail");
  const password = document.getElementById("signinPassword");
  const toggle = document.getElementById("passwordToggle");
  const error = document.getElementById("signinError");
  const status = document.getElementById("signinStatus");
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  toggle.addEventListener("click", () => {
    const visible = password.type === "password";
    password.type = visible ? "text" : "password";
    toggle.setAttribute("aria-pressed", String(visible));
    toggle.setAttribute("aria-label", visible ? "Hide password" : "Show password");
  });

  signinForm.addEventListener("input", () => {
    error.hidden = true;
    error.textContent = "";
    status.textContent = "";
    email.classList.remove("invalid");
    password.classList.remove("invalid");
    email.setAttribute("aria-invalid", "false");
    password.setAttribute("aria-invalid", "false");
  });

  signinForm.addEventListener("submit", event => {
    event.preventDefault();
    const validEmail = emailPattern.test(email.value);
    const validPassword = password.value.length >= 8;
    email.classList.toggle("invalid", !validEmail);
    password.classList.toggle("invalid", !validPassword);
    email.setAttribute("aria-invalid", String(!validEmail));
    password.setAttribute("aria-invalid", String(!validPassword));
    status.textContent = "";

    if (!validEmail || !validPassword) {
      error.textContent = "Check your credentials: enter a valid email address and a password with at least 8 characters.";
      error.hidden = false;
      (validEmail ? password : email).focus();
      return;
    }

    error.hidden = true;
    status.textContent = "Credential format is valid, but authentication is not connected. No information was sent or saved.";
  });
})();
