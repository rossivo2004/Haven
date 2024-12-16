'use client'
import BreadcrumbNav from "../Breadcrumb/Breadcrumb";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from "@nextui-org/react";
// import TableUser from "../TableUser";
import CustomPagination from "@/components/Pagination";
import { Pagination } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import { Role, User } from "@/interface";
import { useEffect, useState } from "react";
import apiConfig from "@/configs/api";
import axios from "axios";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik'; // Added Formik imports
import * as Yup from 'yup'; // Added Yup for validation
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';
import Cookies from 'js-cookie'; // Added import for Cookies

function BodyUsers() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<User[]>([]);
    const [role, setRole] = useState<Role[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for add modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const itemsPerPage = 10; // Define how many items to show per page

    const handleEditUser = (user: User) => {
        setSelectedUser(user); // Set the selected user for editing
        setIsEditModalOpen(true); // Open the edit modal
        setIsAddModalOpen(false); // Ensure add modal is closed
    };

    const handleAddUser = () => {
        console.log("Add User button clicked"); // Debugging line
        setSelectedUser(null); // Clear selected user for adding a new user
        setIsAddModalOpen(true); // Open the add modal
        setIsEditModalOpen(false); // Ensure edit modal is closed
    };

    // const handleUpdateUser = async (values: typeof initialValues) => {
    //     const formData = new FormData();
    //     Object.keys(values).forEach(key => {
    //         const value = values[key as keyof typeof initialValues];
    //         if (value !== null) {
    //             formData.append(key, value);
    //         }
    //     });

    //     try {
    //         setIsLoading(true);
    //         const response = await axios.put(`${apiConfig.users.updateUser}${selectedUser?.id}`, formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //                 accept: 'application/json'
    //             },
    //         });
    //         toast.success('Cập nhật user thành công');
    //         fetchUser();
    //         onOpenChange(); // Close the modal
    //         setIsLoading(false);
    //     } catch (error) {
    //         console.error('Error updating user:', error);
    //         toast.error('Cập nhật user thất bại');
    //         setIsLoading(false);
    //     }
    // };

    const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedUser) return; // Ensure selectedUser is not null

        const { id, point, ...updatedData } = selectedUser; // Exclude status from destructuring
        const updatedStatus = selectedUser.status; // Keep status as a string
        const payload = {
            ...updatedData,
            status: updatedStatus, // Set status as a string ('active' or 'banned')
            point: point, // Include point in the request body
        };
        // console.log('Payload being sent:', payload); // Log the payload

        try {
            setIsLoading(true);
            const response = await axios.put(`${apiConfig.users.updateUserAdmin}${id}`, payload, {
                headers: {
                    'Content-Type': 'application/json', // Set content type to JSON
                    accept: 'application/json',
                    'Authorization': `Bearer ${Cookies.get('access_token_admin')}` // Add access token
                },
            });
            toast.success('Cập nhật user thành công');
            fetchUser(); // Refresh the user list
            setIsEditModalOpen(false); // Close the edit modal
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Cập nhật user thất bại');
        } finally {
            setIsLoading(false); // Ensure loading state is reset
        }
    };

    const initialValues = {
        name: '',
        role_id: '',
        phone: '',
        email: '',
        address: '',
        image: null,
        password: '', // Added password field
    };


    const validationSchema = Yup.object({
        name: Yup.string().required('Required'),
        role_id: Yup.string().required('Required'),
        phone: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        address: Yup.string().required('Required'),
        image: Yup.mixed().required('Required'),
        password: Yup.string().required('Required'), // Added password validation
    });

    const deleteUser = async (id: number) => {

        confirmAlert({
            title: 'Xóa user',
            message: 'Bạn có chắc chắn muốn xóa user này?',
            buttons: [
                {
                    label: 'Có',
                    onClick: async () => {
                        try {
                            setIsLoading(true);
                            const response = await axios.delete(`${apiConfig.users.deleteUser}${id}`, {
                                headers: {
                                    'Authorization': `Bearer ${Cookies.get('access_token_admin')}` // Add access token
                                },
                            });
                            toast.success('Xóa user thành công');
                            fetchUser();
                            setIsLoading(false);
                        } catch (error) {
                            toast.error('Xóa user thất bại');
                            setIsLoading(false);
                        }
                    }
                },
                {
                    label: 'Không',
                    onClick: () => { }
                }
            ]
        })
    }


    const fetchUser = async () => {
        const response = await axios.get(apiConfig.users.getAll, {
            headers: {
                'Authorization': `Bearer ${Cookies.get('access_token_admin')}` // Add access token
            }
        }); // Use Axios to make the GET request
        setUser(response.data);
    };
    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchRole = async () => {
            const response = await axios.get(apiConfig.roles.getAll, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('access_token_admin')}` // Add access token
                }
            });
            setRole(response.data);
        };
        fetchRole();
    }, []);


    const totalItems = user.length; // Total number of users
    const indexOfLastItem = currentPage * itemsPerPage; // Index of last item on current page
    const indexOfFirstItem = indexOfLastItem - itemsPerPage; // Index of first item on current page
    const currentItems = user
        .slice(indexOfFirstItem, indexOfLastItem) // Get current items for the page
        .filter(item => item.role_id !== 2); // Filter out users with role_id 2

    const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages

    return (
        <div>
            {isLoading && (
                <div className="fixed z-[9999] inset-0 bg-gray-800 bg-opacity-75 flex gap-3 justify-center items-center w-screen h-screen ">
                    <Spinner size="lg" color="white" />
                    <p className="text-white text-lg">Đang xử lý...</p>
                </div>
            )}
                 <div className="pb-5 h-[62px]">
                    <BreadcrumbNav
                        items={[
                            { name: 'Trang chủ', link: '/' },
                            { name: 'Quản lý người dùng', link: '#' },
                        ]}
                    />
                </div>
            <div className="flex justify-between items-center w-full">
                <div className="w-full">
                    <div className='flex justify-between mb-4 wf'>
                        <div className='font-semibold text-xl'>
                            Quản lý người dùng
                        </div>
                        {/* <Button onPress={handleAddUser} className="bg-[#696bff] text-white font-medium">Thêm user</Button> */}
                    </div>
                    <Modal size="5xl" scrollBehavior="inside" isOpen={isAddModalOpen} onOpenChange={() => setIsAddModalOpen(false)} isDismissable={false} isKeyboardDismissDisabled={true}>
                        <ModalContent>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={async (values: typeof initialValues) => {
                                    // console.log("Form submitted with values:", values); // Check if this logs
                                    const formData = new FormData();
                                    Object.keys(values).forEach(key => {
                                        const value = values[key as keyof typeof initialValues];
                                        if (value !== null) {
                                            formData.append(key, value);
                                        }
                                    });

                                    try {
                                        setIsLoading(true);
                                        const response = await axios.post(apiConfig.users.createUser, formData, {
                                            headers: {
                                                'Content-Type': 'multipart/form-data',
                                                accept: 'application/json',
                                                'Authorization': `Bearer ${Cookies.get('access_token_admin')}`
                                            },
                                        });
                                        toast.success('Thêm user thành công');
                                        onOpenChange();
                                        setIsAddModalOpen(false);
                                    } catch (error) {
                                        console.error('Error submitting form:', error);
                                        toast.error('Thêm user thất bại');
                                    } finally {
                                        setIsLoading(false);
                                    }
                                }}

                            >
                                {({ setFieldValue }) => (

                                    <Form>
                                        <ModalHeader className="flex flex-col gap-1">Thêm mới người dùng</ModalHeader>
                                        <ModalBody>

                                            <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                                <div className="lg:w-1/2 w-full">

                                                    <label htmlFor="name" aria-label="Tên người dùng">Tên người dùng</label>
                                                    <Field name="name" as={Input} placeholder="Tên người dùng" aria-label="Tên người dùng" />

                                                    <ErrorMessage name="name" component="div" className="text-red-500" />

                                                </div>

                                                <div className="flex-1">

                                                    <label htmlFor="role_id" aria-label="Vai trò">Vai trò</label><br />

                                                    <Field name="role_id" as={Select} placeholder="Vai trò" size="md" className="w-full" aria-label="Vai trò">
                                                        {role?.map((item) => (
                                                            <SelectItem key={item.id} value={item.id}>
                                                                {item.name}
                                                            </SelectItem>
                                                        ))}

                                                    </Field>
                                                    <ErrorMessage name="role_id" component="div" className="text-red-500" />
                                                </div>
                                            </div>

                                            <div className="flex gap-5 lg:flex-row flex-col mb-5">
                                                <div className="lg:w-1/2 w-full">
                                                    <label htmlFor="phone" aria-label="Số điện thoại">Số điện thoại</label>
                                                    <Field name="phone" as={Input} placeholder="Số điện thoại" aria-label="Số điện thoại" />
                                                    <ErrorMessage name="phone" component="div" className="text-red-500" />
                                                </div>
                                                <div className="flex-1">

                                                    <label htmlFor="email" aria-label="Email">Email</label>
                                                    <Field name="email" as={Input} placeholder="Email" aria-label="Email" />
                                                    <ErrorMessage name="email" component="div" className="text-red-500" />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="address" aria-label="Địa chỉ">Địa chỉ</label>
                                                <Field name="address" as={Textarea} variant="bordered" placeholder="Enter your description" disableAnimation disableAutosize classNames={{ base: "w-full", input: "resize-y min-h-[40px]", }} aria-label="Địa chỉ" />
                                                <ErrorMessage name="address" component="div" className="text-red-500" />
                                            </div>
                                            {/* <div>
                                                <label htmlFor="image" aria-label="Hình ảnh">Hình ảnh</label>
                                                <Input
                                                    type="file"
                                                    onChange={(event) => {
                                                        const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
                                                        setFieldValue("image", file); // Ensure the file is set correctly
                                                    }}
                                                    aria-label="Hình ảnh"
                                                />
                                                <ErrorMessage name="image" component="div" className="text-red-500" />
                                            </div> */}
                                            <div>
                                                <label htmlFor="password" aria-label="Mật khẩu">Mật khẩu</label>
                                                <Field name="password" as={Input} type="password" placeholder="Mật khẩu" aria-label="Mật khẩu" />
                                                <ErrorMessage name="password" component="div" className="text-red-500" />
                                            </div>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="danger" variant="light" onPress={onOpenChange}>
                                                Đóng
                                            </Button>
                                            <Button color="primary" type="submit">
                                                Thêm
                                            </Button>
                                        </ModalFooter>
                                    </Form>
                                )}
                            </Formik>
                        </ModalContent>
                    </Modal>
                </div>
            </div>

            <div>
                <div className="mb-4">
                    {/* <TableUser /> */}
                    <Table aria-label="Example static collection table">
                        <TableHeader>
                            <TableColumn>Tên khách hàng</TableColumn>
                            <TableColumn>Điểm</TableColumn>
                            <TableColumn>Vai trò</TableColumn>
                            <TableColumn>Trạng thái</TableColumn>
                            <TableColumn>
                                <div className="flex justify-center">
                                Thao tác
                                </div>
                            </TableColumn>
                        </TableHeader>
                        <TableBody>
                            {currentItems?.map((item, ind) => (
                                <TableRow key={ind}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <div>{item.name}</div>
                                            <div className="text-xs text-gray-500">{item.email}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.point}</TableCell>
                                    <TableCell>
                                        <div>
                                            {item.role_id === 1 ? <div className="bg-green-200 w-min flex items-center justify-center px-2 py-[2px] rounded-lg text-green-600 border-2 border-green-600">User</div> : item.role_id === 2 ? <div className="bg-yellow-200 w-min flex items-center justify-center px-2 py-[2px] rounded-lg text-yellow-600 border-2 border-yellow-600">Admin</div> : 'unknown'}
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.status === 'active' ? <div className="bg-green-200  flex items-center justify-center w-[80px] py-[2px] rounded-lg text-green-600 border-2 border-green-600">Active</div> : <div className="bg-red-200  flex items-center justify-center w-[80px] py-[2px] rounded-lg text-red-600 border-2 border-red-600">Banned</div>}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2 justify-center">
                                            <EditIcon className="w-5 h-5 cursor-pointer text-blue-500" onClick={() => handleEditUser(item)} />
                                            {/* <DeleteIcon className="w-5 h-5 cursor-pointer text-red-500" onClick={() => deleteUser(item.id)} /> */}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-between items-center w-full">
                    <div className="mr-4">
                        <span>{`${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, totalItems)} của ${totalItems} người dùng`}</span>
                    </div>
                    <div className="flex justify-center mt-4 gap-2">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <div
                                className={`cursor-pointer w-10 h-10 flex items-center justify-center rounded-md border-2 
                                ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-transparent text-blue-600'}`}
                                key={index + 1}
                                onClick={() => setCurrentPage(index + 1)}
                                style={{
                                    backgroundColor: currentPage === index + 1 ? '#696bff' : 'transparent',
                                    border: '2px solid #696bff',
                                    color: currentPage === index + 1 ? 'white' : '#696bff'
                                }}
                            >
                                {index + 1}
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <div>
                <Modal size="5xl" scrollBehavior="inside" isOpen={isEditModalOpen} onOpenChange={() => setIsEditModalOpen(false)} isDismissable={false} isKeyboardDismissDisabled={true}>
                    <ModalContent>

                        <form onSubmit={handleUpdateUser}>
                            <ModalHeader className="flex flex-col gap-1">Bạn đang chỉnh sửa user {selectedUser?.name}</ModalHeader>
                            <ModalBody>
                                <div>
                                    <label htmlFor="point" aria-label="Điểm tích lũy">Điểm tích lũy</label>
                                    <Input
                                        name="point"
                                        value={String(selectedUser?.point || '')} // Convert point to string
                                        onChange={(e) => {
                                            const newValue = Number(e.target.value); // Convert to number
                                            setSelectedUser((prev) => prev ? { ...prev, point: newValue } : null); // Update the selectedUser state
                                        }}
                                        aria-label="Điểm tích lũy"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="status" aria-label="Trạng thái">Trạng thái</label><br />
                                    <Select
                                        aria-label="Chọn một tùy chọn"
                                        name="status"
                                        selectedKeys={[selectedUser?.status || 'banned']} // Provide a default value
                                        onChange={(event) => {
                                            const newStatus = event.target.value === 'active' ? 'active' : 'banned'; // Extract value from event
                                            setSelectedUser((prev) => prev ? { ...prev, status: newStatus } : null); // Update with string value
                                        }}
                                    >
                                        <SelectItem key={'active'} value={'active'}>
                                            Active
                                        </SelectItem>
                                        <SelectItem key={'banned'} value={'banned'}>
                                            Banned
                                        </SelectItem>
                                    </Select>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={() => setIsEditModalOpen(false)}> {/* Updated this line */}
                                    Đóng
                                </Button>
                                <Button color="primary" type="submit">
                                    Cập nhật
                                </Button>
                            </ModalFooter>
                        </form>
                    </ModalContent>
                </Modal>
            </div>
        </div>
    );
}

export default BodyUsers;