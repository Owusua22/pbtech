import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  addProject,
  editProject,
  removeProject,
  archiveProject,
} from "../../Redux/Slice/projectSlice";
import { fetchClients } from "../../Redux/Slice/clientSlice";
import { fetchAllUsers } from "../../Redux/Slice/authSlice"; // staff/users
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Progress,
  Popconfirm,
  message,
  Space,
  Tag,
  InputNumber,
  Upload,
  Slider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";

const { Option } = Select;

const Project = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.projects);
  const { clients } = useSelector((state) => state.clients);
  const { users } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchClients());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleAddEdit = () => {
    form.validateFields().then((values) => {
      const projectData = {
        ...values,
        startDate: values.startDate.format("YYYY-MM-DD"),
        endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
        deadline: values.deadline ? values.deadline.format("YYYY-MM-DD") : null,
        location: {
          address: values.address,
          city: values.city,
          region: values.region,
          gps: {
            lat: values.lat,
            lng: values.lng,
          },
        },
        media: values.media?.fileList?.map((f) => ({
          url: f.url || URL.createObjectURL(f.originFileObj),
          type: f.type?.includes("video") ? "video" : "image",
        })),
      };

      if (editingProject) {
        dispatch(editProject({ id: editingProject._id, projectData }))
          .unwrap()
          .then(() => message.success("Project updated successfully"))
          .catch((err) => message.error(err));
      } else {
        dispatch(addProject(projectData))
          .unwrap()
          .then(() => message.success("Project added successfully"))
          .catch((err) => message.error(err));
      }
      setIsModalOpen(false);
      setEditingProject(null);
      form.resetFields();
    });
  };

  const handleDelete = (id) => {
    dispatch(removeProject(id))
      .unwrap()
      .then(() => message.success("Project deleted"))
      .catch((err) => message.error(err));
  };

  const handleArchive = (id) => {
    dispatch(archiveProject(id))
      .unwrap()
      .then(() => message.success("Project archive status updated"))
      .catch((err) => message.error(err));
  };

  const openModal = (project = null) => {
    setEditingProject(project);
    if (project) {
      form.setFieldsValue({
        ...project,
        client: project.client?._id,
        assignedStaff: project.assignedStaff?.map((s) => s._id),
        startDate: project.startDate ? moment(project.startDate) : null,
        endDate: project.endDate ? moment(project.endDate) : null,
        deadline: project.deadline ? moment(project.deadline) : null,
        address: project.location?.address,
        city: project.location?.city,
        region: project.location?.region,
        lat: project.location?.gps?.lat,
        lng: project.location?.gps?.lng,
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Client", dataIndex: ["client", "name"], key: "client" },
    { title: "Budget", dataIndex: "budget", key: "budget", render: (b) => `$${b}` },
    {
      title: "Assigned Staff",
      dataIndex: "assignedStaff",
      key: "assignedStaff",
      render: (staff) =>
        staff?.length > 0 ? staff.map((s) => <Tag key={s._id}>{s.name}</Tag>) : "—",
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (progress) => <Progress percent={progress} size="small" />,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color="blue">{status}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => openModal(record)} type="link">
            Edit
          </Button>
          <Popconfirm title="Delete project?" onConfirm={() => handleDelete(record._id)}>
            <Button danger type="link">
              Delete
            </Button>
          </Popconfirm>
          <Button onClick={() => handleArchive(record._id)} type="link">
            {record.archived ? "Unarchive" : "Archive"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Button type="primary" onClick={() => openModal()}>
        Add Project
      </Button>

      <Table
        dataSource={projects}
        columns={columns}
        rowKey="_id"
        loading={loading}
        className="mt-4"
      />

      <Modal
        title={editingProject ? "Edit Project" : "Add Project"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddEdit}
        okText={editingProject ? "Update" : "Create"}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="client" label="Client" rules={[{ required: true }]}>
            <Select placeholder="Select client">
              {clients.map((client) => (
                <Option key={client._id} value={client._id}>
                  {client.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="assignedStaff" label="Assigned Staff">
            <Select mode="multiple" placeholder="Select staff">
              {users.map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="budget" label="Budget" rules={[{ required: true }]}>
            <InputNumber prefix="$" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select>
              <Option value="Planned">Planned</Option>
              <Option value="Ongoing">Ongoing</Option>
              <Option value="Completed">Completed</Option>
              <Option value="On Hold">On Hold</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </Form.Item>
          <Form.Item name="progress" label="Progress">
            <Slider min={0} max={100} />
          </Form.Item>

          {/* Location */}
          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>
          <Form.Item name="city" label="City">
            <Input />
          </Form.Item>
          <Form.Item name="region" label="Region">
            <Input />
          </Form.Item>
          <Form.Item name="lat" label="Latitude">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="lng" label="Longitude">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          {/* Dates */}
          <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="endDate" label="End Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="deadline" label="Deadline">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          {/* Media Upload */}
          <Form.Item name="media" label="Media">
            <Upload listType="picture" beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          {/* Notes */}
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={2} placeholder="Add any notes here" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Project;


