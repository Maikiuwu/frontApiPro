// src/services/authService.js
const API_URL = "http://localhost:8083/api/users";

export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    credentials: "include", // ¡Importante para cookies de sesión!
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Error al iniciar sesión");
  }

  return response.json();
}
