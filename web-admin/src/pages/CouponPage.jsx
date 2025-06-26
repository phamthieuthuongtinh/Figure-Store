import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Popconfirm, Tag } from 'antd';
import {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../services/CouponService';
import CouponFormModal from '../components/Coupon/CouponFormModal';
import '../components/Coupon/Coupon.css';

function CouponPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]);

  const fetchCoupons = () => {
    getAllCoupons()
      .then((res) => {
        if (res.data.data) {
          setCoupons(res.data.data);
        } else {
          message.error('Lấy danh sách coupon thất bại');
        }
      })
      .catch(() => message.error('Lỗi kết nối server'));
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = (id) => {
    deleteCoupon(id)
      .then((res) => {
        if (res.data.code === 1) {
          message.success('Đã vô hiệu hoá coupon');
          fetchCoupons();
        } else {
          message.error('Xoá thất bại');
        }
      })
      .catch(() => message.error('Lỗi xoá coupon'));
  };

  const handleSubmit = (values) => {
    // chuẩn hoá ngày sang chuỗi ISO nếu cần
    const payload = { ...values };
    if (editCoupon) {
      updateCoupon(editCoupon.couponId, payload)
        .then(() => {
          message.success('Cập nhật thành công');
          setModalOpen(false);
          fetchCoupons();
        })
        .catch(() => message.error('Lỗi khi cập nhật'));
    } else {
      createCoupon(payload)
        .then(() => {
          message.success('Thêm mới thành công');
          setModalOpen(false);
          fetchCoupons();
        })
        .catch(() => message.error('Lỗi khi thêm'));
    }
  };

  const columns = [
    { title: 'Mã', dataIndex: 'couponCode' },
    {
      title: 'Loại',
      dataIndex: 'type',
      render: (t) => (t === 'percentage' ? 'Phần trăm' : 'Cố định'),
    },
    { title: 'Giá trị', dataIndex: 'value' },
    { title: 'Tối thiểu', dataIndex: 'minOrderValue' },
    {
      title: 'Bắt đầu',
      dataIndex: 'startDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Kết thúc',
      dataIndex: 'endDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      render: (a) =>
        a ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Vô hiệu</Tag>,
    },
    {
      title: 'Thao tác',
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditCoupon(record);
              setModalOpen(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Vô hiệu hoá coupon này?"
            okText="Xoá"
            cancelText="Huỷ"
            onConfirm={() => handleDelete(record.couponId)}
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="title-manage-coupon">
        <h2>Quản lý mã giảm giá</h2>
        <Button
          type="primary"
          onClick={() => {
            setEditCoupon(null);
            setModalOpen(true);
          }}
        >
          + Thêm coupon
        </Button>
      </div>

      <Table
        dataSource={coupons}
        columns={columns}
        rowKey="couponId"
        pagination={{ pageSize: 8 }}
        bordered
      />

      <CouponFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditCoupon(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editCoupon}
        isEdit={!!editCoupon}
      />
    </div>
  );
}

export default CouponPage;
