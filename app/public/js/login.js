document.querySelector("form").addEventListener("submit", function (e) {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorContainer = document.getElementById("error-container");

  errorContainer.innerHTML = ""; // Clear previous errors

  if (!email.includes("@")) {
    e.preventDefault();
    errorContainer.innerHTML = "<p>Please enter a valid email address.</p>";
  }

  if (password.length < 6) {
    e.preventDefault();
    errorContainer.innerHTML += "<p>Password must be at least 6 characters long.</p>";
  }
});
