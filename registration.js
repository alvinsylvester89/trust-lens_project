(() => {
  "use strict";

  const form = document.getElementById("registrationForm");
  const submitButton = document.getElementById("registerButton");
  const status = document.getElementById("registrationStatus");
  const password = document.getElementById("password");
  const fields = [
    { id: "fullName", pattern: /^[a-zA-Z\s]{2,50}$/, message: "Use 2–50 letters and spaces only." },
    { id: "empId", pattern: /^[A-Z0-9]{6,12}$/i, message: "Enter 6–12 letters or numbers." },
    { id: "email", pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Enter a valid email address." },
    { id: "mobile", pattern: /^[6-9]\d{9}$/, message: "Enter 10 digits, starting with 6, 7, 8, or 9." },
    { id: "dept", message: "Select a division." },
    { id: "password", pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, message: "Use 8+ characters with uppercase, lowercase, a number, and a symbol (@$!%*?&)." },
    { id: "confirmPassword", message: "Passwords do not match." }
  ].map(field => ({ ...field, input: document.getElementById(field.id), error: document.getElementById(`${field.id}Error`), touched: false }));

  function isValid(field) {
    const value = field.input.value;
    if (field.id === "dept") return value !== "";
    if (field.id === "confirmPassword") return value !== "" && value === password.value;
    return field.pattern.test(value);
  }

  function validate(field, showError) {
    const valid = isValid(field);
    field.input.classList.toggle("valid", valid);
    field.input.classList.toggle("invalid", !valid && showError);
    field.input.setAttribute("aria-invalid", String(!valid && showError));
    field.error.textContent = !valid && showError ? field.message : "";
    field.error.hidden = valid || !showError;
    return valid;
  }

  function updateSubmitState() {
    submitButton.disabled = !fields.every(field => isValid(field));
  }

  fields.forEach(field => {
    field.input.addEventListener("blur", () => {
      field.touched = true;
      validate(field, true);
      updateSubmitState();
    });
    field.input.addEventListener(field.id === "dept" ? "change" : "input", () => {
      validate(field, field.touched);
      if (field.id === "password") {
        const confirmation = fields.find(item => item.id === "confirmPassword");
        validate(confirmation, confirmation.touched);
      }
      updateSubmitState();
      status.textContent = "";
    });
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    let firstInvalid;
    fields.forEach(field => {
      field.touched = true;
      if (!validate(field, true) && !firstInvalid) firstInvalid = field.input;
    });
    updateSubmitState();
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }
    status.textContent = "All fields passed validation. No information was sent or saved.";
  });

  updateSubmitState();
})();
