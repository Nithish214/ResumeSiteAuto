import axios from "axios";

// Base URL comes from the client's .env file (VITE_API_URL). Falling back
// to localhost keeps things working out of the box in local development.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/** Builds an Authorization header for admin-only requests. */
const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

/**
 * Submits the recruiter contact form.
 * @param {object} formData - matches the Mongoose Contact schema fields
 * @returns {Promise<object>} the created contact record from the API
 */
export const submitContact = async (formData) => {
  const response = await api.post("/contacts", formData);
  return response.data;
};

/**
 * Fetches recruiter contact submissions - used by the admin dashboard.
 * @param {string} token - the admin's JWT (see context/AuthContext.jsx)
 * @param {string} [search] - optional text to filter by name/company/email/role
 * @param {string} [site] - optional exact-match filter, e.g. "sre" or "java"
 */
export const fetchContacts = async (token, search = "", site = "") => {
  const params = {};
  if (search) params.search = search;
  if (site) params.site = site;

  const response = await api.get("/contacts", {
    ...authHeader(token),
    params,
  });
  return response.data;
};

/**
 * Deletes a single recruiter contact submission by its Mongo _id -
 * used by the admin dashboard's delete button.
 * @param {string} id - the contact's MongoDB _id
 * @param {string} token - the admin's JWT
 */
export const deleteContact = async (id, token) => {
  const response = await api.delete(`/contacts/${id}`, authHeader(token));
  return response.data;
};

/**
 * Logs in as admin. On success, returns { success, token } - the token
 * gets stored via AuthContext.login().
 * @param {string} username
 * @param {string} password
 */
export const loginAdmin = async (username, password) => {
  const response = await api.post("/auth/login", { username, password });
  return response.data;
};

export default api;
