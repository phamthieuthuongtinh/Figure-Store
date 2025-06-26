import React, { useEffect, useState } from 'react';
import { Table, Image, Button, Space, message, Popconfirm } from 'antd';
import ProductFormModal from '../components/Product/ProductFormModal';
import {
  deleteProduct,
  createProduct,
  updateProduct,
  getAllProducts,
} from '../services/ProductServices';
import { getAllCategories } from '../services/CategoryServices';
import { getAllBrands } from '../services/BrandServices';
import '../components/Product/Product.css';
function ProductPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [brandMap, setBrandMap] = useState({});
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
  const fetchCategories = () => {
    getAllCategories().then((res) => {
      if (res.data.code === 1) {
        const arr = res.data.data;
        setCategories(arr);
        const map = {};
        arr.forEach((c) => (map[c.categoryId] = c.categoryName));
        setCategoryMap(map);
      }
    });
  };

  const fetchBrands = () => {
    getAllBrands().then((res) => {
      if (res.data.code === 1) {
        const arr = res.data.data;
        setBrands(arr);
        const map = {};
        arr.forEach((b) => (map[b.brandId] = b.brandName));
        setBrandMap(map);
      }
    });
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
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
    {
      title: 'Loại',
      dataIndex: 'categoryId',
      render: (id) => categoryMap[id] || '—',
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brandId',
      render: (id) => brandMap[id] || '—',
    },
    { title: 'Tồn kho', dataIndex: 'quantity' },
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
        pagination={{ pageSize: 4 }}
      />

      <ProductFormModal
        categories={categories}
        brands={brands}
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
