import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Popconfirm,
  Spin,
  Alert,
  Space,
  Select,
  Input,
  Modal,
  Form,
  Card,
  Badge,
  Avatar,
  Tooltip,
  Empty,
  Tag,
  Row,
  Col,
  message,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  InboxOutlined,
  SearchOutlined,
  PhoneOutlined,
  LaptopOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  fetchAppointments,
  removeAppointment,
  archiveAppointmentThunk,
  editAppointment,
} from "../../Redux/Slice/appointmentSlice";
import moment from "moment";

const { Option } = Select;

const AppointmentsPage = () => {
  const dispatch = useDispatch();
  const { items: appointments, loading, error } = useSelector(
    (state) => state.appointments
  );

  const [filterArchived, setFilterArchived] = useState("active");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortKey, setSortKey] = useState("date");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error({
        content: error,
        icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
      });
    }
  }, [error]);

  const handleDelete = (id) => {
    dispatch(removeAppointment(id))
      .unwrap()
      .then(() =>
        message.success({
          content: "Appointment deleted successfully!",
          icon: <DeleteOutlined style={{ color: "#52c41a" }} />,
        })
      )
      .catch((err) =>
        message.error({
          content: err || "Failed to delete appointment",
          icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
        })
      );
  };

  const handleArchive = (id) => {
    dispatch(archiveAppointmentThunk(id))
      .unwrap()
      .then(() =>
        message.success({
          content: "Appointment archived successfully!",
          icon: <InboxOutlined style={{ color: "#52c41a" }} />,
        })
      )
      .catch((err) =>
        message.error({
          content: err || "Failed to archive appointment",
          icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
        })
      );
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      status: record.status,
      timeSlot: record.timeSlot,
      contactNumber: record.contactNumber,
      notes: record.notes?.[record.notes.length - 1]?.text || "",
    });
    setIsEditModalVisible(true);
  };

  const handleUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        dispatch(editAppointment({ id: editingRecord._id, updates: values }))
          .unwrap()
          .then(() => {
            message.success({
              content: "Appointment updated successfully!",
              icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
            });
            setIsEditModalVisible(false);
            setEditingRecord(null);
            dispatch(fetchAppointments());
          })
          .catch((err) =>
            message.error({
              content: err || "Failed to update appointment",
              icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
            })
          );
      })
      .catch((err) => console.log("Validation Failed:", err));
  };

  const getStatusConfig = (status) => {
    const configs = {
      Pending: {
        color: "warning",
        icon: <ClockCircleOutlined />,
        bgColor: "#fff7e6",
        textColor: "#fa8c16",
      },
      Confirmed: {
        color: "processing",
        icon: <CheckCircleOutlined />,
        bgColor: "#e6f7ff",
        textColor: "#1890ff",
      },
      Completed: {
        color: "success",
        icon: <CheckCircleOutlined />,
        bgColor: "#f6ffed",
        textColor: "#52c41a",
      },
      Cancelled: {
        color: "error",
        icon: <CloseCircleOutlined />,
        bgColor: "#fff1f0",
        textColor: "#ff4d4f",
      },
    };
    return configs[status] || configs.Pending;
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const filteredAppointments = appointments
    .filter((appt) => {
      if (filterArchived === "archived") return appt.archived;
      if (filterArchived === "active") return !appt.archived;
      return true;
    })
    .filter((appt) => {
      if (filterStatus !== "All") return appt.status === filterStatus;
      return true;
    })
    .filter((appt) => {
      const term = searchTerm.toLowerCase();
      return (
        appt.user?.name?.toLowerCase().includes(term) ||
        appt.user?.email?.toLowerCase().includes(term) ||
        appt.contactNumber?.toLowerCase().includes(term) ||
        appt.location?.address?.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (sortKey === "date") return new Date(a.date) - new Date(b.date);
      if (sortKey === "status") return a.status.localeCompare(b.status);
      return 0;
    });

  const columns = [
    {
      title: "Client Information",
      key: "client",
      render: (_, record) => (
        <Space size={12}>
          <Avatar
            style={{
              backgroundColor: "#1890ff",
              fontWeight: 600,
              fontSize: "16px",
            }}
            size={48}
          >
            {getInitials(record.user?.name)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, fontSize: "15px", marginBottom: "2px" }}>
              {record.user?.name || "Unknown User"}
            </div>
            <Space size={8} style={{ fontSize: "13px", color: "#8c8c8c" }}>
              <UserOutlined />
              <span>{record.user?.email || "No email"}</span>
            </Space>
            {record.contactNumber && (
              <div style={{ fontSize: "13px", color: "#8c8c8c", marginTop: "2px" }}>
                <PhoneOutlined style={{ marginRight: "4px" }} />
                {record.contactNumber}
              </div>
            )}
          </div>
        </Space>
      ),
      width: "25%",
    },
    {
      title: "Appointment Details",
      key: "details",
      render: (_, record) => (
        <div>
          <Space size={8} style={{ marginBottom: "6px" }}>
            <CalendarOutlined style={{ color: "#1890ff" }} />
            <span style={{ fontWeight: 500 }}>
              {moment(record.date).format("MMM DD, YYYY")}
            </span>
          </Space>
          <div>
            <Space size={8}>
              <ClockCircleOutlined style={{ color: "#52c41a" }} />
              <span style={{ fontSize: "13px", color: "#595959" }}>
                {record.timeSlot}
              </span>
            </Space>
          </div>
          {record.location?.address && (
            <div style={{ marginTop: "6px" }}>
              <Space size={8}>
                <EnvironmentOutlined style={{ color: "#fa8c16" }} />
                <Tooltip title={`${record.location.address}, ${record.location.city || ""}`}>
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#8c8c8c",
                      maxWidth: "200px",
                      display: "inline-block",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {record.location.address}
                  </span>
                </Tooltip>
              </Space>
            </div>
          )}
        </div>
      ),
      width: "25%",
    },
    {
  title: "Mode",
  dataIndex: "mode",
  key: "mode",
  render: (mode) => {
    const color = mode === "In-Person" ? "green" : mode === "Virtual" ? "blue" : "default";
    const icon = mode === "In-Person" ? <TeamOutlined /> : <LaptopOutlined />;

    return (
      <Space size={6}>
        {icon}
        <span style={{ 
          color: color === "green" ? "#52c41a" : "#1890ff", 
          fontWeight: 500 
        }}>
          {mode || "Not specified"}
        </span>
      </Space>
    );
  },
}
,
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon} style={{ fontWeight: 500 }}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size={8}>
          <Tooltip title="Edit appointment">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ borderRadius: "6px" }}
            >
              Edit
            </Button>
          </Tooltip>
          {!record.archived && (
            <Popconfirm
              title="Archive Appointment"
              description="Are you sure you want to archive this appointment?"
              onConfirm={() => handleArchive(record._id)}
              okText="Yes, Archive"
              cancelText="Cancel"
              icon={<InboxOutlined style={{ color: "#fa8c16" }} />}
            >
              <Tooltip title="Archive appointment">
                <Button
                  size="small"
                  icon={<InboxOutlined />}
                  style={{ borderRadius: "6px" }}
                />
              </Tooltip>
            </Popconfirm>
          )}
          <Popconfirm
            title="Delete Appointment"
            description={
              <div>
                <p style={{ margin: 0 }}>
                  Delete appointment with <strong>{record.user?.name}</strong>?
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
            <Tooltip title="Delete appointment">
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                style={{ borderRadius: "6px" }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
      width: "15%",
    },
  ];

  const statusCounts = {
    All: appointments.filter((a) => !a.archived).length,
    Pending: appointments.filter((a) => a.status === "Pending" && !a.archived).length,
    Confirmed: appointments.filter((a) => a.status === "Confirmed" && !a.archived).length,
    Completed: appointments.filter((a) => a.status === "Completed" && !a.archived).length,
    Cancelled: appointments.filter((a) => a.status === "Cancelled" && !a.archived).length,
  };

  if (loading && !appointments.length) {
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
        <p style={{ color: "#8c8c8c", fontSize: "14px" }}>Loading appointments...</p>
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
                <CalendarOutlined style={{ color: "#1890ff", fontSize: "28px" }} />
                Appointments Management
              </h1>
              <p
                style={{
                  margin: "6px 0 0 0",
                  color: "#8c8c8c",
                  fontSize: "14px",
                }}
              >
                Manage and track all client appointments
              </p>
            </div>
            <Badge
              count={filteredAppointments.length}
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
          </div>

          {/* Status Summary Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Card
                size="small"
                style={{
                  borderRadius: "8px",
                  background: "#e6f7ff",
                  borderColor: "#91d5ff",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: 600, color: "#1890ff" }}>
                    {statusCounts.All}
                  </div>
                  <div style={{ fontSize: "13px", color: "#595959" }}>Total Active</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Card
                size="small"
                style={{
                  borderRadius: "8px",
                  background: "#fff7e6",
                  borderColor: "#ffd591",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: 600, color: "#fa8c16" }}>
                    {statusCounts.Pending}
                  </div>
                  <div style={{ fontSize: "13px", color: "#595959" }}>Pending</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Card
                size="small"
                style={{
                  borderRadius: "8px",
                  background: "#e6f7ff",
                  borderColor: "#91d5ff",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: 600, color: "#1890ff" }}>
                    {statusCounts.Confirmed}
                  </div>
                  <div style={{ fontSize: "13px", color: "#595959" }}>Confirmed</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Card
                size="small"
                style={{
                  borderRadius: "8px",
                  background: "#f6ffed",
                  borderColor: "#b7eb8f",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: 600, color: "#52c41a" }}>
                    {statusCounts.Completed}
                  </div>
                  <div style={{ fontSize: "13px", color: "#595959" }}>Completed</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Card
                size="small"
                style={{
                  borderRadius: "8px",
                  background: "#fff1f0",
                  borderColor: "#ffccc7",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: 600, color: "#ff4d4f" }}>
                    {statusCounts.Cancelled}
                  </div>
                  <div style={{ fontSize: "13px", color: "#595959" }}>Cancelled</div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Filters */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Select
                value={filterStatus}
                onChange={setFilterStatus}
                style={{ width: "100%", borderRadius: "8px" }}
                size="large"
              >
                <Option value="All">All Status</Option>
                <Option value="Pending">Pending</Option>
                <Option value="Confirmed">Confirmed</Option>
                <Option value="Completed">Completed</Option>
                <Option value="Cancelled">Cancelled</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                value={filterArchived}
                onChange={setFilterArchived}
                style={{ width: "100%", borderRadius: "8px" }}
                size="large"
              >
                <Option value="active">Active Only</Option>
                <Option value="all">All Appointments</Option>
                <Option value="archived">Archived Only</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                value={sortKey}
                onChange={setSortKey}
                style={{ width: "100%", borderRadius: "8px" }}
                size="large"
              >
                <Option value="date">Sort by Date</Option>
                <Option value="status">Sort by Status</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Search appointments..."
                prefix={<SearchOutlined style={{ color: "#8c8c8c", fontSize: "16px" }} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderRadius: "8px" }}
                size="large"
                allowClear
              />
            </Col>
          </Row>
        </div>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredAppointments}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} appointment${
                total !== 1 ? "s" : ""
              }`,
            pageSizeOptions: ["5", "10", "20", "50"],
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  searchTerm || filterStatus !== "All" || filterArchived !== "active" ? (
                    <span>No appointments match your filters</span>
                  ) : (
                    <span>No appointments scheduled yet</span>
                  )
                }
              />
            ),
          }}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-even" : "table-row-odd"
          }
          scroll={{ x: "max-content" }}
        />
      </Card>

      {/* Edit Modal */}
      <Modal
        title={
          <Space size={10}>
            <EditOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
            <span style={{ fontSize: "18px", fontWeight: 600 }}>
              Edit Appointment
            </span>
          </Space>
        }
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingRecord(null);
          form.resetFields();
        }}
        onOk={handleUpdate}
        okText="Update Appointment"
        confirmLoading={loading}
        width={600}
        centered
        okButtonProps={{
          style: { borderRadius: "6px", fontWeight: 500, height: "38px" },
        }}
        cancelButtonProps={{
          style: { borderRadius: "6px", height: "38px" },
        }}
      >
        <div style={{ padding: "20px 0 10px" }}>
          <Form form={form} layout="vertical">
            <Form.Item
              name="timeSlot"
              label={
                <span style={{ fontWeight: 500 }}>
                  <ClockCircleOutlined style={{ marginRight: "6px" }} />
                  Time Slot
                </span>
              }
              rules={[{ required: true, message: "Please enter time slot" }]}
            >
              <Input
                placeholder="e.g., 10:00 AM - 11:00 AM"
                size="large"
                style={{ borderRadius: "6px" }}
              />
            </Form.Item>

            <Form.Item
              name="contactNumber"
              label={
                <span style={{ fontWeight: 500 }}>
                  <PhoneOutlined style={{ marginRight: "6px" }} />
                  Contact Number
                </span>
              }
            >
              <Input
                placeholder="Enter contact number"
                size="large"
                prefix={<PhoneOutlined style={{ color: "#bfbfbf" }} />}
                style={{ borderRadius: "6px" }}
              />
            </Form.Item>

            <Form.Item
              name="status"
              label={
                <span style={{ fontWeight: 500 }}>
                  <ExclamationCircleOutlined style={{ marginRight: "6px" }} />
                  Status
                </span>
              }
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select size="large" style={{ borderRadius: "6px" }}>
                <Option value="Pending">
                  <Space>
                    <ClockCircleOutlined style={{ color: "#fa8c16" }} />
                    Pending
                  </Space>
                </Option>
                <Option value="Confirmed">
                  <Space>
                    <CheckCircleOutlined style={{ color: "#1890ff" }} />
                    Confirmed
                  </Space>
                </Option>
                <Option value="Completed">
                  <Space>
                    <CheckCircleOutlined style={{ color: "#52c41a" }} />
                    Completed
                  </Space>
                </Option>
                <Option value="Cancelled">
                  <Space>
                    <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
                    Cancelled
                  </Space>
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="notes"
              label={
                <span style={{ fontWeight: 500 }}>
                  <FileTextOutlined style={{ marginRight: "6px" }} />
                  Notes
                </span>
              }
            >
              <Input.TextArea
                rows={4}
                placeholder="Add any notes or comments..."
                style={{ borderRadius: "6px", resize: "none" }}
                showCount
                maxLength={500}
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

export default AppointmentsPage;