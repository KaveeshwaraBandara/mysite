// const API_URL = "https://bandaragamik-mysite-backend.hf.space";


const API_URL = "http://127.0.0.1:8000";
const TOKEN_KEY = "auth_token";

const authStatus = document.getElementById("auth-status");
const logoutButton = document.getElementById("logout-button");
const authSection = document.getElementById("auth-section");
const postSection = document.getElementById("post-section");

const signupForm = document.getElementById("signup-form");
const signupUsername = document.getElementById("signup-username");
const signupPassword = document.getElementById("signup-password");

const loginForm = document.getElementById("login-form");
const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");

const messageForm = document.getElementById("message-form");
const contentInput = document.getElementById("content");
const messagesList = document.getElementById("messages");


function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}


function renderAuthState() {
  const token = getToken();
  if (token) {
    authStatus.textContent = "Logged in";
    logoutButton.hidden = false;
    authSection.hidden = true;
    postSection.hidden = false;
  } else {
    authStatus.textContent = "Not logged in";
    logoutButton.hidden = true;
    authSection.hidden = false;
    postSection.hidden = true;
  }
}


async function loadMessages() {
  const response = await fetch(`${API_URL}/messages`);
  const messages = await response.json();

  messagesList.innerHTML = "";
  for (const message of messages) {
    const li = document.createElement("li");
    li.textContent = message.content;
    messagesList.appendChild(li);
  }
}


async function handleSignup(event) {
  event.preventDefault();

  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: signupUsername.value,
      password: signupPassword.value,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    alert(`Signup failed: ${error.detail}`);
    return;
  }

  alert("Account created. You can now log in.");
  signupForm.reset();
}


async function handleLogin(event) {
  event.preventDefault();

  const formBody = new URLSearchParams();
  formBody.append("username", loginUsername.value);
  formBody.append("password", loginPassword.value);

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formBody,
  });

  if (!response.ok) {
    const error = await response.json();
    alert(`Login failed: ${error.detail}`);
    return;
  }

  const data = await response.json();
  setToken(data.access_token);
  loginForm.reset();
  renderAuthState();
}


function handleLogout() {
  clearToken();
  renderAuthState();
}


async function handlePost(event) {
  event.preventDefault();

  const response = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ content: contentInput.value }),
  });

  if (response.status === 401) {
    alert("Your session has expired. Please log in again.");
    clearToken();
    renderAuthState();
    return;
  }

  if (!response.ok) {
    alert("Failed to post message");
    return;
  }

  messageForm.reset();
  loadMessages();
}


signupForm.addEventListener("submit", handleSignup);
loginForm.addEventListener("submit", handleLogin);
logoutButton.addEventListener("click", handleLogout);
messageForm.addEventListener("submit", handlePost);

renderAuthState();
loadMessages();