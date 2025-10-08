// frontend/src/Pages/Admin/ClientManagement.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClients,
  addClient,
  editClient,
  removeClient,
  clearClientError,
} from "../../Redux/Slice/clientSlice";

import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
} from "antd";
import { Plus, Edit, Trash2 } from "lucide-react";

const Clients = () => {
  const dispatch = useDispatch();
  const { clients, loading, error } = useSelector((state) => state.clients);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingClient, setEditingClient] = useState(null);

  // Load clients on mount
  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  // Show error messages
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearClientError());
    }
  }, [error, dispatch]);

  // Handle Add/Edit submit
const handleSubmit = (values) => {
  if (editingClient) {
    dispatch(editClient({ id: editingClient._id, data: values }))
      .unwrap()
      .then(() => {
        message.success("Client updated successfully");
        setIsModalOpen(false);
        setEditingClient(null);
        form.resetFields();
        dispatch(fetchClients()); // ✅ refresh list
      })
      .catch(() => message.error("Failed to update client"));
  } else {
    dispatch(addClient(values))
      .unwrap()
      .then(() => {
        message.success("Client added successfully");
        setIsModalOpen(false);
        form.resetFields();
        dispatch(fetchClients()); // ✅ refresh list
      })
      .catch(() => message.error("Failed to add client"));
  }
};


  // Handle Delete
  const handleDelete = (id) => {
    dispatch(removeClient(id))
      .unwrap()
      .then(() => message.success("Client deleted successfully"))
      .catch(() => message.error("Failed to delete client"));
  };

  // Columns
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Contact", dataIndex: "phone", key: "phone" },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<Edit size={16} />}
            onClick={() => {
              setEditingClient(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this client?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger size="small" icon={<Trash2 size={16} />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Client Management</h2>
        <Button
          type="primary"
          icon={<Plus size={18} />}
          onClick={() => {
            setEditingClient(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Add Client
        </Button>
      </div>

  <Table
  rowKey="_id"
  dataSource={Array.isArray(clients) ? [...clients] : []} // ✅ clone to force re-render
  columns={columns}
  loading={loading}
  pagination={{ pageSize: 5 }}
/>


      {/* Add/Edit Modal */}
      <Modal
        title={editingClient ? "Edit Client" : "Add Client"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingClient(null);
        }}
        onOk={() => form.submit()}
        okText={editingClient ? "Update" : "Add"}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter client name" }]}
          >
            <Input placeholder="Enter client name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item name="phone" label="Contact">
            <Input placeholder="Enter contact number" />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input placeholder="Enter address" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Clients;
