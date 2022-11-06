import { Modal } from "antd";
import React from "react";

export const ModalFrame = ({ children, isModalOpen, handleCancel, title }) => (
  <Modal title={title} open={isModalOpen} onCancel={handleCancel} footer={null}>
    {children}
  </Modal>
);
