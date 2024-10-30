"use client";




import apiConfig from "@/src/config/api";
import axios from "axios";

import { signIn, signOut, useSession } from "next-auth/react";


import { useRouter } from "next/navigation";


import React, { useEffect, useState } from "react"; // Thêm useState

import { toast } from "react-toastify";


import "react-toastify/dist/ReactToastify.css";

import Cookies from "js-cookie";


const Dashboard = () => {


  const { data: session } = useSession();


  const router = useRouter();


  const [hasNotified, setHasNotified] = useState(false); // Thêm trạng thái

  const [loading, setLoading] = useState(false); // Thêm trạng thái loading


  useEffect(() => {


    const handleSignIn = async () => {
      setLoading(true); // Bắt đầu loading

      try { // Start try block

        if (session && session.user && !hasNotified) { // Kiểm tra trạng thái thông báo


          const response = await axios.post(apiConfig.user.saveGoogleUser, {

            name: session.user.name,

            email: session.user.email,

          });


          setHasNotified(true); // Đánh dấu đã thông báo

          
          window.location.href = '/';

          
          Cookies.set("user_id", response.data.user_id, { expires: 7 });
          console.log(response.data); // Log phản hồi từ API

          
          toast.success("Đăng nhập thành công");

        }

      } catch (error) { // Catch block for error handling
        console.error("Error during sign-in:", error);

        toast.error("Đăng nhập thất bại"); // Notify user of the error

      } finally { // Đảm bảo loading được tắt

        setLoading(false); // Kết thúc loading

      } // End try-catch block

    }


    handleSignIn(); // Gọi hàm handleSignIn


  }, [session, hasNotified]) // Thêm hasNotified vào dependencies



  return (


    <div>

      {loading ? ( // Hiển thị loading nếu đang tải

        <div>Loading...</div>

      ) : session ? (

        <div>


          {/* {JSON.stringify(session)} */}


          <div>Welcome {session.user?.name}</div>


        </div>

      ) : (

        <button onClick={() => signIn("google")}>

          <img src="/images/google-logo.png" alt="" className="w-8 h-8" />

        </button>

        

      )}


    </div>

  )
}

export default Dashboard;
