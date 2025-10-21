import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tag, Select, Spin, message, Card, Input, Space, Badge, Avatar, Tooltip } from "antd";
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  HomeOutlined,
  SearchOutlined,
  CalendarOutlined,
  CrownOutlined,
  TeamOutlined
} from "@ant-design/icons";
import {
  fetchAllUsers,
  updateUserRoleThunk,
} from "../../Redux/Slice/authSlice";

const { Option } = Select;

const roleColors = {
  admin: "red",
  ProjectManager: "purple",
  Supervisor: "blue",
  Worker: "green",
  Client: "orange",
};

const roleIcons = {
  admin: <CrownOutlined />,
  ProjectManager: <TeamOutlined />,
  Supervisor: <UserOutlined />,
  Worker: <UserOutlined />,
  Client: <UserOutlined />,
};

function Users() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.auth);
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (users) {
      const filtered = users.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
          user.role?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [users, searchText]);

  const handleRoleChange = (id, role) => {
    dispatch(updateUserRoleThunk({ id, role }))
      .unwrap()
      .then(() => {
        message.success({
          content: "User role updated successfully!",
          icon: <CrownOutlined style={{ color: "#52c41a" }} />,
        });
      })
      .catch((err) => {
        message.error(err || "Failed to update role");
      });
  };

  const columns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <Avatar 
            style={{ 
              backgroundColor: roleColors[record.role] || "#1890ff",
              verticalAlign: "middle" 
            }} 
            size="large"
          >
            {text?.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, fontSize: "14px" }}>{text}</div>
            <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
              <MailOutlined /> {record.email}
            </div>
          </div>
        </Space>
      ),
      width: "30%",
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      render: (contact) => (
        <Space>
          <PhoneOutlined style={{ color: "#1890ff" }} />
          <span>{contact || "N/A"}</span>
        </Space>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address) => (
        <Space>
          <HomeOutlined style={{ color: "#52c41a" }} />
          <span>{address || "N/A"}</span>
        </Space>
      ),
      ellipsis: true,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role, record) => (
        <Select
          value={role}
          style={{ width: 170 }}
          onChange={(value) => handleRoleChange(record._id, value)}
          bordered={true}
        >
          <Option value="admin">
            <Space>
              <CrownOutlined style={{ color: roleColors.admin }} />
              <span>Admin</span>
            </Space>
          </Option>
          <Option value="ProjectManager">
            <Space>
              <TeamOutlined style={{ color: roleColors.ProjectManager }} />
              <span>Project Manager</span>
            </Space>
          </Option>
          <Option value="Supervisor">
            <Space>
              <UserOutlined style={{ color: roleColors.Supervisor }} />
              <span>Supervisor</span>
            </Space>
          </Option>
          <Option value="Worker">
            <Space>
              <UserOutlined style={{ color: roleColors.Worker }} />
              <span>Worker</span>
            </Space>
          </Option>
          <Option value="Client">
            <Space>
              <UserOutlined style={{ color: roleColors.Client }} />
              <span>Client</span>
            </Space>
          </Option>
        </Select>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag color={roleColors[record.role]} icon={roleIcons[record.role]}>
          {record.role}
        </Tag>
      ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <Tooltip title={new Date(date).toLocaleString()}>
          <Space>
            <CalendarOutlined style={{ color: "#8c8c8c" }} />
            <span>{new Date(date).toLocaleDateString()}</span>
          </Space>
        </Tooltip>
      ),
    },
  ];

  if (loading) {
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
        <p style={{ color: "#8c8c8c", fontSize: "14px" }}>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card
        style={{
          margin: "20px",
          textAlign: "center",
          borderColor: "#ff4d4f",
        }}
      >
        <p style={{ color: "#ff4d4f", fontSize: "16px", margin: 0 }}>
          ❌ {error}
        </p>
      </Card>
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
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}>
                <TeamOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
                User Management
              </h1>
              <p style={{ margin: "4px 0 0 0", color: "#8c8c8c", fontSize: "14px" }}>
                Manage roles and permissions for all users
              </p>
            </div>
            <Badge
              count={filteredUsers.length}
              showZero
              style={{
                backgroundColor: "#1890ff",
                fontSize: "16px",
                padding: "0 12px",
                height: "28px",
                lineHeight: "28px",
              }}
            />
          </div>

          <Input
            placeholder="Search by name, email, or role..."
            prefix={<SearchOutlined style={{ color: "#8c8c8c" }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ maxWidth: "400px" }}
            size="large"
            allowClear
          />
        </div>

        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
            pageSizeOptions: ["10", "20", "50"],
          }}
          style={{ background: "white" }}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
        />
      </Card>

      <style jsx>{`
        .table-row-light {
          background-color: #ffffff;
        }
        .table-row-dark {
          background-color: #fafafa;
        }
        .ant-table-tbody > tr:hover > td {
          background-color: #e6f7ff !important;
        }
      `}</style>
    </div>
  );
}

export default Users;