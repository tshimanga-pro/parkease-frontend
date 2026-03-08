(() => {
  const form = document.getElementById("loginForm");
  const messageEl = document.getElementById("loginMessage");

  function showMessage(text, type = "error") {
    messageEl.textContent = text;
    messageEl.className = "form-message";
    messageEl.classList.add(type === "success" ? "success" : "error");
  }

  function clearMessage() {
    messageEl.textContent = "";
    messageEl.className = "form-message";
  }

  function validate(values) {
    const errors = [];

    if (!values.email) {
      errors.push("Email address is required.");
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(values.email)) {
        errors.push("Please enter a valid email address.");
      }
    }

    if (!values.password) {
      errors.push("Password is required.");
    } else if (values.password.length < 6) {
      errors.push("Password must be at least 6 characters.");
    }

    return errors;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearMessage();

    const values = {
      email: form.email.value.trim(),
      password: form.password.value,
    };

    const errors = validate(values);
    if (errors.length) {
      showMessage(errors.join(" "), "error");
      return;
    }

    // Example: store a simple "logged in" flag in localStorage.
    // In a real app, you'd authenticate against a server.
    localStorage.setItem("parkEaseLoggedIn", "true");

    showMessage("Login successful! Redirecting...", "success");

    setTimeout(() => {
      // Redirect to dashboard after successful login
      window.location.href = "dashBoardPage.html";
    }, 800);
  });
})();
