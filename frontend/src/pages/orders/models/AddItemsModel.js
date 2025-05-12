
// AddItemModal.js
import React, { useState } from 'react';
import { Modal, Table, Button, Input, InputNumber, message } from 'antd';

export default function AddItemModal({ visible, onClose, onAddItem }) {
  const [editingKey, setEditingKey] = useState('');
  const [customItemsData, setCustomItemsData] = useState([]);

  const isEditing = (record) => record.key === editingKey;

  const columns = [
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Input
            value={text}
            onChange={(e) => handleFieldChange(record.key, 'items', e.target.value)}
            onPressEnter={() => handleSaveEdit(record.key)}
          />
        ) : (
          text
        );
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Input
            value={text}
            onChange={(e) => handleFieldChange(record.key, 'description', e.target.value)}
            onPressEnter={() => handleSaveEdit(record.key)}
          />
        ) : (
          text
        );
      },
    },
    {
      title: 'Qty/Kg',
      dataIndex: 'qty',
      key: 'qty',
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <InputNumber
            value={text}
            min={1}
            onChange={(value) => handleFieldChange(record.key, 'qty', value)}
            onPressEnter={() => handleSaveEdit(record.key)}
            style={{ width: '100%' }}
          />
        ) : (
          text
        );
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <InputNumber
            value={text}
            min={0}
            formatter={(value) => `Rs. ${value}`}
            parser={(value) => value.replace('Rs. ', '')}
            onChange={(value) => handleFieldChange(record.key, 'price', value)}
            onPressEnter={() => handleSaveEdit(record.key)}
            style={{ width: '100%' }}
          />
        ) : (
          `Rs. ${text}`
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Button type="link" onClick={() => handleSaveEdit(record.key)}>
            Save
          </Button>
        ) : (
          <Button type="link" onClick={() => setEditingKey(record.key)}>
            Edit
          </Button>
        );
      },
    },
  ];

  const handleFieldChange = (key, dataIndex, value) => {
    const newData = [...customItemsData];
    const index = newData.findIndex((item) => item.key === key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, [dataIndex]: value });
      setCustomItemsData(newData);
    }
  };

  const handleSaveEdit = (key) => {
    setEditingKey('');
  };

  const handleAddItem = () => {
    const newItem = {
      key: Date.now().toString(), // Use timestamp as unique key
      items: '',
      description: '',
      qty: 1,
      price: '',
    };
    setCustomItemsData([...customItemsData, newItem]);
    setEditingKey(newItem.key); // Start editing the new row
  };

  const handleSave = () => {
    const isValid = customItemsData.every(
      (item) => item.items.trim() && item.price >= 0
    );
    if (!isValid) {
      message.error('Please fill in all required fields (Items and Price).');
      return;
    }
    onAddItem({ customItems: customItemsData });
    handleClose();
  };

  const handleClose = () => {
    setCustomItemsData([]); // Reset custom items
    setEditingKey(''); // Reset editing state
    onClose();
  };

  return (
    <Modal
      title={<span style={{ fontWeight: 600, fontSize: '18px' }}>Add Item</span>}
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={900}
      styles={{ body: { padding: 24, borderRadius: 12 } }}
      style={{ borderRadius: 12 }}
    >
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontWeight: 600, fontSize: '16px', marginBottom: 8 }}>Custom Items</h3>
        <Table
          columns={columns}
          dataSource={customItemsData}
          pagination={false}
          bordered
        />
        <Button
          type="dashed"
          onClick={handleAddItem}
          style={{ width: '100%', marginTop: 8 }}
        >
          Add Items
        </Button>
      </div>

      <div style={{ textAlign: 'right' }}>
        <Button
          type="primary"
          onClick={handleSave}
          style={{ background: '#7A34EB', borderColor: '#7A34EB', marginRight: 8 }}
        >
          Save
        </Button>
        <Button onClick={handleClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}