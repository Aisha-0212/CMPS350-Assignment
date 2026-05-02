
const API_BASE = '/api'

// Get current user's data from the API using the stored ID
async function getCurrentUserData(userId) {
  if (!userId) return null;
  try {
    const res = await fetch(`${API_BASE}/users/${userId}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.error('Failed to fetch current user', e);
  }
  return null;
}

// Register – returns { success, message, user }
async function registerUser(username, email, password) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  const data = await res.json();
  if (!res.ok) return { success: false, message: data.error };
  return { success: true, user: data };
}

// Login – returns { success, message, user }
async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'login', email, password })
  });
  const data = await res.json();
  if (!res.ok) return { success: false, message: data.error };
  return { success: true, user: data };
}


// Logout redirects to login page
function logoutUser() {
  window.location.href = 'login.html';
}

// Check if we have a userId in the URL – used for initial redirect
function isLoggedIn() {
  const params = new URLSearchParams(window.location.search);
  return params.get('userId') !== null;
}
