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

  const curtainsCleaningOptions = [
    {
      value: 'Dry cleaning and pressing',
      label: 'Dry cleaning and pressing',
      price: 0,
      description: 'Professional dry cleaning and pressing for curtains',
    },
    {
      value: 'Laundry and pressing',
      label: 'Laundry and pressing',
      price: 0,
      description: 'Laundry and pressing service for washable curtains',
    },
    {
      value: 'Curtain Premium service package',
      label: 'Curtain Premium service package',
      price: 0,
      description: 'Comprehensive cleaning, pressing, and care for premium curtains',
    },
    {
      value: 'Curtain Removal',
      label: 'Curtain Removal',
      price: 0,
      description: 'Professional removal of curtains for cleaning or replacement',
    },
    {
      value: 'Curtain Installation',
      label: 'Curtain Installation',
      price: 0,
      description: 'Professional installation of curtains after cleaning or replacement',
    },
  ];

  const sofaCarpetCleaningOptions = [
    {
      value: 'Shampoo Vacuum cleaning',
      label: 'Shampoo Vacuum cleaning',
      price: 0,
      description: 'Deep shampoo and vacuum cleaning for upholstery and carpets',
    },
    {
      value: 'Sofa',
      label: 'Sofa Cleaning',
      price: 0,
      description: 'Professional cleaning for sofas, including stain removal',
    },
    {
      value: 'Mattress Cleaning with Steam',
      label: 'Mattress Cleaning with Steam',
      price: 0,
      description: 'Steam cleaning for mattresses to remove dirt and allergens',
    },
    {
      value: 'Carpet Cleaning',
      label: 'Carpet Cleaning',
      price: 0,
      description: 'Deep cleaning for carpets, including stain and odor removal',
    },
  ];

  const DomesticCleaningOptions = [
    {
      value: 'Domestic Cleaning',
      label: 'Domestic Cleaning',
      price: 0,
      description: 'Comprehensive deep cleaning for the entire house',
    },
    {
      value: 'General Cleaning',
      label: 'General Cleaning',
      price: 0,
      description: 'Standard cleaning for homes, including dusting and vacuuming',
    },
    {
      value: 'Commercial Cleaning',
      label: 'Commercial Cleaning',
      price: 0,
      description: 'Deep cleaning services for commercial spaces',
    },
    {
      value: 'Floor Cleaning',
      label: 'Floor Cleaning',
      price: 0,
      description: 'Specialized cleaning for all types of flooring',
    },
    {
      value: 'Floor - Cut and Polish',
      label: 'Floor - Cut and Polish',
      price: 0,
      description: 'Floor cutting and polishing for a shiny, restored finish',
    },
  ];

  const serviceOptions = {
    Laundry: laundryOptions,
    'Curtains Cleaning': curtainsCleaningOptions,
    'Sofa, Carpet & Interior Cleaning': sofaCarpetCleaningOptions,
    'Domestic Cleaning': DomesticCleaningOptions,
  };

  const handleFieldChange = (key, field, value) => {
    setCustomItemsData((prev) => {
      const newData = prev.map((item) =>
        item.key === key ? { ...item, [field]: value } : item
      );
      return newData;
    });
  };

  const handleSaveEdit = (key) => {
    const item = customItemsData.find((i) => i.key === key);
    if (!item || !item.items || item.qty <= 0 || item.price < 0) {
      message.error('Please select a valid item, quantity, and price.');
      return;
    }
    if (serviceOptions[selectedService] && !serviceOptions[selectedService].some((opt) => opt.value === item.items)) {
      message.error('Please select an item from the dropdown.');
      return;
    }
    setEditingKey('');
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
    setCustomItemsData([]);
    setEditingKey('');
    onClose();
  };

  const handleClose = () => {
    if (customItemsData.length > 0) {
      Modal.confirm({
        title: 'Discard unsaved changes?',
        onOk: () => {
          setCustomItemsData([]);
          setEditingKey('');
          onClose();
        },
        onCancel: () => {},
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
        const options = serviceOptions[selectedService] || [];
        if (editable && options.length > 0) {
          return (
            <Select
              value={record.items}
              style={{ width: '100%' }}
              placeholder={`Select ${selectedService} item`}
              onChange={(value) => {
                const selected = options.find((opt) => opt.value === value);
                handleFieldChange(record.key, 'items', value);
                handleFieldChange(record.key, 'description', selected?.description || '');
                handleFieldChange(record.key, 'price', selected?.price || 0);
              }}
            >
              {options.map((opt) => (
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
      title: 'Qty/Unit',
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