'use client'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import BreadcrumbNav from "../Breadcrumb/Breadcrumb";


function BodyOrderDetail() {
    return (
        <div>
            <div className="flex justify-between items-center">
                <div className="py-5 h-[62px]">
                    <BreadcrumbNav
                        items={[
                            { name: 'Trang chủ', link: '/' },
                            { name: 'Đơn hàng', link: '/orders' },
                            { name: '#054320345043', link: '#' }
                        ]}
                    />
                </div>
            </div>

            <div className="mb-6 text-2xl font-medium">
                Chi tiết hóa đơn
            </div>

            <div className="pb-5">
                <div className="flex gap-5 mb-4">
                    <div className="flex-1 shd-1 rounded-lg p-4">
                        <div className="mb-4 text-base">Thông tin khách hàng</div>
                        <div>
                            <div>Khách hàng: <span className="font-semibold">Duy Võ</span></div>
                            <div>Địa chỉ: <span className="font-semibold">Khu đáu saud asud sua  ud</span></div>
                        </div>
                    </div>
                    <div className="flex-1 shd-1 rounded-lg p-4">
                        <div className="mb-4 text-base">Thông tin liên hệ</div>
                        <div>
                            <div>Số điện thoại: <span className="font-semibold">Duy Võ</span></div>
                            <div>Email: <span className="font-semibold">Khu đáu saud asud sua  ud</span></div>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border-2 border-gray-200">
                    <div className="border-b-2 p-4 flex justify-between">
                        <div className="font-medium">Đơn hàng <span className="text-blue-500">asdsa- a sdasd3fdasd</span></div>
                        <div className="flex gap-5 font-medium">
                            <div>Ngày đặt <span className="text-blue-500">05/07/2024</span></div>
                            <div className="text-red-500">CHỜ XÁC NHẬN</div>
                        </div>
                    </div>
                    <div className="p-4">
                        <Table aria-label="Example static collection table">
                            <TableHeader>
                                <TableColumn>Tên sản phẩm</TableColumn>
                                <TableColumn>Đơn giá</TableColumn>
                                <TableColumn>Số lượng</TableColumn>
                                <TableColumn>Thành tiền</TableColumn>
                            </TableHeader>
                            <TableBody>
                                <TableRow key="1">
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-10 w-10 rounded-lg bg-green-400"></div>
                                            <div>100.000 VND</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>CEO</TableCell>
                                    <TableCell>CEO</TableCell>
                                    <TableCell>Active</TableCell>
                                </TableRow>
                                <TableRow key="2">
                                <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-10 w-10 rounded-lg bg-blue-400"></div>
                                            <div>100.000 VND</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>CEO</TableCell>
                                    <TableCell>CEO</TableCell>
                                    <TableCell>Active</TableCell>
                                </TableRow>
                                <TableRow key="3">
                                <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-10 w-10 rounded-lg bg-orange-400"></div>
                                            <div>100.000 VND</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>CEO</TableCell>
                                    <TableCell>CEO</TableCell>
                                    <TableCell>Active</TableCell>
                                </TableRow>
                                <TableRow key="4">
                                <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-10 w-10 rounded-lg bg-green-400"></div>
                                            <div>100.000 VND</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>CEO</TableCell>
                                    <TableCell>CEO</TableCell>
                                    <TableCell>Active</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                            <div className="text-end px-4 pb-4">Tổng thanh toán: <span className="font-medium text-red-500 text-lg">100.000 VND</span></div>
                </div>
            </div>
        </div>
    );
}

export default BodyOrderDetail;