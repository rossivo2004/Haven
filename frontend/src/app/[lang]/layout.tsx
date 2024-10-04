import "../../styles/globals.css";
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

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';


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

export default async function RootLayout({
  children,
  params: { lang }
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {

  // Lấy messages dựa trên ngôn ngữ từ params
  const messages = await getMessages({ locale: lang });

  return (
    <html suppressHydrationWarning lang={lang}>
      <head>
        {/* Head components như Google Analytics/Tag Manager có thể giữ nguyên */}
      </head>

      <body className="bg-white dark:bg-black">
        <StoreProvider>
          <NextIntlClientProvider locale={lang} messages={messages}>
            {/* Google Tag Manager (noscript) */}
            <noscript>
              <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5MQ3DL62"
                height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
            </noscript>

            <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
              <Header params={{ lang }} />
              <ToastContainer className="mt-[64px]" />
              <ChatBox />
              <BtnToTop />
              {children}
              <Analytics />
              <SpeedInsights />
              <Footer />
            </Providers>
          </NextIntlClientProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

