import React, { useState } from 'react';
import { Modal, Table, Button, Input, InputNumber, Select, message } from 'antd';

const { Option } = Select;

export default function AddItemModal({ visible, onClose, onAddItem, selectedService }) {
  const [editingKey, setEditingKey] = useState('');
  const [customItemsData, setCustomItemsData] = useState([]);

  const isEditing = (record) => record.key === editingKey;

  const laundryOptions = [
    {
      value: 'Wash and dry – Normal Clothes',
      label: 'Wash and dry – Normal Clothes (per Kg, Express service)',
      price: 250,
      description: 'Express wash and dry for normal clothes, priced per kg',
    },
    {
      value: 'Wash and dry – Bedsheet/Towels',
      label: 'Wash and dry – Bedsheet/Towels (per Kg, Express service)',
      price: 350,
      description: 'Express wash and dry for bedsheets or towels, priced per kg',
    },
    {
      value: 'Wash and dry with pressing – Normal clothes (3 days)',
      label: 'Wash and dry with pressing – Normal clothes (per Kg, min 3 days)',
      price: 300,
      description: 'Wash, dry, and press normal clothes, minimum 3 days, priced per kg',
    },
    {
      value: 'Wash and dry with pressing – Normal clothes (Express)',
      label: 'Wash and dry with pressing – Normal clothes (per Kg, Express)',
      price: 400,
      description: 'Express wash, dry, and press normal clothes, priced per kg',
    },
    {
      value: 'Laundry (Pcs)',
      label: 'Laundry (Per Piece)',
      price: 0,
      description: 'Laundry service priced per piece',
    },
    {
      value: 'Dry Cleaning (Pcs)',
      label: 'Dry Cleaning (Per Piece)',
      price: 0,
      description: 'Dry cleaning service priced per piece',
    },
    {
      value: 'Pressing (Ironing)',
      label: 'Pressing (Ironing)',
      price: 0,
      description: 'Ironing service',
    },
  ];

  const handleFieldChange = (key, field, value) => {
    setCustomItemsData((prev) => {
      const newData = prev.map((item) =>
        item.key === key ? { ...item, [field]: value } : item
      );
     // console.log('Updated item field:', key, field, value);
      return newData;
    });
  };

  const handleSaveEdit = (key) => {
    const item = customItemsData.find((i) => i.key === key);
    if (!item || !item.items || item.qty <= 0 || item.price < 0) {
      message.error('Please fill in valid item name, quantity and price.');
      return;
    }
    setEditingKey('');
   // console.log('Saved item:', item);
  };

  const handleAddRow = () => {
    const newKey = Date.now().toString();
    const newItem = {
      key: newKey,
      items: '',
      description: '',
      qty: 1,
      price: 0,
    };
    setCustomItemsData((prev) => [...prev, newItem]);
    setEditingKey(newKey);
   // console.log('Added new item row:', newItem);
  };

const handleSaveAll = () => {
  if (editingKey) {
    message.warning('Please save the currently editing row first.');
    return;
  }
  const isValid = customItemsData.every(
    (item) => item.items.trim() && item.qty > 0 && item.price >= 0
  );
  if (!isValid) {
    message.error('Please check all fields before saving.');
    return;
  }

  onAddItem({ customItems: customItemsData });
  setCustomItemsData([]); // clear after save
  setEditingKey('');
  onClose(); // close modal via parent
};


const handleClose = () => {
  if (customItemsData.length > 0) {
    Modal.confirm({
      title: 'Discard unsaved changes?',
      onOk: () => {
        setCustomItemsData([]);
        setEditingKey('');
        onClose();  // this will update parent state to false
      },
      onCancel: () => {
        // do nothing, modal remains open
      },
    });
  } else {
    onClose();
  }
};




  const columns = [
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      width: 250,
      render: (text, record) => {
        const editable = isEditing(record);
        if (editable && selectedService === 'Laundry') {
          return (
            <Select
              value={record.items}
              style={{ width: '100%' }}
              placeholder="Select item"
              onChange={(value) => {
                const selected = laundryOptions.find((opt) => opt.value === value);
                handleFieldChange(record.key, 'items', value);
                handleFieldChange(record.key, 'description', selected?.description || '');
                handleFieldChange(record.key, 'price', selected?.price || 0);
              }}
            >
              {laundryOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          );
        } else if (editable) {
          return (
            <Input
              value={text}
              onChange={(e) => handleFieldChange(record.key, 'items', e.target.value)}
              placeholder="Enter item"
            />
          );
        }
        return text || 'N/A';
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={text}
            onChange={(e) => handleFieldChange(record.key, 'description', e.target.value)}
          />
        ) : (
          text
        ),
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: 80,
      render: (text, record) =>
        isEditing(record) ? (
          <InputNumber
            min={1}
            value={text}
            onChange={(value) => handleFieldChange(record.key, 'qty', value)}
            style={{ width: '100%' }}
          />
        ) : (
          text
        ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (text, record) =>
        isEditing(record) ? (
          <InputNumber
            min={0}
            value={text}
            formatter={(val) => `Rs. ${val}`}
            parser={(val) => val.replace('Rs. ', '')}
            onChange={(value) => handleFieldChange(record.key, 'price', value)}
            style={{ width: '100%' }}
          />
        ) : (
          `Rs. ${text}`
        ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
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

  return (
    <Modal
      title="Add Item"
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={1200}
    >
      <Table
        dataSource={customItemsData}
        columns={columns}
        pagination={false}
        rowKey="key"
        bordered
      />

      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
        <Button type="dashed" onClick={handleAddRow}>
          Add Row
        </Button>

        <div>
          <Button onClick={handleClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSaveAll}>
            Save All
          </Button>
        </div>
      </div>
    </Modal>
  );
}
