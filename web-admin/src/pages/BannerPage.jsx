import { Table, Button, Space, Popconfirm, message } from 'antd';
import { useEffect, useState } from 'react';
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../services/BannerService';
import '../components/Banner/Banner.css';
import BannerFormModal from '../components/Banner/BannerFormModal';

const BannerPage = () => {
  const [banners, setBanners] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const fetchData = async () => {
    try {
      const res = await getAllBanners();
      setBanners(res.data.data);
    } catch (error) {
      message.error('Lỗi khi tải banner!');
      setBanners([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'imageUrl',
      render: (url) => <img src={url} style={{ height: 60 }} />,
    },
    { title: 'Tiêu đề', dataIndex: 'title' },
    { title: 'Link', dataIndex: 'link' },
    { title: 'Thứ tự', dataIndex: 'displayOrder' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (val) => (val ? 'Hiện' : 'Ẩn'),
    },
    {
      title: 'Hành động',
      render: (_, item) => (
        <Space>
          <Button
            onClick={() => {
              setSelectedBanner(item);
              setModalOpen(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xoá?"
            onConfirm={() => handleDelete(item.bannerId)}
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const handleCreateOrUpdate = async (values) => {
    try {
      if (selectedBanner) {
        await updateBanner(selectedBanner.bannerId, values);
        message.success('Cập nhật thành công!');
      } else {
        await createBanner(values);
        message.success('Tạo mới thành công!');
      }
      setModalOpen(false);
      setSelectedBanner(null);
      fetchData();
    } catch {
      message.error('Lỗi khi lưu!');
    }
  };

  const handleDelete = async (id) => {
    await deleteBanner(id);
    message.success('Đã xoá!');
    fetchData();
  };

  return (
    <div>
      <div className="title-manage-banner">
        <h2>Quản lý Banner</h2>
        <Button type="primary" onClick={() => setModalOpen(true)}>
          Thêm Banner
        </Button>
      </div>
      <Table
        rowKey="bannerId"
        columns={columns}
        dataSource={banners}
        style={{ marginTop: 20 }}
      />
      <BannerFormModal
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setSelectedBanner(null);
        }}
        onFinish={handleCreateOrUpdate}
        initialValues={selectedBanner}
      />
    </div>
  );
};

export default BannerPage;
