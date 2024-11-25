'use client'
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import apiConfig from "@/src/config/api";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from '@/src/store/userSlice';
import { Spinner } from "@nextui-org/react";

function VerifyRegister() {
  const [countdown, setCountdown] = useState(30);
  const [code, setCode] = useState<string[]>(new Array(5).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const dispatch = useDispatch(); 
  const userCookie = Cookies.get('userDataCode');
  const userData = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;
  const [loading, setLoading] = useState(false);

useEffect(() => {
  const cookieExpiration = Cookies.get('cookieExpiration'); // Assuming you store expiration time in a cookie

  if (cookieExpiration) {
    const expirationTime = parseInt(cookieExpiration, 10);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const remainingTime = expirationTime - currentTime;

    setCountdown(remainingTime > 0 ? remainingTime : 0); // Set countdown from cookie expiration
  }

  if (countdown > 0) {
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }
}, [countdown]);
// ... existing code ...

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < inputs.current.length - 1) {
        inputs.current[index + 1]?.focus();
      } else if (!value && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpCode = code.join('');


    
    // Prepare the data to send
    const data = {
      name: userData.name  , // Use name from cookie
      email: userData.email , 
      password: userData.password, // Use password from cookie
      code: otpCode,
    };

    setLoading(true);
    try {
      const response = await axios.post(apiConfig.user.register_verifycode, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        dispatch(clearUser());
        toast.success('Xác thực thành công!');
        router.push('/signin');
      } else {
        toast.error('Xác thực thất bại!');
      }
    } catch (error) {
     toast.error('Có lỗi xảy ra! Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  const handleResendCode = async () => {
    // Logic to resend the OTP code
    try {
      const response = await axios.post(apiConfig.user.sendResetPasswordCode, { email: userData.email });
      if (response.status === 200) {
        toast.success('Mã xác thực đã được gửi lại!');
      } else {
        toast.error('Không thể gửi mã xác thực!');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi mã xác thực!');
    }
  };

  return (
    <div className="my-20 max-w-screen-xl mx-auto px-4 h-auto dark:text-white">
      <div className="flex lg:flex-row flex-col lg:h-[680px] gap-10">
        <div className="lg:w-1/2 w-full">
          <img
            src={"/images/si-2.png"}
            alt="Forgot Password"
            className="h-auto w-auto object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-4xl font-medium mb-5">Xác nhận OTP</div>
       
          <div>
            <form onSubmit={handleSubmit}>
              
              <div className="flex flex-col items-center">
                <div className="mb-6">
                  Nhập mã xác thực OTP gửi đến 
                  <span className="font-bold pl-1">
                    {userData && userData.email ? userData.email : 'Loading...'}
                  </span>
                </div>
                <div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex gap-2 mb-4">
                      {[...Array(5)].map((_, index) => (
                        <input
                          required
                          type="text"
                          value={code[index]}
                          onChange={(e) => handleInput(e, index)}
                          key={index}
                          ref={(el) => { inputs.current[index] = el }}
                          maxLength={1}
                          className="w-12 h-14 text-center text-lg border border-gray-300 rounded-md bg-gray-100 shadow-dark-200 inset-6 font-medium dark:text-black"
                        />
                      ))}
                    </div>
                    <div className="text-gray-500 text-center mb-4">
                    {countdown > 0 
                        ? `00:${Math.floor(countdown / 60).toString().padStart(2, '0')}:${(countdown % 60).toString().padStart(2, '0')} giây` 
                        : "Hết thời gian"}
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  Nếu không nhận được mã? <div onClick={handleResendCode} className="text-main font-bold text-center">Gửi lại</div>
                </div>
                <button
                  type="submit"
                  className={`w-full bg-main text-white py-4 rounded mb-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading} // Disable button when loading
                >
                  {loading ? <Spinner size="sm"/> : 'Xác thực'}
                </button>
                <div>
                  <Link href={"/signup"}>
                    Trở về
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyRegister;
