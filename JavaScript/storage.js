//  RULES:
//   - ONLY this file reads/writes localStorage.
//   - All other files MUST use getData() and saveData().
//   - No DOM manipulation here whatsoever.

const STORAGE_KEY = "socialAppData";

// ----------------------------------------------
// DEFAULT DATA STRUCTURE
// ----------------------------------------------
// This is the basic structure of our app data.
// It will only be used if there is no data saved
// in localStorage yet (first time running the app).
const DEFAULT_DATA = {
  users: [],
  posts: [],
  comments: [],
  session: {
    currentUserId: null,
  },
};
// ----------------------------------------------
// initAppData()
// ----------------------------------------------
// This function runs when the app starts.
// It checks if data already exists in localStorage.
// If not, it creates the default data structure.
function initAppData() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    // Save the default data to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
    console.log("[storage] No data found, created new app data.");
  } else {
    // If data already exists, keep it
    console.log("[storage] Data already exists in localStorage.");
  }
}
// ----------------------------------------------
// getData()
// ----------------------------------------------
// This function gets all the stored data from
// localStorage and converts it back into a
// JavaScript object so the app can use it.
//
// Every file that wants to read or modify data
// should call this function first.
function getData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    // If data somehow disappeared, recreate it
    initAppData();
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }

  // Convert the stored string back into an object
  return JSON.parse(raw);
}

// ----------------------------------------------
// saveData(data)
// ----------------------------------------------
// This function saves the entire data object
// back into localStorage.
//
// After making any changes to the data,
// other files should call this function
// to store the updated data.
function saveData(data) {
  // Check that the passed in data is valid
  if (typeof data !== "object" || data === null) {
    console.error("[storage] saveData() received invalid data:", data);
    return;
  }
  // Convert the object into a string and save it
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ----------------------------------------------
// generateId(prefix)
// ----------------------------------------------
// This function creates a unique ID.
// It combines a prefix, the current timestamp,
// and a random 5-digit number.
//
// prefix usually means:
// u = user
// p = post
// c = comment
//
// Example results:
// u_17000000000012345 <- user
// p_17000000000054321 <- post
// c_17000000000098765 <- comment
function generateId(prefix) {
  const timestamp = Date.now(); // current time in milliseconds
  const random = Math.floor(Math.random() * 90000) + 10000; // random 5-digit number
  return `${prefix}_${timestamp}${random}`;
}

// ----------------------------------------------
// getCurrentUser()
// ----------------------------------------------
// This function returns the user that is currently
// logged in. If nobody is logged in, it returns null.
function getCurrentUser() {
  const data = getData();
  const userId = data.session.currentUserId;

  // If there is no logged-in user
  if (!userId) return null;

  // Find the user in the users list
  const user = data.users.find((u) => u.id === userId);

  // Return the user or null if not found
  return user || null;
}

// ----------------------------------------------
// setCurrentUser(userId)
// ----------------------------------------------
// This function updates which user is currently
// logged in.
//
// If a user ID is passed → user is logged in.
// If null is passed → user is logged out.
function setCurrentUser(userId) {
  const data = getData();

  // Update the session
  data.session.currentUserId = userId || null;

  // Save the updated data
  saveData(data);
  console.log(
    "[storage] Session updated. currentUserId:",
    data.session.currentUserId,
  );
}
