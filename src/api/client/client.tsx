import axios from "axios";

//Define NEXT_PUBLIC_BASEURL in .env file
const BASEURL = process.env.NEXT_PUBLIC_BASEURL;

const client = axios.create({
  baseURL: BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// To Pass Token in Header. Uncomment if token stored in localstorage

// client.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default client;
