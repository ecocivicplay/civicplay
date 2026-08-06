const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

export async function getUserProofs(uid) {
  const response = await fetch(
    `${API_BASE}/api/proofs/user/${uid}`
  );

  if (!response.ok) {
    throw new Error("Failed to load proofs");
  }

  const data = await response.json();

  return data.proofs || [];
}