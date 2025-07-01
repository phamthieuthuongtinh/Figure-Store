import {
  Modal,
  Form,
  InputNumber,
  Input,
  DatePicker,
  Switch,
  Select,
  message,
} from 'antd';
import { getAllProducts } from '../../services/ProductServices';
import { useEffect, useState } from 'react';
import { getAllSales } from '../../services/SaleService';

const SaleFormModal = ({ open, onCancel, onFinish, initialValues }) => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields(); // reset toàn bộ
        form.setFieldsValue({ status: true }); // đặt giá trị mặc định khi tạo
      }
    }

    const fetchProducts = async () => {
      try {
        // Gọi 2 API đồng thời cho nhanh
        const [productRes, saleRes] = await Promise.all([
          getAllProducts(),
          getAllSales(),
        ]);

        const allProducts = productRes.data?.data || [];
        const sales = saleRes.data?.data || [];

        // Lấy danh sách productId đang sale
        const saleIds = sales.map((s) => s.productId);

        // Nếu đang sửa => giữ lại sản phẩm đang sửa trong dropdown
        const currentId = initialValues?.productId;

        const available = allProducts.filter(
          (p) => !saleIds.includes(p.productId) || p.productId === currentId
        );

        setProducts(available);
      } catch (error) {
        message.error('Lỗi tải danh sách sản phẩm hoặc sale');
      }
    };

    fetchProducts();
  }, [open, initialValues, form]);
  const handleCancel = () => {
    form.resetFields();
    onCancel(); // gọi callback của cha
  };
  return (
    <Modal
      title={initialValues ? 'Cập nhật Sale' : 'Tạo Sale'}
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="productId"
          label="Chọn sản phẩm"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Chọn một sản phẩm"
            showSearch
            optionFilterProp="label"
          >
            {products.map((p) => (
              <Select.Option
                key={p.productId}
                value={p.productId}
                label={p.productName}
              >
                {p.productName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="title" label="Tiêu đề">
          <Input />
        </Form.Item>
        <Form.Item
          name="discountPercent"
          label="Giảm giá (%)"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} max={100} />
        </Form.Item>
        <Form.Item
          name="startDate"
          label="Ngày bắt đầu"
          rules={[{ required: true }]}
        >
          <DatePicker showTime />
        </Form.Item>
        <Form.Item
          name="endDate"
          label="Ngày kết thúc"
          rules={[{ required: true }]}
        >
          <DatePicker showTime />
        </Form.Item>
        <Form.Item name="status" label="Hiển thị" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SaleFormModal;
