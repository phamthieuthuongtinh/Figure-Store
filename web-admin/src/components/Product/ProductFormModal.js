import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Col, Row } from 'antd';

function ProductFormModal({
  open,
  onClose,
  onSubmit,
  initialValues,
  isEdit,
  categories = [],
  brands = [],
}) {
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
      width={800}
      styles={{
        content: {
          overflowX: 'hidden', // 👈 ngăn cuộn ngang toàn bộ modal
        },
        body: {
          maxHeight: '60vh',
          overflowY: 'auto',
          overflowX: 'hidden', // 👈 ngăn cuộn ngang phần nội dung
        },
      }}
    >
      <Form layout="vertical" form={form}>
        {/* Tên sản phẩm: full row */}
        <Form.Item
          label="Tên sản phẩm"
          name="productName"
          rules={[{ required: true, message: 'Nhập tên sản phẩm' }]}
        >
          <Input />
        </Form.Item>

        {/* Giá + Loại + Thương hiệu: 1 dòng 3 cột */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Giá sản phẩm"
              name="productPrice"
              rules={[{ required: true, message: 'Nhập giá sản phẩm' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={1000}
                formatter={(val) =>
                  `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="categoryId"
              label="Loại sản phẩm"
              rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
            >
              <Select placeholder="Chọn loại">
                {categories.map((cate) => (
                  <Select.Option key={cate.categoryId} value={cate.categoryId}>
                    {cate.categoryName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="brandId"
              label="Thương hiệu"
              rules={[{ required: true, message: 'Vui lòng chọn thương hiệu' }]}
            >
              <Select placeholder="Chọn thương hiệu">
                {brands.map((brand) => (
                  <Select.Option key={brand.brandId} value={brand.brandId}>
                    {brand.brandName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Mô tả: full row */}
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        {/* Link ảnh: full row */}
        <Form.Item label="Link ảnh" name="imageUrl">
          <Input placeholder="https://..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ProductFormModal;
