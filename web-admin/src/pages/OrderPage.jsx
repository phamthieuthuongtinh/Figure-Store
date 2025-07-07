import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, Popconfirm, message } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllOrders, deleteOrder } from '../services/OrderService';
import { useNavigate } from 'react-router-dom';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders();

      setOrders(res.data.data);
    } catch (err) {
      message.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id); // API: DELETE /orders/:id
      message.success('Đã xoá đơn hàng');
      fetchOrders();
    } catch (err) {
      message.error('Xoá thất bại');
    }
  };

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Người đặt',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `${price.toLocaleString()}₫`,
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discountAmount',
      key: 'discountAmount',
      render: (discount) => `${discount.toLocaleString()}₫`,
    },
    {
      title: 'Trạng thái đơn',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color =
          {
            pending: 'gold',
            confirmed: 'blue',
            shipped: 'purple',
            delivered: 'green',
          }[status] || 'default';
        const label =
          typeof status === 'string' ? status.toUpperCase() : 'KHÔNG RÕ';
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: 'Phương thức',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (paymentStatus) => {
        const color =
          {
            unpaid: 'gold',
            paid: 'green',
          }[paymentStatus] || 'default';
        const label =
          typeof paymentStatus === 'string'
            ? paymentStatus.toUpperCase()
            : 'KHÔNG RÕ';
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/orderdetails/${record.orderId}`)}
          >
            Chi tiết
          </Button>
          <Popconfirm
            title="Xác nhận xoá đơn hàng?"
            onConfirm={() => handleDelete(record.orderId)}
            okText="Xoá"
            cancelText="Hủy"
          >
            {record.status === 'pending' && (
              <Button danger icon={<DeleteOutlined />}>
                Xoá
              </Button>
            )}
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Danh sách đơn hàng</h2>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="orderId"
        loading={loading}
      />
    </div>
  );
};

export default OrderPage;
