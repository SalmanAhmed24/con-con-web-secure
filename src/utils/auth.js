import axios from "axios";
import useStore from "@/utils/store/store";
import { apiPath } from "@/utils/routes";

// Headers to add to fetch() calls made to this app's own /api routes.
export const authHeader = () => {
  const token = useStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const isBackendRequest = (url = "") =>
  url.startsWith(apiPath.prodPath) || url.startsWith(apiPath.devPath);

const isLoginRequest = (url = "") => /\/api\/users\/login\/?$/.test(url);

let installed = false;

// Attaches the JWT to every axios call to the backend and logs the user out
// when the backend says the session is missing or expired. Safe to call more
// than once; interceptors are only registered the first time.
export const setupAxiosAuth = () => {
  if (installed || typeof window === "undefined") return;
  installed = true;

  axios.interceptors.request.use((config) => {
    const token = useStore.getState().token;
    if (token && isBackendRequest(config.url)) {
      if (config.headers && typeof config.headers.set === "function") {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
      }
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const url = error?.config?.url || "";
      if (
        error?.response?.status === 401 &&
        isBackendRequest(url) &&
        !isLoginRequest(url)
      ) {
        useStore.getState().logout();
        if (!window.location.pathname.startsWith("/login")) {
          window.location.assign("/login?expired=1");
        }
      }
      return Promise.reject(error);
    }
  );
};

setupAxiosAuth();
