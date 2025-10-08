// frontend/src/pages/AppointmentsPage.jsx
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
} from "antd";
import {
  fetchAppointments,
  removeAppointment,
  archiveAppointmentThunk,
  editAppointment,
} from "../../Redux/Slice/appointmentSlice";

const { Option } = Select;

const AppointmentsPage = () => {
  const dispatch = useDispatch();
  const { items: appointments, loading, error } = useSelector(
    (state) => state.appointments
  );

  // UI state
  const [filterArchived, setFilterArchived] = useState("all");
  const [sortKey, setSortKey] = useState("date");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  // Fetch appointments on mount
  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  // Delete handler
  const handleDelete = (id) => {
    dispatch(removeAppointment(id));
  };

  // Archive handler
  const handleArchive = (id) => {
    dispatch(archiveAppointmentThunk(id));
  };

  // Edit handler
  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      status: record.status,
      timeSlot: record.timeSlot,
    });
    setIsEditModalVisible(true);
  };

  const handleUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        dispatch(editAppointment({ id: editingRecord._id, updates: values }));
        setIsEditModalVisible(false);
        setEditingRecord(null);
      })
      .catch((err) => console.log("Validation Failed:", err));
  };

  // Apply filters + sort
  const filteredAppointments = appointments
    .filter((appt) => {
      if (filterArchived === "archived") return appt.archived;
      if (filterArchived === "active") return !appt.archived;
      return true;
    })
    .filter((appt) => {
      const term = searchTerm.toLowerCase();
      return (
        appt.title.toLowerCase().includes(term) ||
        (appt.description && appt.description.toLowerCase().includes(term)) ||
        (appt.user?.name && appt.user.name.toLowerCase().includes(term))
      );
    })
    .sort((a, b) => {
      if (sortKey === "date") return new Date(a.date) - new Date(b.date);
      if (sortKey === "title") return a.title.localeCompare(b.title);
      if (sortKey === "status") return a.status.localeCompare(b.status);
      return 0;
    });

  // Table columns
  const columns = [
    {
      title: "User",
      dataIndex: ["user", "name"],
      key: "user",
      render: (_, record) =>
        record.user ? `${record.user.name} (${record.user.email})` : "N/A",
    },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleString(),
    },
    { title: "Time Slot", dataIndex: "timeSlot", key: "timeSlot" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`px-2 py-1 rounded-lg text-xs font-medium ${
            status === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : status === "Completed"
              ? "bg-green-100 text-green-800"
              : status === "Cancelled"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Archived",
      dataIndex: "archived",
      key: "archived",
      render: (archived) => (archived ? "Yes" : "No"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          {!record.archived && (
            <Popconfirm
              title="Archive this appointment?"
              onConfirm={() => handleArchive(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small">Archive</Button>
            </Popconfirm>
          )}
          <Popconfirm
            title="Delete permanently?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Booked Appointments</h1>

      {/* Filter & Sort Controls */}
      <div className="flex flex-wrap gap-4 mb-4">
        <Select
          value={filterArchived}
          onChange={setFilterArchived}
          style={{ width: 160 }}
        >
          <Option value="all">All</Option>
          <Option value="active">Active Only</Option>
          <Option value="archived">Archived Only</Option>
        </Select>

        <Select value={sortKey} onChange={setSortKey} style={{ width: 160 }}>
          <Option value="date">Sort by Date</Option>
          <Option value="title">Sort by Title</Option>
          <Option value="status">Sort by Status</Option>
        </Select>

        <Input.Search
          placeholder="Search appointments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      )}
      {error && <Alert message={error} type="error" className="mb-4" />}

      {!loading && !error && (
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredAppointments}
          pagination={{ pageSize: 8 }}
          scroll={{ x: "max-content" }}
        />
      )}

      {/* Edit Modal */}
      <Modal
        title="Edit Appointment"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleUpdate}
        okText="Update"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="timeSlot" label="Time Slot">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="Confirmed">Confirmed</Option>
              <Option value="Cancelled">Cancelled</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppointmentsPage;
