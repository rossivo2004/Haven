'use client'

// Haven/frontend/src/components/BodyForgotPassword/BodyForgotPassword.tsx
import { Input, Spinner } from "@nextui-org/react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setUser, setOtpCode } from "../../store/userSlice"; // Import actions
import axios from "axios"; // Import axios for API calls
import apiConfig from "@/src/config/api";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";

function BodyForgotPassword() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(600);
  const [code, setCode] = useState<string[]>(new Array(5).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false); // Thêm trạng thái mới

  useEffect(() => {
    if (otpSent && countdown > 0) { // Only start countdown if OTP has been sent
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, otpSent]);

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

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call API to send OTP to the email
      await axios.post(apiConfig.user.sendResetPasswordCode, { email });
      dispatch(setUser({ email, name: '', password: '' })); // Provide default values for name and password
      toast.success('Gửi mã xác thực thành công.');
      setOtpSent(true); // Set OTP sent state to true
      setCountdown(600); // Start countdown after sending OTP
      setShowOtpForm(true); // Hiển thị form nhập OTP
    } catch (error) {
      console.error(error);
      toast.error('Lỗi gửi mã xác thực, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpCode = code.join('');
    setLoading(true);
    try {
      // Call API to verify the OTP code
      await axios.post(apiConfig.user.verifyResetPasswordCode, { email, code: otpCode });
      dispatch(setOtpCode(otpCode)); // Save OTP code in Redux
      toast.success('Xác thực mã thành công.');
      router.push('/vi/resetpassword');
    } catch (error) {
      console.error(error);
      alert('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => { // New function to resend the code
    setLoading(true);
    try {
      await axios.post(apiConfig.user.sendResetPasswordCode, { email });
      toast.success('Mã xác thực đã được gửi lại.');
      setCountdown(600); // Reset countdown to 10 minutes
    } catch (error) {
      console.error(error);
      toast.error('Lỗi gửi mã xác thực, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-20 max-w-screen-xl mx-auto px-4 h-auto">
      <div className="flex lg:flex-row flex-col lg:h-[680px] gap-10">
        <div className="lg:w-1/2 w-full">
          <img
            src={"/images/si-2.png"}
            alt="Forgot Password"
            className="h-auto w-auto object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-4xl font-medium mb-5">Quên mật khẩu</div>
          <div className="text-base font-normal mb-6">
            Vui lòng nhập thông tin bên dưới!
          </div>
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-8">
              <Input
                required
                type="text"
                className="border-b border-black py-2 text-base font-normal focus:outline-none w-full"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                endContent={
                  loading ? <Spinner /> : <button type="submit" className="text-main font-bold px-4 py-2 rounded-md">Gửi</button>
                }
              />
            </div>
          </form>
          {showOtpForm && ( // Hiển thị form nhập OTP nếu showOtpForm là true
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col items-center">
                <div className="mb-6">
                  Nhập mã xác thực OTP gửi đến <span className="font-bold">{email}</span>
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
                          className="w-12 h-14 text-center text-lg border border-gray-300 rounded-md bg-gray-100 shadow-dark-200 inset-6 font-medium"
                        />
                      ))}
                    </div>
                    <div className="text-gray-500 text-center mb-4">
                      {countdown > 0
                        ? `${Math.floor(countdown / 60).toString().padStart(2, '0')}:${(countdown % 60).toString().padStart(2, '0')} giây`
                        : "Hết thời gian"}
                    </div>
                  </div>
                </div>
                {otpSent && ( // Only show resend option if OTP has been sent
                  <div className="mb-6 flex gap-2">
                    Nếu không nhận được mã?
                    <div onClick={handleResendCode} className="text-main font-bold">Gửi lại</div>
                  </div>
                )}
                {loading ? <Spinner /> : <button
                  type="submit"
                  className="w-full bg-main text-white py-4 rounded mb-4"
                >
                  Xác thực
                </button>}
                <div>
                  <Link href={"/signin"}>
                    Trở về
                  </Link>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default BodyForgotPassword;