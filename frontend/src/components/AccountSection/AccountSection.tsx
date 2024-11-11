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
    Spinner,
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
import { IUser, User } from "@/src/interface";
import { Controller, useForm } from "react-hook-form";
import { convertBirthdayToString } from "@/src/utils";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { useRef } from "react";
import Cookies from "js-cookie";
import apiConfig from "@/src/config/api";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { fetchUserProfile } from '@/src/config/token';
interface Province {
    id: string;
    full_name: string;
}

interface District {
    id: string;
    full_name: string;
}

interface Ward {
    id: string;
    full_name: string;
}


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
    const [userId, setUserId] = useState<string | null>(null); 
    const [isVisible, setIsVisible] = React.useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    //   const [user, setUser] = useState<IUser>();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [user, setUser] = useState<User | null>(null); 
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedWard, setSelectedWard] = useState<string>('');


// ... existing code ...
const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const newImage = event.target.files[0];
        setSelectedImage(newImage);
        // console.log(newImage); // Log the new image directly
    }
};
// ... existing code ...

useEffect(() => {
    const getUserId = async () => {
        try {
            const userProfile = await fetchUserProfile(); // Fetch user profile using token
            setUserId(userProfile.id); // Set user ID from the fetched profile
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    getUserId(); // Call the function to get user ID
}, []);

useEffect(() => {
    // Fetch provinces
    axios.get('https://esgoo.net/api-tinhthanh/1/0.htm')
        .then(response => {
            if (response.data.error === 0) {
                setProvinces(response.data.data);

            }
        })
        .catch(error => console.error('Error fetching provinces:', error));
}, []);

useEffect(() => {
    if (selectedProvince) {
        // Fetch districts when province changes
        axios.get(`https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`)
            .then(response => {
                if (response.data.error === 0) {
                    setDistricts(response.data.data);
                    console.log(response.data.data);

                    setWards([]); // Clear wards when district changes
                    setSelectedDistrict(''); // Reset selected district
                }
            })
            .catch(error => console.error('Error fetching districts:', error));
    }
}, [selectedProvince]);

useEffect(() => {
    if (selectedDistrict) {
        // Fetch wards when district changes
        axios.get(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`)
            .then(response => {
                if (response.data.error === 0) {
                    setWards(response.data.data);
                }
            })
            .catch(error => console.error('Error fetching wards:', error));
    }
}, [selectedDistrict]);


const fetchUser = async () => {
            try {
                const response = await axios.get(`${apiConfig.user.getUserById}${userId}`, { withCredentials: true });
                console.log('Fetched user data:', response.data);
                if (response.data) {
                    setUser(response.data);
                    setImageUrl(response.data.image); // Set the image URL from the response
                    // Set selected province, district, and ward based on user data
                    setSelectedProvince(response.data.province);
                    setSelectedDistrict(response.data.district);
                    setSelectedWard(response.data.ward);
                } else {
                    console.warn('No user data found in response');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        useEffect(() => {
        fetchUser();
    }, [userId]);
        console.log(user);

        const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const values = {
                name: user?.name,
                email: user?.email,
                phone: user?.phone,
                address: user?.address,
                password: user?.password,
                role_id: user?.role_id,
                status: user?.status,
                image: selectedImage, // Include the selected image in the update
                province: selectedProvince,
                district: selectedDistrict,
                ward: selectedWard,
            };
            console.log(values);
            // Add logic to handle the image upload and user update here

            try {
                setLoading(true);
                const response = await axios.put(`${apiConfig.user.updateUser}${userId}`, values, { withCredentials: true });
                console.log('User updated:', response.data);
                if (response.data) {
                    setUser(response.data);
                    setImageUrl(response.data.image); // Update the image URL from the response
                    setSelectedImage(null); // Clear the selected image after update
                    fetchUser();
                    toast.success("Cập nhật thành công")
                } else {
                    console.warn('No user updated in response');
                    toast.error("Cập nhật thất bại")
                }
            } catch (error) {
                console.error('Error updating user:', error);
                toast.error("Cập nhật thất bại")
            } finally {
                setLoading(false);
            }
        }

// ... existing code ...
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target as HTMLInputElement; // Type assertion
    setUser((prevUser) => ({
        ...(prevUser || {}), // Fallback to an empty object if prevUser is null
        [id]: value,
    } as User | null)); // Cast to User | null
};
// ... existing code ...
    
console.log(user);

    // Create a function to get the full name from the ID
    const getProvinceName = (id: string) => {
        const province = provinces.find(p => p.id === id);
        return province ? province.full_name : '';
    };

    const getDistrictName = (id: string) => {
        const district = districts.find(d => d.id === id);
        return district ? district.full_name : '';
    };

    const getWardName = (id: string) => {
        const ward = wards.find(w => w.id === id);
        return ward ? ward.full_name : '';
    };

    return (
        <AppContainer>
            <div className="flex flex-row text-black dark:text-white sm:text-base text-sm gap-10">
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
                    <form onSubmit={handleSubmit} className="flex gap-5">
                    {/* <div className="w-2/6">
                        <div className="mb-2 font-medium text-xl">Ảnh đại diện</div>
                        <div className="flex flex-col gap-2 justify-center items-center">
                            <div className="w-[120px] h-[120px] rounded-full bg-blue-500 overflow-hidden">
                                {selectedImage ? (
                                    <img src={URL.createObjectURL(selectedImage)} alt="Profile" className="w-full h-full object-cover" />
                                ) : imageUrl ? ( // Render the user's image if available
                                    <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : null}
                            </div>
                            <Button onClick={() => fileInputRef.current?.click()} variant="bordered" className="mt-2">
                                Thay đổi ảnh đại diện
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                    </div> */}
                            <div className="flex-1">
                                <div className="mb-2 font-medium text-xl">Thông tin cá nhân</div>
                                <div className="flex flex-col gap-4 mb-5">
                                    <div className="flex gap-5">
                                        <div className="w-1/2">
                                            <label htmlFor="name" aria-label="">Họ và tên</label>
                                            <Input
                                                type="text"
                                                id="name"
                                                value={user?.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label htmlFor="email" aria-label="">Email</label>
                                            <Input
                                                type="email"
                                                id="email"
                                                value={user?.email}
                                                onChange={handleChange}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-5">
                                        <div className="w-1/2">
                                            <label htmlFor="phone" aria-label="">Số điện thoại</label>
                                            <Input
                                                type="text"
                                                id="phone"
                                                value={user?.phone || ""}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className='grid lg:grid-cols-3 grid-cols-1 gap-4'>
                                    <div>
                                        <div className=''>
                                            Tỉnh/Thành phố (<span className='text-red-600'>*</span>)
                                        </div>
                                        <Select
                                            isRequired
                                            placeholder='Tỉnh/Thành phố'
                                            aria-label="Tỉnh/Thành phố"
                                            size='lg'
                                            variant='bordered'
                                            value={selectedProvince}
                                            onChange={(e) => setSelectedProvince(e.target.value)}
                                        >
                                            {provinces.map((province) => (
                                                <SelectItem key={province.id} value={province.id}>
                                                    {province.full_name}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>

                                    <div>
                                        <div className=''>
                                            Quận/Huyện (<span className='text-red-600'>*</span>)
                                        </div>
                                        <Select
                                            isRequired
                                            placeholder='Quận/Huyện'
                                            aria-label="Quận/Huyện"
                                            size='lg'
                                            variant='bordered'
                                            value={selectedDistrict}
                                            onChange={(e) => setSelectedDistrict(e.target.value)}
                                            isDisabled={!selectedProvince} // Disable if no province is selected
                                        >
                                            {districts.map((district) => (
                                                <SelectItem key={district.id} value={district.id}>
                                                    {district.full_name}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>

                                    <div>
                                        <div className=''>
                                            Phường/Xã (<span className='text-red-600'>*</span>)
                                        </div>
                                        <Select
                                            isRequired
                                            placeholder='Phường/Xã'
                                            aria-label="Phường/Xã"
                                            size='lg'
                                            variant='bordered'
                                            value={selectedWard}
                                            onChange={(e) => setSelectedWard(e.target.value)}
                                            isDisabled={!selectedDistrict} // Disable if no district is selected
                                        >
                                            {wards.map((ward) => (
                                                <SelectItem key={ward.id} value={ward.id}>
                                                    {ward.full_name}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                                    <div>
                                        <label htmlFor="address" aria-label="">Địa chỉ</label>
                                        <Textarea
                                            id="address"
                                            value={user?.address || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {/* <div>
                                        <label htmlFor="password" aria-label="">Mật khẩu</label>
                                        <Input
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
                                            id="password"
                                            value={user?.password}
                                            onChange={handleChange}
                                            className="w-full"
                                        />
                                    </div> */}
                                </div>
                                <div>
                                <Button 
        type="submit" 
        className="w-full text-white bg-main font-bold" 
        // isLoading={loading} // Add loading state to button
    >
        {loading ? <Spinner size="sm" color="default"/> : "Lưu"}
    </Button>
                                </div>
                            </div>
                        </form>

                    </div>

                    <div className="text-2xl">
                        Số điểm hiện có : {user?.point} điểm
                    </div>

                </div>
            </div>
        </AppContainer>
    );
};

export default AccountSection;
