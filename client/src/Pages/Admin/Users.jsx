import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tag, Select, Spin, message } from "antd";
import {
  fetchAllUsers,
  updateUserRoleThunk,
} from "../../Redux/Slice/authSlice";

const { Option } = Select;

function Users() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.auth);

  // Fetch users on mount
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Handle role update
  const handleRoleChange = (id, role) => {
    dispatch(updateUserRoleThunk({ id, role }))
      .unwrap()
      .then(() => {
        message.success("✅ User role updated successfully!");
      })
      .catch((err) => {
        message.error(err || "❌ Failed to update role");
      });
  };

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role, record) => (
        <Select
          defaultValue={role}
          style={{ width: 160 }}
          onChange={(value) => handleRoleChange(record._id, value)}
        >
          <Option value="admin">Admin</Option>
          <Option value="ProjectManager">Project Manager</Option>
          <Option value="Supervisor">Supervisor</Option>
          <Option value="Worker">Worker</Option>
          <Option value="Client">Client</Option>
        </Select>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  if (loading)
    return (
      <Spin size="large" style={{ display: "block", margin: "2rem auto" }} />
    );

  if (error) return <p style={{ color: "red" }}>❌ {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>👥 Manage Users</h1>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
}

export default Users;
