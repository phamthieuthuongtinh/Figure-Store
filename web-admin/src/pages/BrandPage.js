import React, { useEffect, useState } from 'react';
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  updateBrand,
} from '../services/BrandServices';
import { Button, message, Popconfirm, Space, Table } from 'antd';
import '../components/Brand/Brand.css';
import BrandFromModal from '../components/Brand/BrandFormModal';
function BrandPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [brands, setBrands] = useState([]);

  const fetchBrands = () => {
    getAllBrands()
      .then((res) => {
        if (res.data.data) {
          setBrands(res.data.data);
        } else {
          message.error('Lấy danh sách thương hiệu thất bại');
        }
      })
      .catch(() => message.error('Lỗi kết nối tới server'));
  };
  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = (id) => {
    deleteBrand(id)
      .then((res) => {
        if (res.data.code === 1) {
          message.success('Xoá thành công');
          fetchBrands();
        } else {
          message.error('Xoá thất bại');
        }
      })
      .catch(() => message.error('Lỗi xoá sản phẩm'));
  };
  const handleSubmit = (values) => {
    if (editBrand) {
      // Sửa
      updateBrand(editBrand.productId, values)
        .then(() => {
          message.success('Cập nhật thành công');
          setModalOpen(false);
          fetchBrands();
        })
        .catch(() => message.error('Lỗi khi cập nhật'));
    } else {
      // Thêm mới
      createBrand(values)
        .then(() => {
          message.success('Thêm thành công');
          setModalOpen(false);
          fetchBrands();
        })
        .catch(() => message.error('Lỗi khi thêm'));
    }
  };
  const columns = [
    { title: 'ID', dataIndex: 'brandId' },
    { title: 'Tên thương hiệu', dataIndex: 'brandName' },
    { title: 'Mô tả', dataIndex: 'description' },
    {
      title: 'Thao tác',
      render: (_, brand) => (
        <Space>
          <Button
            onClick={() => {
              setEditBrand(brand); // record là dòng đang được sửa
              setModalOpen(true);
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc chắn muốn xoá?"
            onConfirm={() => handleDelete(brand.brandId)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <div>
      <div className="title-manage-brand">
        <h2>Quản lý sản phẩm</h2>
        <Button
          type="primary"
          onClick={() => {
            setEditBrand(null); // xoá dữ liệu cũ
            setModalOpen(true); // mở modal
          }}
        >
          + Thêm thương hiệu
        </Button>
      </div>
      <Table
        dataSource={brands}
        columns={columns}
        rowKey="brandId"
        pagination={{ pageSize: 5 }}
      />
      <BrandFromModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditBrand(null); //
        }}
        onSubmit={handleSubmit}
        initialValues={editBrand}
        isEdit={!!editBrand}
      />
    </div>
  );
}

export default BrandPage;
