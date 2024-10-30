"use client"

import Link from "next/link";
import AppContainer from "../AppContainer/AppContainer";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import { NAV_PROFILE }  from '@/src/dump';
import { Avatar, Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import React, { Fragment, useState } from "react";

const ADDRESS = [
    { fullName: "Hà Văn Được", address: "Donec sed erat ut magna suscipit mattis. Aliquam erat volutpat.", phone: "(+84} 000 000 0000", addressDefault: true },
    { fullName: "Hà Văn Được", address: "Donec sed erat ut magna suscipit mattis. Aliquam erat volutpat.", phone: "(+84} 000 000 0000", addressDefault: false },
]

interface AddressProps {
    fullName: string,
    address: string,
    phone: string,
    addressDefault: boolean
}

const AddressSection = () => {
    const [address, setAddress] = useState<AddressProps[]>(ADDRESS)
    const [fullName, setFullName] = useState("")
    const [newAddress, setNewAddress] = useState("")
    const [phone, setPhone] = useState("")
    const [isDefault, setDefault] = useState(false)
    const [indexEdit, setIndexEdit] = useState<number | null>(null)
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onOpenChange: onOpenChangeEdit, onClose: onCloseEdit } = useDisclosure();

    const onConfirm = () => {

        // Chỉ tồn tại một mặc định nên phải xóa mặc định cũ đi
        if (isDefault) {
            const updateAddress = address.map((addr) => ({
                ...addr,
                addressDefault: false
            }))

            setAddress(updateAddress)
        }

        setAddress((prevAddress) => [
            ...prevAddress,
            {
                fullName,
                address: newAddress,
                phone,
                addressDefault: isDefault
            }
        ])


        onCancel()
    }

    const onCancel = () => {
        // Reset state
        setFullName("");
        setNewAddress("");
        setPhone("");
        setDefault(false);

        onClose() // Đóng modal add
        onCloseEdit() // Đóng modal edit
    }

    const onEdit = (index: number) => {
        setIndexEdit(index)
        setFullName(address[index].fullName)
        setNewAddress(address[index].address)
        setPhone(address[index].phone)
        setDefault(address[index].addressDefault)
        onOpenEdit()
    }

    const onConfirmEdit = () => {

        if (indexEdit !== null) {
            const updateAddress = [...address]

            // Nếu chọn default, duyệt qua addressDefault cho false hết
            if (isDefault) {
                updateAddress.forEach((addr) => {
                    addr.addressDefault = false
                })
            }

            // Sau đó update dữ liệu mới vào
            updateAddress[indexEdit] = {
                fullName,
                address: newAddress,
                phone,
                addressDefault: isDefault
            }

            setAddress(updateAddress)

            onCancel()
        }
    }

    return (
        <AppContainer>
            <div className="flex flex-row text-black sm:text-base text-sm gap-10">
                {/* <div className="hidden sm:flex flex-col gap-5 w-[350px]">
                    <div className="grid grid-cols-[auto_1fr]">
                        <div className="row-span-2 mr-3">
                            <Avatar
                                src="/images/8951e533806bc54e0828a60a67c4c731.png"
                                alt="avatar"
                                size="lg"
                            />
                        </div>
                        <div className="text-sm">Tài khoản của</div>
                        <div className="capitalize font-medium">Nguyễn hữu tiến</div>
                    </div>

                    <div className="flex flex-col gap-1">
                        {NAV_PROFILE.map((nav, index) => (
                            <div
                                className={`flex flex-row gap-5 py-3 ${index < NAV_PROFILE.length - 1
                                    ? "border-b border-b-black"
                                    : ""
                                    }`}
                                key={index}
                            >
                                <div>{nav.startContent}</div>
                                <div>{nav.name}</div>
                            </div>
                        ))}
                    </div>
                </div> */}

                <div className="flex flex-col w-full gap-7">
                    <div className="flex flex-row items-center w-full relative">
                        <div className="absolute top-0 left-0 flex sm:hidden">
                        <Link href={'/profile'}>
              <ArrowBackIcon />
              </Link>
                        </div>
                        <div className="flex flex-1 justify-center sm:justify-start text-lg sm:text-4xl font-medium pb-[1vw] capitalize">
                            Sổ địa chỉ
                        </div>
                    </div>

                    {/* Children */}
                    <div className="flex flex-col gap-5 text-sm pb-10">
                        <div onClick={onOpen} className="flex flex-col justify-center items-center gap-2 w-full sm:p-4 p-3 rounded cursor-pointer shadow-[0_0_5px_5px_rgba(0,0,0,0.1)] hover:shadow-[0_0_5px_3px_rgba(0,0,0,0.2)] transition-shadow">
                            <AddCircleOutlineIcon />
                            <div className="font-bold">Thêm địa chỉ</div>
                        </div>

                        {/* Modal add address */}
                        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                            <ModalContent>
                                <ModalHeader>Địa chỉ mới</ModalHeader>
                                <ModalBody>
                                    <Input
                                        autoFocus
                                        value={fullName}
                                        label="Họ tên"
                                        placeholder=""
                                        labelPlacement="outside"
                                        variant="bordered"
                                        onChange={(e: any) => setFullName(e.target.value)}
                                    />
                                    <Input
                                        value={newAddress}
                                        onChange={(e: any) => setNewAddress(e.target.value)}
                                        label="Địa chỉ"
                                        placeholder=""
                                        labelPlacement="outside"
                                        variant="bordered"
                                    />
                                    <Input
                                        value={phone}
                                        onChange={(e: any) => setPhone(e.target.value)}
                                        label="Số điện thoại"
                                        placeholder=""
                                        labelPlacement="outside"
                                        variant="bordered"
                                    />

                                    <Checkbox isSelected={isDefault} onChange={(e: any) => setDefault(e.target.checked)} classNames={{ label: "text-small", }}>
                                        Đặt làm địa chỉ mặc định
                                    </Checkbox>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="flat" onPress={onCancel}>
                                        Hủy
                                    </Button>
                                    <Button color="primary" onPress={onConfirm}>
                                        Thêm
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>

                        {/* Modal edit address */}
                        <Modal isOpen={isOpenEdit} onOpenChange={onOpenChangeEdit}>
                            <ModalContent>
                                <ModalHeader>Chỉnh sửa</ModalHeader>
                                <ModalBody>
                                    <Input
                                        autoFocus
                                        value={fullName}
                                        label="Họ tên"
                                        placeholder=""
                                        labelPlacement="outside"
                                        variant="bordered"
                                        onChange={(e: any) => setFullName(e.target.value)}
                                    />
                                    <Input
                                        value={newAddress}
                                        onChange={(e: any) => setNewAddress(e.target.value)}
                                        label="Địa chỉ"
                                        placeholder=""
                                        labelPlacement="outside"
                                        variant="bordered"
                                    />
                                    <Input
                                        value={phone}
                                        onChange={(e: any) => setPhone(e.target.value)}
                                        label="Số điện thoại"
                                        placeholder=""
                                        labelPlacement="outside"
                                        variant="bordered"
                                    />

                                    <Checkbox isSelected={isDefault} onChange={(e: any) => setDefault(e.target.checked)} classNames={{ label: "text-small", }}>
                                        Đặt làm địa chỉ mặc định
                                    </Checkbox>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="flat" onPress={onCancel}>
                                        Hủy
                                    </Button>
                                    <Button color="primary" onPress={() => onConfirmEdit()}>
                                        Chỉnh sửa
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>

                        {address.map((a, index) => {
                            const { fullName, address, phone, addressDefault } = a

                            return (
                                <div className="flex flex-col gap-4 py-3 px-5 rounded shadow-[0_0_5px_5px_rgba(0,0,0,0.1)] hover:shadow-[0_0_5px_3px_rgba(0,0,0,0.2)] shadow-transition" key={index}>
                                    <div className="flex flex-row justify-between items-center">
                                        <div className="flex flex-row gap-5 items-center">
                                            <div className="font-bold text-lg capitalize">{fullName}</div>
                                            {addressDefault ? <div className="text-warning-500 text-sm">Địa chỉ mặc định</div> : <Fragment />}
                                        </div>
                                        <div onClick={() => onEdit(index)} className="text-sm cursor-pointer hover:underline">Chỉnh sửa</div>
                                    </div>

                                    <div className="grid grid-cols-[auto_1fr] gap-x-[100px] gap-y-4">
                                        <div className="font-bold">Địa chỉ</div>
                                        <div>{address}</div>
                                        <div className="font-bold">Số điện thoại</div>
                                        <div>{phone}</div>
                                    </div>
                                </div>
                            )
                        })}

                    </div>
                </div>
            </div>
        </AppContainer>
    );
};

export default AddressSection;
