import React, { useState, useEffect } from 'react';
import {Select, SelectItem} from "@nextui-org/react";
import { Voucher } from '@/src/interface';

interface VoucherSelectorProps {
  availableVouchers: Voucher[];
  onVoucherSelected: (voucher: Voucher | null) => void;
}

const VoucherSelector: React.FC<VoucherSelectorProps> = ({ availableVouchers, onVoucherSelected }) => {
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [voucherCode, setVoucherCode] = useState('');

  const handleVoucherChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const voucherId = event.target.value;
    const voucher = availableVouchers.find(v => v.id === voucherId) || null;
    setSelectedVoucher(voucher);
    onVoucherSelected(voucher);
  };

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVoucherCode(event.target.value);
  };

  const handleApplyCode = () => {
    const voucher = availableVouchers.find(v => v.code === voucherCode) || null;
    setSelectedVoucher(voucher);
    onVoucherSelected(voucher);
  };

  return (
    <div>
      <h3 className='text-lg font-medium'>Chọn Voucher</h3>
      <select  className='w-full p-2 bg-slate-100 rounded-lg mb-2' onChange={handleVoucherChange} value={selectedVoucher ? selectedVoucher.id : ''}>
        <option  value="">Chọn voucher</option>
        {availableVouchers.map(voucher => (
          <option  key={voucher.id} value={voucher.id}>
            {voucher.code} - Giảm {voucher.discount}%
          </option>
        ))}
      </select>

      <h3>Hoặc nhập mã voucher</h3>
      <div className='flex w-full mb-2'>
      <input type="text" value={voucherCode} onChange={handleCodeChange} className='bg-slate-100 rounded-lg p-2 mr-2 w-3/4'/>
      <button onClick={handleApplyCode} className='p-2 bg-main font-bold text-white rounded-lg flex-1'>Áp dụng</button>
      </div>
    </div>
  );
};

export default VoucherSelector;
