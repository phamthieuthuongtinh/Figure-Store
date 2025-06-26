import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Radio,
  Col,
  Row,
} from 'antd';
import dayjs from 'dayjs';

function CouponFormModal({ open, onClose, onSubmit, initialValues, isEdit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        startDate: dayjs(initialValues.startDate),
        endDate: dayjs(initialValues.endDate),
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit({
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
      });
    });
  };

  return (
    <Modal
      open={open}
      title={isEdit ? 'Sửa coupon' : 'Thêm coupon'}
      onCancel={onClose}
      onOk={handleOk}
      okText={isEdit ? 'Cập nhật' : 'Thêm'}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Mã coupon"
          name="couponCode"
          rules={[{ required: true, message: 'Nhập mã coupon' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: 'Nhập mô tả' }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item
          label="Loại"
          name="type"
          rules={[{ required: true }]}
          initialValue="percentage"
        >
          <Radio.Group>
            <Radio value="percentage">Phần trăm</Radio>
            <Radio value="fixed">Cố định</Radio>
          </Radio.Group>
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Giá trị giảm"
              name="value"
              rules={[{ required: true, type: 'number', min: 1 }]}
            >
              <InputNumber addonAfter="đ" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Giá trị đơn tối thiểu"
              name="minOrderValue"
              rules={[{ required: true, type: 'number', min: 0 }]}
            >
              <InputNumber addonAfter="đ" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Ngày bắt đầu"
              name="startDate"
              rules={[{ required: true, message: 'Chọn ngày bắt đầu' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Ngày kết thúc"
              name="endDate"
              rules={[{ required: true, message: 'Chọn ngày kết thúc' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default CouponFormModal;
