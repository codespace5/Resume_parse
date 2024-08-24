import axios, { AxiosHeaders } from "axios";
import { ACCESS_TOKEN } from "@/constants";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

API.interceptors.request.use((config: any) => {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      const mHeaders = AxiosHeaders.from({
        Authorization: `Bearer ${token}`,
      });

      if (mHeaders) {
        config.headers = mHeaders;
      }
    }
  } catch (error) {}

  return config;
});

API.interceptors.response.use(
  (response: any) => {
    return response.data;
  },
  async (error: any) => {
    try {
      if (error.response.status == 401) {
        return Promise.reject(error);
      } else {
        return Promise.reject(error);
      }
    } catch (e) {
      console.log(error);
    }
  }
);



const UploadFile = (data: any) => API.post("/api/v1/resume/upload", data);
const ProcessingPDF = (data:any) => API.post("/api/v1/resume/process", data)

export const apis = {
  UploadFile,
  ProcessingPDF,
};
