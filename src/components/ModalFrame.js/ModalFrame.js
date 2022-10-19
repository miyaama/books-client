import { Modal } from "antd";
import React from "react";

export const ModalFrame = ({
  children,
  isModalOpen,
  handleOk,
  handleCancel,
  okButtonProps,
  title
}) => (
  <Modal
    title={title}
    open={isModalOpen}
    onOk={handleOk}
    onCancel={handleCancel}
    okButtonProps={okButtonProps}
  >
    {children}
  </Modal>
);
