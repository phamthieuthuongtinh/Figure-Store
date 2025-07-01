import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, message } from 'antd';
import dayjs from 'dayjs';
import {
  getAllSales,
  createSale,
  updateSale,
  deleteSale,
} from '../services/SaleService';
import SaleFormModal from '../components/Sale/SaleFormModal';
import '../components/Sale/Sale.css';
const SalePage = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllSales();
      setSales(
        res.data.data.map((s) => ({
          ...s,
          startDate: dayjs(s.startDate),
          endDate: dayjs(s.endDate),
        }))
      );
    } catch (err) {
      message.error('Không thể tải danh sách sale');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdate = async (values) => {
    const payload = {
      ...values,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
    };

    try {
      if (selectedSale) {
        await updateSale(selectedSale.saleId, payload);
        message.success('Cập nhật sale thành công!');
      } else {
        await createSale(payload);
        message.success('Tạo sale thành công!');
      }
      setModalOpen(false);
      setSelectedSale(null);
      fetchData();
    } catch (err) {
      message.error('Lỗi khi lưu sale');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSale(id);
      message.success('Đã xoá sale!');
      fetchData();
    } catch {
      message.error('Không thể xoá!');
    }
  };
  const columns = [
    { title: 'ID', dataIndex: 'saleId', width: 70 },
    { title: 'Sản phẩm', dataIndex: 'productId' },
    { title: 'Tiêu đề', dataIndex: 'title' },
    {
      title: 'Giảm (%)',
      dataIndex: 'discountPercent',
      render: (val) => `${val}%`,
    },
    {
      title: 'Bắt đầu',
      dataIndex: 'startDate',
      render: (d) => dayjs(d).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Kết thúc',
      dataIndex: 'endDate',
      render: (d) => dayjs(d).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (val) => (val ? 'Bật' : 'Tắt'),
    },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              // convert date string back to dayjs for initial form values
              setSelectedSale({
                ...record,
                startDate: dayjs(record.startDate),
                endDate: dayjs(record.endDate),
              });
              setModalOpen(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xoá sale?"
            onConfirm={() => handleDelete(record.saleId)}
          >
            <Button danger size="small">
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="title-manage-sale">
        <h2>Quản lý Sale</h2>
        <Button
          type="primary"
          onClick={() => {
            setSelectedSale(null);
            setModalOpen(true);
          }}
        >
          Thêm Sale
        </Button>
      </div>

      <Table
        columns={columns}
        rowKey="saleId"
        dataSource={sales}
        loading={loading}
        pagination={{ pageSize: 8 }}
        style={{ marginTop: 20 }}
      />

      <SaleFormModal
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setSelectedSale(null);
        }}
        onFinish={handleCreateOrUpdate}
        initialValues={selectedSale}
      />
    </div>
  );
};

export default SalePage;
