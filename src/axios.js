import axios from "axios";
const baseURL = process.env.REACT_APP_BASE_URL;
console.log(baseURL);

const makeRequest = axios.create({
  baseURL,
  withCredentials: true,
});

export default makeRequest;
