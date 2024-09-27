import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "X-Requested-With": "XMLHttpRequest"
    },
    withCredentials: true
});

export default instance;
