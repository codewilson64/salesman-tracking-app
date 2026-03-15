import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.100.152:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});