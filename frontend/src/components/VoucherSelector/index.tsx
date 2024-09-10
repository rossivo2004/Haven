import React, { useState } from 'react';
import { Select, SelectItem, Chip } from "@nextui-org/react";
import { Voucher } from '@/src/interface';

interface VoucherSelectorProps {
    availableVouchers: Voucher[];
    onVoucherSelected: (voucher: Voucher | null) => void;
}

const VoucherSelector: React.FC<VoucherSelectorProps> = ({ availableVouchers, onVoucherSelected }) => {
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
    const [voucherCode, setVoucherCode] = useState('');

    // Lấy event target value là chuỗi thay vì toàn bộ sự kiện
    const handleVoucherChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        const voucher = availableVouchers.find(v => v.id === value) || null;
        setSelectedVoucher(voucher);
        onVoucherSelected(voucher);
    };

    const handleApplyCode = () => {
        const voucher = availableVouchers.find(v => v.code === voucherCode) || null;
        setSelectedVoucher(voucher);
        onVoucherSelected(voucher);
    };

    const handleVoucherReset = () => {
        setSelectedVoucher(null);
        setVoucherCode('');
        onVoucherSelected(null);
    };

    return (
        <div>
            <h3 className='text-lg font-medium'>Chọn Voucher</h3>
            <select
                className='w-full p-2 bg-slate-100 rounded-lg mb-2'
                onChange={handleVoucherChange}  // Truyền event vào hàm handleVoucherChange
                value={selectedVoucher ? selectedVoucher.id : ''}
            >
                <option value="">Chọn voucher</option>
                {availableVouchers.map(voucher => (
                    <option key={voucher.id} value={voucher.id}>
                        {voucher.code} - Giảm {voucher.discount}%
                    </option>
                ))}
            </select>



            <h3 className='mt-4'>Hoặc nhập mã voucher</h3>
            <div className='flex w-full mb-2'>
            <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                className='bg-slate-100 rounded-lg p-2 mr-2 w-3/4'
            />
            <button onClick={handleApplyCode} className='p-2 bg-main font-bold text-white rounded-lg flex-1'>
                Áp dụng
            </button>
            </div>
            {selectedVoucher && (
                <div>
                    <h2>Voucher đã chọn</h2>
                    <div className='p-2 rounded-lg border-2 flex justify-between'>
                        <p>Mã: {selectedVoucher.code}</p>
                        <Chip
                            isCloseable
                            onClose={handleVoucherReset}  // Khi đóng sẽ reset cả voucher và input
                            startContent={'%'}
                            variant="faded"
                            classNames={{
                                base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                                content: "drop-shadow shadow-black text-white",
                            }}
                        > Giảm giá: {selectedVoucher.discount} %
                        </Chip>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoucherSelector;
