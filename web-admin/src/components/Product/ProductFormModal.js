import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';

function ProductFormModal({ open, onClose, onSubmit, initialValues, isEdit }) {
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
      title={isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={isEdit ? 'Cập nhật' : 'Thêm'}
      cancelText="Huỷ"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên sản phẩm"
          name="productName"
          rules={[{ required: true, message: 'Nhập tên sản phẩm' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giá sản phẩm"
          name="productPrice"
          rules={[{ required: true, message: 'Nhập giá sản phẩm' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            step={1000}
            formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Link ảnh" name="imageUrl">
          <Input placeholder="https://..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ProductFormModal;
