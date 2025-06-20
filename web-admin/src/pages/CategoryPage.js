import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import {
  deleteCategory,
  createCategory,
  updateCategory,
  getAllCategories,
} from '../services/CategoryServices';
import '../components/Category/Category.css';
import CategoryFormModal from '../components/Category/CategoryFormModal';
function CategoryPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const fetchCategories = () => {
    getAllCategories()
      .then((res) => {
        if (res.data.data) {
          setCategories(res.data.data);
        } else {
          message.error('Lấy sản phẩm thất bại');
        }
      })
      .catch(() => message.error('Lỗi kết nối tới server'));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = (id) => {
    deleteCategory(id)
      .then((res) => {
        if (res.data.code === 1) {
          message.success('Xoá thành công');
          fetchCategories();
        } else {
          message.error('Xoá thất bại');
        }
      })
      .catch(() => message.error('Lỗi xoá sản phẩm'));
  };
  const handleSubmit = (values) => {
    if (editCategory) {
      // Sửa
      updateCategory(editCategory.productId, values)
        .then(() => {
          message.success('Cập nhật thành công');
          setModalOpen(false);
          fetchCategories();
        })
        .catch(() => message.error('Lỗi khi cập nhật'));
    } else {
      // Thêm mới
      createCategory(values)
        .then(() => {
          message.success('Thêm thành công');
          setModalOpen(false);
          fetchCategories();
        })
        .catch(() => message.error('Lỗi khi thêm'));
    }
  };
  const columns = [
    { title: 'ID', dataIndex: 'categoryId' },
    { title: 'Tên loại', dataIndex: 'categoryName' },
    { title: 'Mô tả', dataIndex: 'description' },
    {
      title: 'Thao tác',
      render: (_, category) => (
        <Space>
          <Button
            onClick={() => {
              setEditCategory(category); // record là dòng đang được sửa
              setModalOpen(true);
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc chắn muốn xoá?"
            onConfirm={() => handleDelete(category.categoryId)}
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
      <div className="title-manage-category">
        <h2>Quản lý sản phẩm</h2>
        <Button
          type="primary"
          onClick={() => {
            setEditCategory(null); // xoá dữ liệu cũ
            setModalOpen(true); // mở modal
          }}
        >
          + Thêm loại
        </Button>
      </div>

      <Table
        dataSource={categories}
        columns={columns}
        rowKey="categoryId"
        pagination={{ pageSize: 5 }}
      />
      <CategoryFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditCategory(null); //
        }}
        onSubmit={handleSubmit}
        initialValues={editCategory}
        isEdit={!!editCategory}
      />
    </div>
  );
}

export default CategoryPage;
