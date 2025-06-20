import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

function CategoryFormModal({ open, onClose, onSubmit, initialValues, isEdit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialValues || {});
    }
  }, [open, initialValues, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
        form.resetFields(); // reset khi đóng modal
      })
      .catch(() => {});
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      title={isEdit ? 'Sửa loại' : 'Thêm loại'}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={isEdit ? 'Cập nhật' : 'Thêm'}
      cancelText="Huỷ"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên loại"
          name="categoryName"
          rules={[{ required: true, message: 'Nhập tên loại' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CategoryFormModal;
