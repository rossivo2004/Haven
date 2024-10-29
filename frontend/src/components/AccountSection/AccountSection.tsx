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
  Textarea,
} from "@nextui-org/react";
import GoogleIcon from "@mui/icons-material/Google";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import KeyIcon from '@mui/icons-material/Key';
import FacebookIcon from '@mui/icons-material/Facebook';
import { parseDate } from "@internationalized/date";
import { Field, Form, Formik } from "formik";
import { validationSchema } from "@/src/utils";
import { IUser } from "@/src/interface";
import { Controller, useForm } from "react-hook-form";
import { convertBirthdayToString } from "@/src/utils";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import { EyeFilledIcon } from "./EyeFilledIcon";

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
    const [isVisible, setIsVisible] = React.useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
//   const [user, setUser] = useState<IUser>();

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

          {/* <div className="hidden sm:block font-bold px-5">
            Thông tin cá nhân
          </div> */}
    <div>
        <form action="" className="flex gap-5">
            <div className="w-2/6">
                <div className="mb-2">Ảnh đại diện</div>
                <div className="flex flex-col gap-2 justify-center items-center">
                    <div className="w-[120px] h-[120px] rounded-full bg-blue-500"></div>
                    <Input type="file" />
                </div>
            </div>
            <div className="flex-1">
                <div>Thông tin cá nhân</div>
                <div>
                    <div className="flex gap-5">
                        <div className="w-1/2">
                            <label htmlFor="" aria-label="">Họ và tên</label>
                            <Input type="text" value={'asdas á dsa d'}/>
                        </div>
                        <div className="flex-1">
                        <label htmlFor="" aria-label="">Email</label>
                        <Input type="email" value={'asdas á dsa d'} disabled/>
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <div className="w-1/2">
                            <label htmlFor="" aria-label="">Số điện thoại</label>
                            <Input type="text" value={'asdas á dsa d'}/>
                        </div>
                    </div>
                    <div>
                    <label htmlFor="" aria-label="">Địa chỉ</label>
                    <Textarea />
                    </div>
                    <div>
                    <label htmlFor="" aria-label="">Mật khẩu</label>
                    <Input
      label="Password"
      variant="bordered"
      placeholder="Enter your password"
      endContent={
        <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
          {isVisible ? (
            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
      className="max-w-xs"
    />
                    </div>
                </div>
            </div>
        </form>

    </div>

<div>
    Số điểm hiện có : 1000
</div>

        </div>
      </div>
    </AppContainer>
  );
};

export default AccountSection;
