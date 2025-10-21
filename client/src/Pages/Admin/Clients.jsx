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
  Card,
  Badge,
  Avatar,
  Tooltip,
  Empty,
  Tag,
  Spin,
} from "antd";
import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  SearchOutlined,
  UserOutlined,
  TeamOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const Clients = () => {
  const dispatch = useDispatch();
  const { clients, loading, error } = useSelector((state) => state.clients);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingClient, setEditingClient] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error({
        content: error,
        icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
      });
      dispatch(clearClientError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (clients) {
      const filtered = Array.isArray(clients)
        ? clients.filter(
            (client) =>
              client.name?.toLowerCase().includes(searchText.toLowerCase()) ||
              client.email?.toLowerCase().includes(searchText.toLowerCase()) ||
              client.phone?.toLowerCase().includes(searchText.toLowerCase()) ||
              client.address?.toLowerCase().includes(searchText.toLowerCase())
          )
        : [];
      setFilteredClients(filtered);
    }
  }, [clients, searchText]);

  const handleSubmit = (values) => {
    if (editingClient) {
      dispatch(editClient({ id: editingClient._id, data: values }))
        .unwrap()
        .then(() => {
          message.success({
            content: "Client updated successfully!",
            icon: <EditOutlined style={{ color: "#52c41a" }} />,
          });
          setIsModalOpen(false);
          setEditingClient(null);
          form.resetFields();
          dispatch(fetchClients());
        })
        .catch((err) =>
          message.error({
            content: err || "Failed to update client",
            icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
          })
        );
    } else {
      dispatch(addClient(values))
        .unwrap()
        .then(() => {
          message.success({
            content: "Client added successfully!",
            icon: <UserAddOutlined style={{ color: "#52c41a" }} />,
          });
          setIsModalOpen(false);
          form.resetFields();
          dispatch(fetchClients());
        })
        .catch((err) =>
          message.error({
            content: err || "Failed to add client",
            icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
          })
        );
    }
  };

  const handleDelete = (id) => {
    dispatch(removeClient(id))
      .unwrap()
      .then(() =>
        message.success({
          content: "Client deleted successfully!",
          icon: <DeleteOutlined style={{ color: "#52c41a" }} />,
        })
      )
      .catch((err) =>
        message.error({
          content: err || "Failed to delete client",
          icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
        })
      );
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      "#1890ff",
      "#52c41a",
      "#fa8c16",
      "#eb2f96",
      "#722ed1",
      "#13c2c2",
    ];
    const hash = name?.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return colors[hash % colors.length];
  };

  const columns = [
    {
      title: "Client Information",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space size={12}>
          <Avatar
            style={{
              backgroundColor: getAvatarColor(text),
              fontWeight: 600,
              fontSize: "16px",
            }}
            size={48}
          >
            {getInitials(text)}
          </Avatar>
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: "15px",
                marginBottom: "2px",
              }}
            >
              {text}
            </div>
            <Space size={4} style={{ fontSize: "13px", color: "#8c8c8c" }}>
              <MailOutlined />
              <span>{record.email}</span>
            </Space>
          </div>
        </Space>
      ),
      width: "35%",
    },
    {
      title: "Contact Details",
      key: "contact",
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Space size={8}>
            <PhoneOutlined style={{ color: "#1890ff" }} />
            <span>{record.phone || "Not provided"}</span>
          </Space>
          <Space size={8}>
            <HomeOutlined style={{ color: "#52c41a" }} />
            <Tooltip title={record.address}>
              <span
                style={{
                  maxWidth: "250px",
                  display: "inline-block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {record.address || "Not provided"}
              </span>
            </Tooltip>
          </Space>
        </Space>
      ),
      width: "35%",
    },
    {
      title: "Status",
      key: "status",
      render: () => (
        <Tag color="success" style={{ fontWeight: 500 }}>
          Active
        </Tag>
      ),
      width: "12%",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size={8}>
          <Tooltip title="Edit client details">
            <Button
              type="primary"
              size="middle"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingClient(record);
                form.setFieldsValue(record);
                setIsModalOpen(true);
              }}
              style={{
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Edit
            </Button>
          </Tooltip>
          <Popconfirm
            title="Delete Client"
            description={
              <div>
                <p style={{ margin: 0 }}>
                  Are you sure you want to delete <strong>{record.name}</strong>?
                </p>
                <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#8c8c8c" }}>
                  This action cannot be undone.
                </p>
              </div>
            }
            onConfirm={() => handleDelete(record._id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
          >
            <Tooltip title="Delete client">
              <Button
                danger
                size="middle"
                icon={<DeleteOutlined />}
                style={{
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Delete
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
      width: "18%",
    },
  ];

  if (loading && !clients) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Spin size="large" />
        <p style={{ color: "#8c8c8c", fontSize: "14px" }}>Loading clients...</p>
      </div>
    );
  }

  return (
    <div >
      <Card
      
      >
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "26px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <TeamOutlined style={{ color: "#1890ff", fontSize: "28px" }} />
                Client Management
              </h1>
              <p
                style={{
                  margin: "6px 0 0 0",
                  color: "#8c8c8c",
                  fontSize: "14px",
                }}
              >
                Manage your clients and their contact information
              </p>
            </div>
            <Space size={12}>
              <Badge
                count={filteredClients.length}
                showZero
                style={{
                  backgroundColor: "#1890ff",
                  fontSize: "15px",
                  fontWeight: 500,
                  padding: "0 12px",
                  height: "28px",
                  lineHeight: "28px",
                  borderRadius: "14px",
                }}
                overflowCount={999}
              />
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                size="large"
                onClick={() => {
                  setEditingClient(null);
                  form.resetFields();
                  setIsModalOpen(true);
                }}
                style={{
                  borderRadius: "8px",
                  fontWeight: 500,
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Add New Client
              </Button>
            </Space>
          </div>

          <Input
            placeholder="Search clients by name, email, phone, or address..."
            prefix={<SearchOutlined style={{ color: "#8c8c8c", fontSize: "16px" }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              maxWidth: "550px",
              borderRadius: "8px",
            }}
            size="large"
            allowClear
          />
        </div>

        <Table
          rowKey="_id"
          dataSource={filteredClients}
          columns={columns}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} client${total !== 1 ? "s" : ""}`,
            pageSizeOptions: ["5", "10", "20", "50"],
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  searchText ? (
                    <span>
                      No clients match "<strong>{searchText}</strong>"
                    </span>
                  ) : (
                    <span>
                      No clients yet. Click <strong>Add New Client</strong> to get
                      started!
                    </span>
                  )
                }
              />
            ),
          }}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-even" : "table-row-odd"
          }
          style={{
            background: "white",
          }}
        />
      </Card>

      <Modal
        title={
          <Space size={10}>
            {editingClient ? (
              <EditOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
            ) : (
              <UserAddOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
            )}
            <span style={{ fontSize: "18px", fontWeight: 600 }}>
              {editingClient ? "Edit Client Details" : "Add New Client"}
            </span>
          </Space>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingClient(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={editingClient ? "Update Client" : "Add Client"}
        confirmLoading={loading}
        width={640}
        centered
        okButtonProps={{
          style: {
            borderRadius: "6px",
            fontWeight: 500,
            height: "38px",
          },
        }}
        cancelButtonProps={{
          style: { borderRadius: "6px", height: "38px" },
        }}
      >
        <div style={{ padding: "20px 0 10px" }}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="name"
              label={
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                  <UserOutlined style={{ marginRight: "6px" }} />
                  Full Name
                </span>
              }
              rules={[
                { required: true, message: "Please enter the client's name" },
                { min: 2, message: "Name must be at least 2 characters" },
              ]}
            >
              <Input
                placeholder="Enter client's full name"
                size="large"
                prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                style={{ borderRadius: "6px" }}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                  <MailOutlined style={{ marginRight: "6px" }} />
                  Email Address
                </span>
              }
              rules={[
                { required: true, message: "Please enter email address" },
                { type: "email", message: "Please enter a valid email address" },
              ]}
            >
              <Input
                placeholder="client@example.com"
                size="large"
                prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
                style={{ borderRadius: "6px" }}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label={
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                  <PhoneOutlined style={{ marginRight: "6px" }} />
                  Contact Number
                </span>
              }
              rules={[
                { pattern: /^[0-9+\-\s()]*$/, message: "Please enter a valid phone number" },
              ]}
            >
              <Input
                placeholder="Enter contact number"
                size="large"
                prefix={<PhoneOutlined style={{ color: "#bfbfbf" }} />}
                style={{ borderRadius: "6px" }}
              />
            </Form.Item>

            <Form.Item
              name="address"
              label={
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                  <HomeOutlined style={{ marginRight: "6px" }} />
                  Address
                </span>
              }
            >
              <Input.TextArea
                placeholder="Enter complete address"
                rows={3}
                style={{ resize: "none", borderRadius: "6px" }}
                showCount
                maxLength={200}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>

      <style>{`
        .table-row-even {
          background-color: #ffffff;
        }
        .table-row-odd {
          background-color: #fafafa;
        }
        .ant-table-tbody > tr:hover > td {
          background-color: #e6f7ff !important;
        }
        .ant-table-thead > tr > th {
          background-color: #fafafa;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default Clients;