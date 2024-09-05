import React from "react";
const columns = [
  {name: "Tên phân loại", uid: "name"},
  {name: "Tag", uid: "tag"},
  {name: "Số lượng", uid: "quantity"},
  {name: "ACTIONS", uid: "actions"},

];

const users = [
  {
    id: 1,
    name: "Tony Reichert",
    tag: "CEO",
    quantity: "active",
    img: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    id: 2,
    name: "Zoey Lang",
    tag: "Technical Lead",
    quantity: "paused",
    img: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    id: 3,
    name: "Jane Fisher",
    tag: "Senior Developer",
    quantity: "active",
    img: "https://i.pravatar.cc/150?u=a04258114e29026702d",
  },
  {
    id: 4,
    name: "William Howard",
    tag: "Community Manager",
    quantity: "vacation",
    img: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
  },
  {
    id: 5,
    name: "Kristen Copper",
    tag: "Sales Manager",
    quantity: "active",
    img: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
  },
];

export {columns, users};
