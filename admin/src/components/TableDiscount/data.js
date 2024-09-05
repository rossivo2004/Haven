import React from "react";
const columns = [
  {name: "Mã giảm giá", uid: "code"},
  {name: "Giá trị", uid: "price"},
  {name: "Số lượng", uid: "quantity"},
  {name: "Ngày hết hạn", uid: "date"},
  {name: "Điều kiện", uid: "dk"},
  {name: "Mô tả", uid: "description"},
  {name: "Điểm đổi", uid: "point"},
  {name: "ACTIONS", uid: "actions"},

];

const users = [
  {
    id: 1,
    code: "HV001",
    price: 10000,
    quantity: "active",
    date: "CEO",
    dk: "https",
    description: "Giảm giá 10% cho đơn hàng trên 10000đ",
    point: 5000,
  },
  {
    id: 2,
    code: "HV001",
    price: 10000,
    quantity: "active",
    date: "CEO",
    dk: "https",
    description: "Giảm giá 10% cho đơn hàng trên 10000đ",
    point: 5000,
  },
  {
    id: 3,
    code: "HV001",
    price: 10000,
    quantity: "active",
    date: "CEO",
    dk: "https",
    description: "Giảm giá 10% cho đơn hàng trên 10000đ",
    point: 5000,
  },
  {
    id: 4,
    code: "HV001",
    price: 10000,
    quantity: "active",
    date: "CEO",
    dk: "https",
    description: "Giảm giá 10% cho đơn hàng trên 10000đ",
    point: 5000,
  },

];

export {columns, users};
