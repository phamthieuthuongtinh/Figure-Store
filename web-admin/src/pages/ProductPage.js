import React, { useEffect, useState } from 'react';
import { Table, Image, Button, Space, message, Popconfirm } from 'antd';
import axios from 'axios';
import ProductFormModal from '../components/Product/ProductFormModal';
import {
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  getAllProducts,
} from '../services/ProductServices';
import '../components/Product/Product.css';
function ProductPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [products, setProducts] = useState([]);

  const fetchProducts = () => {
    getAllProducts()
      .then((res) => {
        if (res.data.code === 1) {
          setProducts(res.data.data);
        } else {
          message.error('Lấy sản phẩm thất bại');
        }
      })
      .catch(() => message.error('Lỗi kết nối tới server'));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (id) => {
    deleteProduct(id)
      .then((res) => {
        if (res.data.code === 1) {
          message.success('Xoá thành công');
          fetchProducts();
        } else {
          message.error('Xoá thất bại');
        }
      })
      .catch(() => message.error('Lỗi xoá sản phẩm'));
  };
  const handleSubmit = (values) => {
    if (editProduct) {
      // Sửa
      updateProduct(editProduct.productId, values)
        .then(() => {
          message.success('Cập nhật thành công');
          setModalOpen(false);
          fetchProducts();
        })
        .catch(() => message.error('Lỗi khi cập nhật'));
    } else {
      // Thêm mới
      createProduct(values)
        .then(() => {
          message.success('Thêm thành công');
          setModalOpen(false);
          fetchProducts();
        })
        .catch(() => message.error('Lỗi khi thêm'));
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'productId' },
    { title: 'Tên sản phẩm', dataIndex: 'productName' },
    { title: 'Giá', dataIndex: 'productPrice' },
    { title: 'Mô tả', dataIndex: 'description' },
    {
      title: 'Ảnh',
      dataIndex: 'imageUrl',
      render: (url) => <Image src={url} alt="Ảnh" width={80} height={80} />,
    },
    {
      title: 'Thao tác',
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditProduct(record); // record là dòng đang được sửa
              setModalOpen(true);
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc chắn muốn xoá?"
            onConfirm={() => handleDelete(record.productId)}
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
      <div className="title-manage-product">
        <h2>Quản lý sản phẩm</h2>
        <Button
          type="primary"
          onClick={() => {
            setEditProduct(null); // xoá dữ liệu cũ
            setModalOpen(true); // mở modal
          }}
        >
          + Thêm sản phẩm
        </Button>
      </div>

      <Table
        dataSource={products}
        columns={columns}
        rowKey="productId"
        pagination={{ pageSize: 5 }}
      />
      <ProductFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditProduct(null); //
        }}
        onSubmit={handleSubmit}
        initialValues={editProduct}
        isEdit={!!editProduct}
      />
    </div>
  );
}

export default ProductPage;
