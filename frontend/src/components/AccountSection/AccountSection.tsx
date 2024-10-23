"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import AppContainer from "../AppContainer/AppContainer";
import {
  Avatar,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Button,
  Divider,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import GoogleIcon from "@mui/icons-material/Google";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import KeyIcon from '@mui/icons-material/Key';
import FacebookIcon from '@mui/icons-material/Facebook';
import { COUNTRY, GENDER, USER } from '@/src/dump';
import { parseDate } from "@internationalized/date";
import { Field, Form, Formik } from "formik";
import { validationSchema } from "@/src/utils";
import { IUser } from "@/src/interface";
import { Controller, useForm } from "react-hook-form";
import { convertBirthdayToString } from "@/src/utils";

const Security = () => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  return (
    <div className="flex flex-col gap-3">
      <div className="text-base font-bold">Bảo mật</div>
      <div className="grid grid-cols-[auto_1fr] items-center gap-y-2 gap-x-6">
        <div className="flex flex-row gap-4 items-center">
          <KeyIcon />
          <div className="font-bold text-nowrap">Đổi mật khẩu</div>
        </div>
        <Button
          variant="bordered"
          size="sm"
          className="w-[110px] justify-self-end  border-black font-bold"
          onClick={onOpen}
        >
          Cập nhật
        </Button>

        <Formik
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log("values", values);
          }}
        >
          {({ errors, touched, handleChange }) => (
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                <ModalHeader>Đổi mật khẩu</ModalHeader>
                <ModalBody>
                  <Field
                    name="password"
                    as={Input}
                    fullWidth
                    label="Nhập mật khẩu mới"
                    aria-label="reset-password"
                    onChange={handleChange}
                    variant="bordered"
                    size="sm"
                    className="hidden sm:block"
                    isInvalid={
                      errors.password && touched.password ? true : false
                    }
                    errorMessage={
                      errors.password && touched.password ? errors.password : ""
                    }
                  />
                  <Field
                    name="confirmPassword"
                    as={Input}
                    fullWidth
                    label="Nhập lại mật khẩu"
                    aria-label="comfirm-password"
                    onChange={handleChange}
                    variant="bordered"
                    size="sm"
                    className="hidden sm:block"
                    isInvalid={
                      errors.confirmPassword && touched.confirmPassword
                        ? true
                        : false
                    }
                    errorMessage={
                      errors.confirmPassword && touched.confirmPassword
                        ? errors.confirmPassword
                        : ""
                    }
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Hủy
                  </Button>
                  <Button type="submit" color="primary" onPress={onClose}>
                    Chỉnh sửa
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
        </Formik>
      </div>
    </div>
  );
};

const AccountSection = () => {
  const [user, setUser] = useState<IUser>(USER);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName,
      nickname: user?.nickname,
      birthday: parseDate(user?.birthday ?? ""),
      gender: user?.gender,
      country: user?.country ?? "",
      phoneNumber: user?.phoneNumber,
      email: user?.email,
    },
  });

  return (
    <AppContainer>
      <div className="flex flex-row text-black sm:text-base text-sm gap-10">
        <div className="flex flex-col w-full gap-7">
          <div className="flex flex-row items-center w-full relative">
            <div className="absolute top-0 left-0 flex sm:hidden">
            <Link href={'/profile'}>
              <ArrowBackIcon />
              </Link>
            </div>
            <div className="flex flex-1 justify-center sm:justify-start text-lg sm:text-4xl font-medium pb-[1vw] capitalize">
              Thông tin tài khoản
            </div>
          </div>

          <div className="hidden sm:block font-bold px-5">
            Thông tin cá nhân
          </div>

          <form
            onSubmit={handleSubmit((data) => {
              const update = {
                ...data,
                birthday: convertBirthdayToString(data.birthday),
              };
              console.log("update", update);
            })}
          >
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-5  ">
              <div className="flex flex-col gap-7 sm:p-5 lg:border-r lg:border-r-black">
                {/* Avatar */}
                <div className="grid grid-cols-[auto_1fr] text-sm gap-3 items-center ">
                  <div className="row-span-2 mr-3">
                    <Avatar src={user?.avatar} size="lg" alt="avatar" />
                  </div>
                  <div className="grid grid-cols-[auto_1fr] items-center gap-y-2 gap-x-4">
                    <div className="text-nowrap font-bold">Họ tên</div>
                    <Input
                      {...register("fullName", {
                        value: user?.fullName,
                        required: "*Bắt buộc",
                        maxLength: {
                          value: 50,
                          message: "Không quá 50 ký tự!",
                        },
                      })}
                      isInvalid={!!errors.fullName}
                      errorMessage={errors.fullName?.message || ""}
                      variant="bordered"
                      fullWidth
                      size="sm"
                    />
            
                  </div>
                </div>

            

          
                <Button
                  type="submit"
                  color="warning"
                  className="text-white text-sm"
                >
                  Lưu thay đổi
                </Button>
              </div>

              <div className="flex flex-col gap-5 sm:p-5 text-sm">
                {/* Số điện thoại và Email */}
                <div className="flex flex-col gap-3">
                  <div className="text-base font-bold">
                    Số điện thoại và Email
                  </div>
                  <div className="grid grid-cols-[auto_1fr] items-center gap-y-2 gap-x-6">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 items-start sm:items-center ">
                      <div className="hidden sm:block">
                        <LocalPhoneIcon />
                      </div>
                      <div className="font-bold text-nowrap">Số điện thoại</div>
                      <div className="text-sm text-nowrap sm:hidden">
                        {user?.phoneNumber && user?.phoneNumber !== ""
                          ? user?.phoneNumber
                          : "Thêm số điện thoại"}
                      </div>
                    </div>
                    <Input
                      {...register("phoneNumber", {
                        value: user?.phoneNumber,
                        required: "*Số điện thoại là bắt buộc",
                        pattern: {
                          value: /^\+?[0-9\s-]{10,15}$/,
                          message: "*Số điện thoại không hợp lệ",
                        },
                      })}
                      isInvalid={!!errors.phoneNumber}
                      errorMessage={errors.phoneNumber?.message || ""}
                      variant="bordered"
                      fullWidth
                      size="sm"
                      onKeyDown={(e) => {
                        if (!/[0-9]|Backspace|Tab|Enter|Delete|ArrowLeft|ArrowRight/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />

                    <Button
                      variant="bordered"
                      size="sm"
                      className="w-[110px] justify-self-end  border-black font-bold sm:hidden"
                    >
                      Cập nhật
                    </Button>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 items-start sm:items-center">
                      <div className="hidden sm:block">
                        <EmailIcon  />
                      </div>
                      <div className="font-bold text-nowrap">Địa chỉ email</div>
                      <div className="text-sm text-nowrap sm:hidden">
                        {user?.email && user?.email !== ""
                          ? user?.email
                          : "Thêm địa chỉ email"}
                      </div>
                    </div>
                    <Input
                      {...register("email", {
                        value: user?.email,
                        required: "Email là bắt buộc",
                        pattern: {
                          value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, // Mẫu kiểm tra định dạng email
                          message: "Email không hợp lệ",
                        },
                      })}
                      isInvalid={!!errors.email}
                      errorMessage={errors.email?.message || ""}
                      fullWidth
                      size="sm"
                      variant="bordered"
                      className="hidden sm:block"
                    />

                    <Button
                      variant="bordered"
                      size="sm"
                      className="w-[110px] justify-self-end  border-black font-bold sm:hidden"
                    >
                      Cập nhật
                    </Button>
                  </div>
                </div>

                {/* Bảo mật */}
                <Security />

                {/* Liên kết mạng xã hội */}
                {/* <div className="flex flex-col gap-3">
                  <div className="text-base font-bold">
                    Liên kết mạng xã hội
                  </div>
                  <div className="grid grid-cols-[auto_1fr] items-center gap-y-2 gap-x-6">
                    <div className="flex flex-row gap-4 items-center">
                      <FacebookIcon />
                      <div className="font-bold text-nowrap">Facebook</div>
                    </div>
                    <Button
                      variant="bordered"
                      size="sm"
                      className="w-[110px] justify-self-end  border-black font-bold"
                    >
                      Liên kết
                    </Button>
                  </div>
                </div> */}

                <Divider />

                {/* Đã liên kết */}
                <div className="flex flex-col gap-3">
                  <div>Đã liên kết</div>
                  <div className="grid grid-cols-[auto_1fr] items-center gap-y-2 gap-x-6">
                    <div className="flex flex-row gap-4 items-center">
                      <GoogleIcon
                        fontSize="small"
                        style={{ color: "dodgerblue" }}
                      />
                      <div className="font-bold text-nowrap">Google</div>
                    </div>
                    <Button
                      variant="bordered"
                      size="sm"
                      className="w-[110px] justify-self-end border-black font-bold"
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 flex flex-col gap-7 sm:p-5 w-full">
                <div className="text-lg sm:text-xl font-bold capitalize">
                  Tổng quan thứ bậc
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="font-bold">Hạng thành viên</div>
                  <div className="sm:text-left text-right">Gold</div>
                  <div className="font-bold">Số điểm hiện tại</div>
                  <div className="sm:text-left text-right">520 Điểm</div>
                  <div className="font-bold">
                    Số điểm cần tích lũy thêm để tăng hạng
                  </div>
                  <div className="sm:text-left text-right">
                    480 điểm nữa để thăng hạng
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AppContainer>
  );
};

export default AccountSection;
