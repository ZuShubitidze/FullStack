import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // For cookies/sessions
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response, // If request is successful, just return it
  async (error) => {
    const originalRequest = error.config;

    // !! CRITICAL: If the failed request WAS the refresh route, STOP HERE !!
    if (originalRequest.url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 1. Call the refresh route
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {
            withCredentials: true,
          },
        );

        // 2. Get the new Access Token from the response
        const newAccessToken = res.data.accessToken;

        // Update your state/variable
        setTokenInApi(newAccessToken);

        // 3. Update the 'Authorization' header for the failed request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // 4. Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails (e.g., Refresh Token expired), log user out
        // window.location.href = "/login";
        console.log("Refresh failed, logging out");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

let token: string | null = null;

// Function to update the token from your AuthContext
export const setTokenInApi = (newToken: string | null) => {
  token = newToken;
};

api.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
