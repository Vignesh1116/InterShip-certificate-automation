import axios from "axios";

export const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
});

console.log("API Base URL:", API.defaults.baseURL);