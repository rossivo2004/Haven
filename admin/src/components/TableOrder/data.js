import React from "react";

const columns = [
  {name: "ID Đơn hàng", uid: "id"},
  {name: "Giá", uid: "price"},
  {name: "Ngày đặt", uid: "date"},
  {name: "Trạng thái", uid: "status"},
  {name: "ACTIONS", uid: "actions"},
];

const users = [
  {
    id: 1,
    price: "CEO",
    date: "Management",
    status: "active",
  },
  {
    id: 2,
    price: "Technical Lead",
    date: "Development",
    status: "paused",
  },
  {
    id: 3,
    price: "Senior Developer",
    date: "Development",
    status: "active",
  },
  {
    id: 4,
    price: "Community Manager",
    date: "Marketing",
    status: "vacation",
  },
  {
    id: 5,
    price: "Sales Manager",
    date: "Sales",
    status: "active",
  },
];

export {columns, users};
