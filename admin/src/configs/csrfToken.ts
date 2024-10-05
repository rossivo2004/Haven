import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const useCsrfToken = () => {
    const [csrfToken, setCsrfToken] = useState<string | null>(null);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchCsrfToken = async () => {
            const response = await axios.get(`${baseUrl}/csrf-token`);
            const token = response.data.csrf_token;
            setCsrfToken(token);
            // Cookies.set('csrf_token', token); // Lưu token vào cookie
        };
        fetchCsrfToken();
    }, []);

    return csrfToken;
};

export default useCsrfToken;
