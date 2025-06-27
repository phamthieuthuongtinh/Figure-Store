import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, message, Popconfirm } from 'antd';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser, // chỉ còn delete
} from '../services/UserService';
import UserFormModal from '../components/User/UserFormModal';
import '../components/User/User.css';

function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    getAllUsers()
      .then((res) => setUsers(res.data.data || []))
      .catch(() => message.error('Lỗi tải danh sách user'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchUsers, []);

  const handleSubmit = (values) => {
    const api = editUser
      ? updateUser(editUser.userId, values)
      : createUser(values);

    api
      .then(() => {
        message.success(editUser ? 'Cập nhật thành công' : 'Tạo thành công');
        setModalOpen(false);
        setEditUser(null);
        fetchUsers();
      })
      .catch(() => message.error('Thao tác thất bại'));
  };

  const handleDelete = (id) => {
    deleteUser(id)
      .then(() => {
        message.success('Thay đổi thành công');
        fetchUsers();
      })
      .catch(() => message.error('Xoá thất bại'));
  };

  const columns = [
    { title: 'ID', dataIndex: 'userId' },
    { title: 'Tên', dataIndex: 'userName' },
    { title: 'Email', dataIndex: 'userEmail' },
    { title: 'Phone', dataIndex: 'userPhone' },
    { title: 'Địa chỉ', dataIndex: 'userAddress' },
    {
      title: 'Vai trò',
      dataIndex: 'userRole',
      render: (r) =>
        r === 'admin' ? (
          <Tag color="gold">Quản trị viên</Tag>
        ) : (
          <Tag>Khách hàng</Tag>
        ),
    },
    {
      title: 'Thao tác',
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditUser(record);
              setModalOpen(true);
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title={
              record.isDeleted
                ? 'Kích hoạt lại tài khoản này?'
                : 'Vô hiệu hoá tài khoản này?'
            }
            okText={record.isDeleted ? 'Kích hoạt' : 'Khoá'}
            cancelText="Huỷ"
            onConfirm={() => handleDelete(record.userId)}
          >
            <Button danger={!record.isDeleted} type="primary">
              {record.isDeleted ? 'Kích hoạt' : 'Vô hiệu hoá'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="title-manage-user">
        <h2>Quản lý tài khoản người dùng</h2>
        <Button
          type="primary"
          onClick={() => {
            setEditUser(null);
            setModalOpen(true);
          }}
        >
          + Thêm user
        </Button>
      </div>

      <Table
        rowClassName={(record) => (record.isDeleted ? 'row-deleted' : '')}
        dataSource={users}
        columns={columns}
        rowKey="userId"
        loading={loading}
        bordered
        pagination={{ pageSize: 8 }}
      />

      <UserFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditUser(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editUser}
        isEdit={!!editUser}
      />
    </div>
  );
}

export default UserPage;
