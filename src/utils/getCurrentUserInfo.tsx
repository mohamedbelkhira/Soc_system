// src/utils/getCurrentUserInfo.ts
import { env } from "@/config/environment";
import axios from "axios";

export const getCurrentUserInfo = async (
  userId: string
): Promise<object | null> => {
  try {
    const response = await axios.get(`${env.BACKEND_API_URL}/users/${userId}`);
    if (response.data.status === "success") {
      return response.data.data;
    } else {
      console.error("Unexpected response structure:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch user information:", error);
    return null;
  }
};
