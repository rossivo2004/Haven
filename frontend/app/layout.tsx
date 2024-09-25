import "../src/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Providers } from "./providers";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import BtnToTop from "@/src/components/BtnToTop";
import { StoreProvider } from "@/src/store/StoreProvider";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import Script from 'next/script';  // Thêm import Script từ Next.js
import ChatBox from "@/src/components/ChatBox";

export const metadata: Metadata = {
  title: "Food Haven - Thực Phẩm Cao Cấp, Dịch Vụ Giao Hàng Tận Nhà",
  description: "Một thương hiệu trẻ mang tới trải nghiệm mới.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <html suppressHydrationWarning lang="en">
        <head>
          {/* Google Tag Manager */}
          {/* <Script id="google-tag-manager" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5MQ3DL62');`}
          </Script> */}
          
          {/* Google Analytics */}
          {/* <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KW0JDLWNDG');`}
          </Script> */}
        </head>
        
        <body className="light:bg-white dark:bg-black">
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5MQ3DL62"
              height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
          </noscript>

          <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
            <Header />
            <ToastContainer className="mt-[64px]" />
            <ChatBox />
            <BtnToTop />
            {children}
            <Analytics />
            <SpeedInsights />
            <Footer />
          </Providers>
        </body>
      </html>
    </StoreProvider>
  );
}
