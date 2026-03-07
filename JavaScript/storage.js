/**
 * RULES:
 *   - ONLY this file reads/writes localStorage.
 *   - All other files MUST use getData() and saveData().
 *   - No DOM manipulation here whatsoever.
 */

const STORAGE_KEY = "socialAppData";

// ----------------------------------------------
// DEFAULT DATA SHAPE
//  Used ONLY when localStorage has no data yet.
// ------------------------------------------------
const DEFAULT_DATA = {
  users: [],
  posts: [],
  comments: [],
  session: {
    currentUserId: null,
  },
};

// ----------------------------------------------------
// initAppData()
// ----------------------------------------------------
// Call once when the app starts.
// If no data exists yet, seeds localStorage with the
// default structure so all other layers always find
// a valid object (never null).
// -----------------------------------------------------
function initAppData() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
    console.log("[storage] Initialized fresh app data.");
  } else {
    console.log("[storage] Existing data found, skipping init.");
  }
}
