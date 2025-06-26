import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Descriptions, Table, Button, message, Select } from 'antd';
import { getOrderById, updateOrder } from '../services/OrderService';
import { getDetailByOrderId } from '../services/OrderDetailService';
import { getUserbyId } from '../services/UserService';
const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [details, setDetails] = useState([]);
  //   const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resOrder = await getOrderById(id);
        const resDetails = await getDetailByOrderId(id);
        // const resUser = await getUserbyId(resOrder.data.data.userId);
        setOrder(resOrder.data.data); // giả sử API trả về { data }
        setDetails(resDetails.data.data);
        // setUser(resUser.data.data);
      } catch (err) {
        message.error('Không thể tải dữ liệu đơn hàng');
      }
    };
    fetchData();
  }, [id]);

  const columns = [
    { title: 'Sản phẩm', dataIndex: 'productId', key: 'productId' },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
    {
      title: 'Giá tại thời điểm',
      dataIndex: 'priceAtTime',
      key: 'priceAtTime',
      render: (price) => `${price.toLocaleString()}₫`,
    },
  ];

  if (!order) return <p>Đang tải dữ liệu...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Chi tiết đơn hàng #{order.orderId}
      </h2>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Mã đơn hàng">
          {order.orderId}
        </Descriptions.Item>

        <Descriptions.Item label="Người đặt">{order.userId}</Descriptions.Item>

        {/* Gộp TRẠNG THÁI vào cùng Descriptions */}
        <Descriptions.Item label="Trạng thái" span={2}>
          <Select
            value={order.status}
            style={{ width: 160 }}
            onChange={async (newStatus) => {
              try {
                const res = await updateOrder(order.orderId, {
                  status: newStatus,
                });
                if (res.data.code === 1) {
                  message.success(res.data.message);
                  setOrder({ ...order, status: newStatus }); // ⬅️ UI sẽ re-render
                } else {
                  message.error('Cập nhật thất bại');
                }
              } catch {
                message.error('Lỗi kết nối server');
              }
            }}
          >
            <Select.Option value="pending">Chờ xác nhận</Select.Option>
            <Select.Option value="confirmed">Đã xác nhận</Select.Option>
            <Select.Option value="shipped">Đang giao</Select.Option>
            <Select.Option value="delivered">Đã giao</Select.Option>
          </Select>
        </Descriptions.Item>
      </Descriptions>

      <h3 className="mt-6 mb-2 text-lg font-medium">Danh sách sản phẩm</h3>
      <Table columns={columns} dataSource={details} rowKey="orderDetailId" />

      <Button className="mt-4" onClick={() => navigate(-1)}>
        ← Quay lại
      </Button>
    </div>
  );
};

export default OrderDetailPage;
