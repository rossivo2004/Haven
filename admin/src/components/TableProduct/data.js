import React from "react";
const columns = [
  {name: "Tên sản phẩm", uid: "name"},
  {name: "Giá", uid: "price"},
  {name: "Số lượng", uid: "quantity"},
  {name: "Giảm giá", uid: "discount"},
  {name: "ACTIONS", uid: "actions"},
];

const users = [
  {
    id: 1,
    name: "Tony Reichert",
    price: "CEO",
    team: "Management",
    quantity: "active",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    discount: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Zoey Lang",
    price: "Technical Lead",
    team: "Development",
    quantity: "paused",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    discount: "zoey.lang@example.com",
  },
  {
    id: 3,
    name: "Jane Fisher",
    price: "Senior Developer",
    team: "Development",
    quantity: "active",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    discount: "jane.fisher@example.com",
  },
  {
    id: 4,
    name: "William Howard",
    price: "Community Manager",
    team: "Marketing",
    quantity: "vacation",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    discount: "william.howard@example.com",
  },
  {
    id: 5,
    name: "Kristen Copper",
    price: "Sales Manager",
    team: "Sales",
    quantity: "active",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    discount: "kristen.cooper@example.com",
  },
];

export {columns, users};
