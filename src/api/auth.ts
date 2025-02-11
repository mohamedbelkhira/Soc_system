import { env } from "@/config/environment";

export const loginUser = async (username: string, password: string) => {
  const response = await fetch(`${env.BACKEND_API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  return await response.json();
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const response = await fetch(
   `${env.BACKEND_API_URL}/users/refresh-token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const responseData = await response.json();
  console.log("Full response:", responseData);

  // Directly return the token from the response
  return responseData.data.token;
};
