'use client'
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

function BodyForgotPassword() {
  const [countdown, setCountdown] = useState(30);
  const [code, setCode] = useState<string[]>(new Array(6).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [number, setNumber] = useState("");

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpCode = code.join('');
    alert(`OTP Code Entered: ${otpCode}`);
  }

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
          <div>
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <input
                  type="number"
                  className="border-b border-black py-2 text-base font-normal focus:outline-none w-full"
                  placeholder="01234567890"
                  onChange={(e) => setNumber(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-6">
                  Nhập mã xác thực OTP gửi đến <span className="font-bold">{number}</span>
                </div>
                <div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex gap-2 mb-4">
                      {[...Array(6)].map((_, index) => (
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
                      {countdown > 0 ? `00:${countdown.toString().padStart(2, '0')} giây` : "Hết thời gian"}
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  Nếu không nhận được mã? <Link href={'#'} className="text-main font-bold">Gửi lại</Link>
                </div>
                <button
                  type="submit"
                  className="w-full bg-main text-white py-4 rounded mb-4"
                >
                  Xác thực
                </button>
                <div>
                  <Link href={"/signin"}>
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

export default BodyForgotPassword;
