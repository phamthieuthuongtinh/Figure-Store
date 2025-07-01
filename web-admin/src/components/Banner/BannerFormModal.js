import { Modal, Form, Input, InputNumber, Switch } from 'antd';
import { useEffect } from 'react';

const BannerFormModal = ({ open, onCancel, onFinish, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;

    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields(); // reset toàn bộ nếu là thêm mới
    }
  }, [open, initialValues]);

  const handleCancel = () => {
    form.resetFields(); // reset khi đóng
    onCancel();
  };

  return (
    <Modal
      title={initialValues ? 'Cập nhật Banner' : 'Tạo Banner'}
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: true, displayOrder: 0 }} // chỉ dùng mặc định
      >
        <Form.Item name="imageUrl" label="URL ảnh" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="title" label="Tiêu đề">
          <Input />
        </Form.Item>
        <Form.Item name="link" label="Liên kết">
          <Input />
        </Form.Item>
        <Form.Item name="displayOrder" label="Thứ tự hiển thị">
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item name="status" label="Hiển thị" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BannerFormModal;
