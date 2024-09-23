'use client'
import React from 'react';
import '../../styles/globals.css'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import MailIcon from '@mui/icons-material/Mail';
import BreadcrumbNav from '../Breadcrum';

function BodyContact() {
  return (
    <div className="flex flex-col max-w-screen-xl px-4 mx-auto">
      <div className="py-5 h-[62px]">
        <BreadcrumbNav
          items={[
            { name: 'Trang chủ', link: '/' },
            { name: 'Liên hệ', link: '#' },
          ]}
        />
      </div>
      <div className="w-full  flex flex-col lg:flex-row justify-between">
        {/* bên trái */}
        <div className="w-full lg:w-2/3 pr-0 lg:pr-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Liên hệ</h2>
          <p className="text-gray-600 mb-8">Để lại tin nhắn cho chúng tôi</p>
          <form className="pb-8 mb-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-bold mb-2" htmlFor="fullname">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  className="appearance-none border border-gray-300 rounded-md w-full py-2 px-4 bg-gray-50  text-clip font-light placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  id="fullname"
                  type="text"
                  placeholder="Vui lòng nhập"
                />

              </div>
              <div>
                <label className="block text-sm font-bold mb-2" htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  className="appearance-none border border-gray-300 rounded-md w-full py-2 px-4 bg-gray-50  text-clip font-light placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  id="email"
                  type="email"
                  placeholder="Vui lòng nhập"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-bold mb-2" htmlFor="phone">
                  Số điện thoại
                </label>
                <input
                  className="appearance-none border border-gray-300 rounded-md w-full py-2 px-4 bg-gray-50  text-clip font-light placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  id="phone"
                  type="tel"
                  placeholder="Vui lòng nhập"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2" htmlFor="message">
                Nội dung <span className="text-red-500">*</span>
              </label>
              <textarea
                className="appearance-none border border-gray-300 rounded-md w-full py-2 px-4 bg-gray-50  text-clip font-light placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                id="message"
                placeholder="Vui lòng nhập"
              ></textarea>
            </div>
            <div className="flex items-center justify-start">
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-lg py-3 px-12 rounded-full focus:outline-none focus:shadow-outline"
                type="button"
              >
                Gửi
              </button>
            </div>
          </form>
        </div>

        {/* bên phải */}
        <div className="w-full lg:w-2/5 h-1/2  bg-gray p-8 shadow-md rounded mb-8 lg:mb-0">
          <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">Công Ty TNHH Phát Triển Việt Quốc Tế</h3>
          <div className="flex items-center">
            <LocationOnIcon className="xl:h-[30px] xl:w-[30px] lg:w-6 lg:h-6 mr-2" />
            <div className="font-semibold">Địa chỉ:</div>
          </div>
          <p className="pl-8 text-gray-700 mb-2 xl:text-sm lg:text-[10px]">
            Tầng 1 - Phòng 102, 11Bis Nguyễn Gia Thiều, Phường Võ Thị Sáu, Quận 3, TPHCM
          </p>
          <div className="flex items-center">
            <LocalPhoneIcon className="xl:h-[30px] xl:w-[30px] lg:w-6 lg:h-6 mr-2" />
            <div className="font-semibold">Hotline:</div>
          </div>
          <p className="pl-8 text-gray-700 mb-2 xl:text-sm lg:text-[10px]">
            0326 482 490
          </p>
          <div className="flex items-center">
            <AccessTimeFilledIcon className="xl:h-[30px] xl:w-[30px] lg:w-6 lg:h-6 mr-2" />
            <div className="font-semibold">Giờ hoạt động:</div>
          </div>
          <p className="pl-8 text-gray-700 mb-2 xl:text-sm lg:text-[10px]">
            8:00 - 17:00
          </p>
          <div className="flex items-center">
            < MailIcon className="xl:h-[30px] xl:w-[30px] lg:w-6 lg:h-6 mr-2" />
            <div className="font-semibold">E-mail:</div>
          </div>
          <p className="pl-8 text-blue-700 mb-2 xl:text-sm lg:text-[10px]">
            info@bviettintergroup.com
          </p>
        </div>
      </div>

      {/* Google Map */}
      <div className="w-full max-w-6xl mt-8 h-80">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4545065405905!2d106.62420897462825!3d10.852993989300469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752bee0b0ef9e5%3A0x5b4da59e47aa97a8!2zQ8O0bmcgVmnDqm4gUGjhuqduIE3hu4FtIFF1YW5nIFRydW5n!5e0!3m2!1svi!2s!4v1725440633288!5m2!1svi!2s"
          width="100%"
          height="100%"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}

export default BodyContact;
