import { useState, useEffect } from 'react';
import * as Yup from 'yup';

function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;

export const formatVND = (amount: number) => {
    if (typeof amount === 'number') {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    return amount
}

export const validationSchema = Yup.object({
    email: Yup.string().email('Địa chỉ email không hợp lệ').required('Email là bắt buộc'),
    fullName: Yup.string().matches(/^[A-Za-zÀ-Ỹà-ỹ\s'-]{1,50}$/, 'Tên không hợp lệ').max(50, 'Tên không quá 50 ký tự').required('Họ tên là bắt buộc'),
    nickname: Yup.string().matches(/^[A-Za-zÀ-Ỹà-ỹ\s'-]{1,20}$/, 'Nickname không hợp lệ').max(20, 'Nickname không quá 20 ký tự').required('Nickname là bắt buộc'),
    phoneNumber: Yup.string().matches(/^(0[3-9][0-9]{8})$/, 'Số điện thoại không hợp lệ').required('Số điện thoại là bắt buộc'),
    birthday: Yup.date().required('Ngày sinh là bắt buộc'),
    gender: Yup.string().required('Giới tính là bắt buộc'),
    country: Yup.string().required('Quốc tịch là bắt buộc'),
    password: Yup.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự').required('Mật khẩu là bắt buộc'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp').required('Xác nhận mật khẩu là bắt buộc'),
});

export const convertBirthdayToString = (birthday: any) => {
    if (!birthday || !birthday.year || !birthday.month || !birthday.day) {
      return ''; // Trả về chuỗi rỗng hoặc giá trị mặc định nếu dữ liệu không hợp lệ
    }
  
    // Đảm bảo tháng và ngày có 2 chữ số
    const month = String(birthday.month).padStart(2, '0');
    const day = String(birthday.day).padStart(2, '0');
  
    // Chuyển đổi thành chuỗi theo định dạng YYYY-MM-DD
    return `${birthday.year}-${month}-${day}`;
  };

export const hiddenMenuPaths = ['/profile/account', '/profile/address', '/profile/notify', '/profile/order'];
