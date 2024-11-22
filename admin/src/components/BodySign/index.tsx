'use client'

import { useEffect, useState } from 'react'; // Ensure this import is present
import axios from 'axios'; // Add this import
import apiConfig from '@/configs/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie'; // Import js-cookie for cookie management
import { fetchUserProfile } from '@/configs/token';
import { Spinner } from '@nextui-org/react';

function BodySign() {
    const [email, setEmail] = useState(''); // State for email
    const [password, setPassword] = useState(''); // State for password
    const [loading, setLoading] = useState(false); // State for loading

    const checkAdminAccess = async () => { // Function to check admin access
        const token = Cookies.get('access_token_admin'); // Get access token from cookies
        if (token) {
            try {
                const userProfile = await fetchUserProfile(); // Fetch user profile
                if (userProfile.role_id === 2) { // Check if role is admin
                    window.location.href = '/admin';
                } else {
                    throw new Error('Bạn không có quyền truy cập!'); // Throw error if not admin
                }
            } catch (error) {
                console.error(error); // Log error
            }
        }
    };

    // Call checkAdminAccess on component mount
    useEffect(() => {
        checkAdminAccess(); // Check admin access when component mounts
    }, []);

    const handleSubmit = async (e: React.FormEvent) => { // Handle form submission
        e.preventDefault();
        setLoading(true); // Set loading to true
        try {
            const response = await axios.post(apiConfig.users.loginToken, { // Use axios to make the POST request
                email,
                password,
            });


            Cookies.set('access_token_admin', response.data.access_token, { expires: 1 }); // Set access_token in cookie for 7 days
            Cookies.set('refresh_token_admin', response.data.refresh_token, { expires: 1 });

            const userProfile = await fetchUserProfile();


            if (userProfile.role_id === 2) { // Check if role is 2
                toast.success('Đăng nhập thành công!'); // Show success message
                // window.location.href = '/admin';
                console.log(response.data);
            } else {
                Cookies.remove('access_token_admin'); // Remove access_token from cookie if role is not 2
                Cookies.remove('refresh_token_admin'); // Remove refresh_token from cookie if role is not 2
                throw new Error('Bạn không có quyền truy cập!'); // Throw error if role is not 2
            }

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Đăng nhập thất bại! Vui lòng thử lại.'; // Get error message from response
            toast.error(errorMessage); // Show error message
        } finally {
            setLoading(false); // Set loading to false
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <section className="">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        {/* <img className="w-auto h-8 mr-2" src="/image/foodhaven.png" alt="logo" /> */}
                    </div>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Login Admin Haven
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}> {/* Update form to use handleSubmit */}
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                    <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                </div>
                            
                                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                    {loading ? <Spinner size="sm" /> : 'Sign in'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default BodySign;
