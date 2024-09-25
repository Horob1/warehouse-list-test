import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_MDM,
});

instance.interceptors.request.use(
  function (config) {
    config.headers.Authorization =
      "Bearer " +
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImtpZXVodiIsImlkIjoiMTAiLCJlbnYiOiJEZXZlbG9wbWVudCIsIkVtcGlkIjoiMjI4NCIsIlBob25lIjoiIiwiRnVsbG5hbWUiOiJIb8OgbmcgVsSDbiBLaeG7gXUiLCJJcEFkZHJlc3MiOiIxMTguNzAuMzQuNTMiLCJleHAiOjE3Mjc4NjM4MTgsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0In0.Rq3YTfsnC63m7o6mmRNYDL4v9-kOAQLYW_W7lWfhnHo";
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default instance;
