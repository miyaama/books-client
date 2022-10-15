import { Modal } from "antd";
import React from "react";

export const ModalFrame = ({
  children,
  isModalOpen,
  handleOk,
  handleCancel,
}) => (
  <Modal
    title="Basic Modal"
    open={isModalOpen}
    onOk={handleOk}
    onCancel={handleCancel}
  >
    {children}
  </Modal>
);
