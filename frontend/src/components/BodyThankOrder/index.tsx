'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function BodyThankOrder() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(10); // Bộ đếm bắt đầu từ 10 giây

  useEffect(() => {
    const countdown = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000); // Cập nhật mỗi giây

    const timer = setTimeout(() => {
      router.push("/");
    }, 10000); // Tự động chuyển hướng sau 10 giây

    return () => {
      clearInterval(countdown); // Dọn dẹp bộ đếm
      clearTimeout(timer); // Dọn dẹp bộ hẹn giờ
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center mt-28">
      <div className="text-3xl font-medium">Cảm ơn vì bạn đã đặt hàng</div>
      <div className="text-lg mb-2">
        Đơn hàng của bạn{" "}
        <Link href="/" className="font-medium text-blue-500 underline">
          1432040234
        </Link>
      </div>
      <div className="mb-2">
        <img src="/images/tonton-tonton-sticker.gif" alt="Order confirmation gif" />
      </div>
      <div>
        (Tự động quay về trang chủ sau <span className="font-bold">{seconds}</span> giây)
      </div>
    </div>
  );
}

export default BodyThankOrder;
