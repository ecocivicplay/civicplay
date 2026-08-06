const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function checkUsername(username) {
  const response = await fetch(`${API_BASE}/api/users/check-username`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to check username");
  }

  return data;
}

export async function sendEmailOTP(email) {
  const response = await fetch(`${API_BASE}/api/users/send-email-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send OTP");
  }

  return data;
}

export async function verifyEmailOTP(email, otp) {
  const response = await fetch(`${API_BASE}/api/users/verify-email-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to verify OTP");
  }

  return data;
}