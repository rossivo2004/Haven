import React, { useCallback } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip } from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { EyeIcon } from "./EyeIcon";
import { columns, users } from "./data";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import {RadioGroup, Radio, cn} from "@nextui-org/react";

const statusColorMap:any = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

type User = typeof users[0];

const CustomRadio = (props:any) => {
    const {children, ...otherProps} = props;
  
    return (
      <Radio
        {...otherProps}
        classNames={{
          base: cn(
            "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
            "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
            "data-[selected=true]:border-primary"
          ),
        }}
      >
        {children}
      </Radio>
    );
  };

export default function TableOrder() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleDelete = (userId: number) => {
    confirmAlert({
      title: "Xóa sản phẩm",
      message: "Bạn có chắc muốn xóa sản phẩm?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            console.log("Deleted user with id:", userId);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const renderCell = useCallback(
    (user: User, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof User];

      switch (columnKey) {
        case "status":
          return (
            <Chip className="capitalize" color={statusColorMap[user.status]} size="sm" variant="flat">
            {cellValue}
        </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2 justify-center">
              <Tooltip content="Details">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <EyeIcon />
                </span>
              </Tooltip>
              <Tooltip content="Edit status">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={onOpen}>
                  <EditIcon />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete order">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={() => handleDelete(user.id)}
                >
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [onOpen]
  );

  return (
    <>
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={users}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal size="xs" scrollBehavior="inside" isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Sửa trạng thái</ModalHeader>
                            <ModalBody>
                            <RadioGroup>
      <CustomRadio value="Pending">
      Chờ xử lý
      </CustomRadio>
      <CustomRadio value="Confirmed">
      Đã xác nhận
      </CustomRadio>
      <CustomRadio
        value="Shipped"
      >
        Đang vận chuyển
      </CustomRadio>
      <CustomRadio value="Delivered">
      Đã giao hàng
      </CustomRadio>
      <CustomRadio value="Canceled">
      Đã hủy
      </CustomRadio>
    </RadioGroup>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
    </>
  );
}
