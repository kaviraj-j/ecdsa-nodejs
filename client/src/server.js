import axios from "axios";

const server = axios.create({
  // baseURL: "http://localhost:3042"  -> if in development mode
  baseURL: "https://ecdsa-node-app.onrender.com",
});

export default server;
