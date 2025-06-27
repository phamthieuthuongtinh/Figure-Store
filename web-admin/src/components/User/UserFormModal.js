import React, { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';

function UserFormModal({ open, onClose, onSubmit, initialValues, isEdit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) form.setFieldsValue(initialValues);
    else form.resetFields();
  }, [initialValues, form]);

  const handleOk = () => {
    form.validateFields().then(onSubmit);
  };

  return (
    <Modal
      open={open}
      title={isEdit ? 'Sửa user' : 'Thêm user'}
      onCancel={onClose}
      onOk={handleOk}
      okText={isEdit ? 'Cập nhật' : 'Tạo'}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Họ tên"
          name="userName"
          rules={[{ required: true, message: 'Nhập tên' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="userEmail"
          rules={[
            { required: true, message: 'Nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="userPhone"
          rules={[{ required: true, message: 'Nhập số điện thoại' }]}
        >
          <Input />
        </Form.Item>

        {isEdit && (
          <Form.Item label="Mật khẩu mới" name="userPassword">
            <Input.Password placeholder="Để trống nếu không muốn thay đổi" />
          </Form.Item>
        )}
        <Form.Item
          label="Vai trò"
          name="userRole"
          initialValue="customer"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="customer">Customer</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Địa chỉ" name="userAddress">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UserFormModal;
