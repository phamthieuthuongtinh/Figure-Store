import React, { useState, useEffect } from 'react';
import {
  Modal,
  Image,
  Space,
  Button,
  Popconfirm,
  Input,
  message,
  List,
  Spin,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  getProductImages,
  addProductImageByUrl,
  deleteProductImage,
} from '../../services/ProductImageService';

function ProductImageModal({ open, onClose, product }) {
  const [images, setImages] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    if (!product) return;
    setLoading(true);
    try {
      const res = await getProductImages(product.productId);
      setImages(res.data.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && product?.productId) fetchImages();
  }, [open, product]);

  const handleAddUrl = async () => {
    if (!urlInput.trim()) return;
    setLoading(true);
    try {
      await addProductImageByUrl(product.productId, urlInput.trim());
      message.success('Đã thêm ảnh');
      setUrlInput('');
      await fetchImages();
    } catch {
      message.error('Lỗi khi thêm URL');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProductImage(id);
      message.success('Đã xoá');
      fetchImages();
    } catch {
      message.error('Lỗi xoá ảnh');
    }
  };
  if (!product) return null;
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={`Ảnh sản phẩm: ${product.productName}`}
      width={800}
    >
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Dán URL ảnh ở đây"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          style={{ width: 400 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          loading={loading}
          onClick={handleAddUrl}
        >
          Thêm
        </Button>
      </Space>

      <Spin spinning={loading}>
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={images}
          renderItem={(item) => (
            <List.Item>
              <div style={{ position: 'relative' }}>
                <Image src={item.imageUrl} width={160} height={160} />
                <Popconfirm
                  title="Xoá ảnh này?"
                  onConfirm={() => handleDelete(item.imageId)}
                >
                  <Button
                    size="small"
                    icon={<DeleteOutlined />}
                    danger
                    style={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      background: 'rgba(255,255,255,0.8)',
                    }}
                  />
                </Popconfirm>
              </div>
            </List.Item>
          )}
        />
      </Spin>
    </Modal>
  );
}

export default ProductImageModal;
