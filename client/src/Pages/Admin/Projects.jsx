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
import { fetchAllUsers } from "../../Redux/Slice/authSlice";
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
  Card,
  Badge,
  Avatar,
  Tooltip,
  Empty,
  Tabs,
  Row,
  Col,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  FileImageOutlined,
  SearchOutlined,
  ProjectOutlined,
  UserOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Option } = Select;
const { TabPane } = Tabs;

const Project = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.projects);
  const { clients } = useSelector((state) => state.clients);
  const { users } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchClients());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error({
        content: error,
        icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
      });
    }
  }, [error]);

  useEffect(() => {
    if (projects) {
      let filtered = Array.isArray(projects) ? projects : [];
      
      // Filter by search text
      if (searchText) {
        filtered = filtered.filter(
          (project) =>
            project.title?.toLowerCase().includes(searchText.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchText.toLowerCase()) ||
            project.client?.name?.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      
      // Filter by status
      if (statusFilter !== "All") {
        filtered = filtered.filter((project) => project.status === statusFilter);
      }
      
      setFilteredProjects(filtered);
    }
  }, [projects, searchText, statusFilter]);

  const handleAddEdit = () => {
    form.validateFields().then((values) => {
      const projectData = {
        ...values,
        startDate: values.startDate ? values.startDate.format("YYYY-MM-DD") : null,
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
          .then(() => {
            message.success({
              content: "Project updated successfully!",
              icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
            });
            dispatch(fetchProjects());
          })
          .catch((err) =>
            message.error({
              content: err || "Failed to update project",
              icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
            })
          );
      } else {
        dispatch(addProject(projectData))
          .unwrap()
          .then(() => {
            message.success({
              content: "Project added successfully!",
              icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
            });
            dispatch(fetchProjects());
          })
          .catch((err) =>
            message.error({
              content: err || "Failed to add project",
              icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
            })
          );
      }
      setIsModalOpen(false);
      setEditingProject(null);
      form.resetFields();
    });
  };

  const handleDelete = (id) => {
    dispatch(removeProject(id))
      .unwrap()
      .then(() => {
        message.success({
          content: "Project deleted successfully!",
          icon: <DeleteOutlined style={{ color: "#52c41a" }} />,
        });
        dispatch(fetchProjects());
      })
      .catch((err) =>
        message.error({
          content: err || "Failed to delete project",
          icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
        })
      );
  };

  const handleArchive = (id) => {
    dispatch(archiveProject(id))
      .unwrap()
      .then(() => {
        message.success({
          content: "Project archive status updated!",
          icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        });
        dispatch(fetchProjects());
      })
      .catch((err) =>
        message.error({
          content: err || "Failed to update archive status",
          icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
        })
      );
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

  const getStatusColor = (status) => {
    const colors = {
      Planned: "blue",
      Ongoing: "orange",
      Completed: "green",
      "On Hold": "default",
      Cancelled: "red",
    };
    return colors[status] || "default";
  };

  const getStatusIcon = (status) => {
    const icons = {
      Planned: <ClockCircleOutlined />,
      Ongoing: <ClockCircleOutlined />,
      Completed: <CheckCircleOutlined />,
      "On Hold": <ClockCircleOutlined />,
      Cancelled: <CloseCircleOutlined />,
    };
    return icons[status] || <ClockCircleOutlined />;
  };

  const columns = [
    {
      title: "Project Details",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Space size={12}>
          <Avatar
            style={{
              backgroundColor: "#1890ff",
              fontSize: "16px",
              fontWeight: 600,
            }}
            size={48}
            icon={<ProjectOutlined />}
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: "15px", marginBottom: "2px" }}>
              {text}
            </div>
            <Space size={4} style={{ fontSize: "13px", color: "#8c8c8c" }}>
              <UserOutlined />
              <span>{record.client?.name || "No client"}</span>
            </Space>
          </div>
        </Space>
      ),
      width: "25%",
    },
    {
      title: "Budget",
      dataIndex: "budget",
      key: "budget",
      render: (budget) => (
        <Space>
          <DollarOutlined style={{ color: "#52c41a" }} />
          <span style={{ fontWeight: 500, fontSize: "14px" }}>
            ${budget?.toLocaleString() || 0}
          </span>
        </Space>
      ),
    },
    {
      title: "Assigned Staff",
      dataIndex: "assignedStaff",
      key: "assignedStaff",
      render: (staff) => (
        <Space size={4}>
          <TeamOutlined style={{ color: "#1890ff" }} />
          {staff?.length > 0 ? (
            <Avatar.Group maxCount={3} size="small">
              {staff.map((s) => (
                <Tooltip key={s._id} title={s.name}>
                  <Avatar style={{ backgroundColor: "#87d068" }}>
                    {s.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </Tooltip>
              ))}
            </Avatar.Group>
          ) : (
            <span style={{ color: "#8c8c8c" }}>No staff</span>
          )}
        </Space>
      ),
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (progress) => (
        <div style={{ width: "120px" }}>
          <Progress
            percent={progress || 0}
            size="small"
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
          />
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Dates",
      key: "dates",
      render: (_, record) => (
        <div style={{ fontSize: "13px" }}>
          <div style={{ marginBottom: "2px" }}>
            <CalendarOutlined style={{ color: "#1890ff", marginRight: "4px" }} />
            {record.startDate ? moment(record.startDate).format("MMM DD, YYYY") : "N/A"}
          </div>
          {record.deadline && (
            <div style={{ color: "#8c8c8c" }}>
              Due: {moment(record.deadline).format("MMM DD, YYYY")}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size={8}>
          <Tooltip title="Edit project">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => openModal(record)}
              style={{ borderRadius: "6px" }}
            >
              Edit
            </Button>
          </Tooltip>
          <Popconfirm
            title="Delete Project"
            description={
              <div>
                <p style={{ margin: 0 }}>
                  Delete <strong>{record.title}</strong>?
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
            <Tooltip title="Delete project">
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                style={{ borderRadius: "6px" }}
              />
            </Tooltip>
          </Popconfirm>
          <Tooltip title={record.archived ? "Unarchive" : "Archive"}>
            <Button
              size="small"
              icon={<FolderOutlined />}
              onClick={() => handleArchive(record._id)}
              style={{ borderRadius: "6px" }}
            >
              {record.archived ? "Unarchive" : "Archive"}
            </Button>
          </Tooltip>
        </Space>
      ),
      width: "15%",
    },
  ];

  if (loading && !projects) {
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
        <p style={{ color: "#8c8c8c", fontSize: "14px" }}>Loading projects...</p>
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
                <ProjectOutlined style={{ color: "#1890ff", fontSize: "28px" }} />
                Project Management
              </h1>
              <p
                style={{
                  margin: "6px 0 0 0",
                  color: "#8c8c8c",
                  fontSize: "14px",
                }}
              >
                Manage and track all your construction projects
              </p>
            </div>
            <Space size={12}>
              <Badge
                count={filteredProjects.length}
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
                icon={<PlusOutlined />}
                size="large"
                onClick={() => openModal()}
                style={{
                  borderRadius: "8px",
                  fontWeight: 500,
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Add New Project
              </Button>
            </Space>
          </div>

          <Row gutter={16}>
            <Col xs={24} sm={16}>
              <Input
                placeholder="Search projects by title, description, or client..."
                prefix={<SearchOutlined style={{ color: "#8c8c8c", fontSize: "16px" }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ borderRadius: "8px" }}
                size="large"
                allowClear
              />
            </Col>
            <Col xs={24} sm={8}>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: "100%", borderRadius: "8px" }}
                size="large"
              >
                <Option value="All">All Status</Option>
                <Option value="Planned">Planned</Option>
                <Option value="Ongoing">Ongoing</Option>
                <Option value="Completed">Completed</Option>
                <Option value="On Hold">On Hold</Option>
                <Option value="Cancelled">Cancelled</Option>
              </Select>
            </Col>
          </Row>
        </div>

        <Table
          rowKey="_id"
          dataSource={filteredProjects}
          columns={columns}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} project${total !== 1 ? "s" : ""}`,
            pageSizeOptions: ["5", "10", "20", "50"],
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  searchText || statusFilter !== "All" ? (
                    <span>No projects match your filters</span>
                  ) : (
                    <span>
                      No projects yet. Click <strong>Add New Project</strong> to get started!
                    </span>
                  )
                }
              />
            ),
          }}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-even" : "table-row-odd"
          }
        />
      </Card>

      <Modal
        title={
          <Space size={10}>
            {editingProject ? (
              <EditOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
            ) : (
              <PlusOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
            )}
            <span style={{ fontSize: "18px", fontWeight: 600 }}>
              {editingProject ? "Edit Project" : "Create New Project"}
            </span>
          </Space>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingProject(null);
          form.resetFields();
        }}
        onOk={handleAddEdit}
        okText={editingProject ? "Update Project" : "Create Project"}
        confirmLoading={loading}
        width={900}
        centered
        okButtonProps={{
          style: { borderRadius: "6px", fontWeight: 500, height: "38px" },
        }}
        cancelButtonProps={{
          style: { borderRadius: "6px", height: "38px" },
        }}
      >
        <div style={{ padding: "20px 0 10px", maxHeight: "70vh", overflowY: "auto" }}>
          <Form form={form} layout="vertical">
            <Tabs defaultActiveKey="1">
              <TabPane tab={<span><ProjectOutlined /> Basic Info</span>} key="1">
                <Form.Item
                  name="title"
                  label={<span style={{ fontWeight: 500 }}>Project Title</span>}
                  rules={[{ required: true, message: "Please enter project title" }]}
                >
                  <Input
                    placeholder="Enter project title"
                    size="large"
                    style={{ borderRadius: "6px" }}
                  />
                </Form.Item>

                <Form.Item
                  name="description"
                  label={<span style={{ fontWeight: 500 }}>Description</span>}
                  rules={[{ required: true, message: "Please enter description" }]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Enter project description"
                    style={{ borderRadius: "6px", resize: "none" }}
                    showCount
                    maxLength={500}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="client"
                      label={<span style={{ fontWeight: 500 }}><UserOutlined /> Client</span>}
                      rules={[{ required: true, message: "Please select a client" }]}
                    >
                      <Select
                        placeholder="Select client"
                        size="large"
                        style={{ borderRadius: "6px" }}
                        showSearch
                        optionFilterProp="children"
                      >
                        {clients?.map((client) => (
                          <Option key={client._id} value={client._id}>
                            {client.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="budget"
                      label={<span style={{ fontWeight: 500 }}><DollarOutlined /> Budget</span>}
                      rules={[{ required: true, message: "Please enter budget" }]}
                    >
                      <InputNumber
                        prefix="$"
                        style={{ width: "100%", borderRadius: "6px" }}
                        size="large"
                        min={0}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="assignedStaff"
                  label={<span style={{ fontWeight: 500 }}><TeamOutlined /> Assigned Staff</span>}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select staff members"
                    size="large"
                    style={{ borderRadius: "6px" }}
                    showSearch
                    optionFilterProp="children"
                  >
                    {users?.map((user) => (
                      <Option key={user._id} value={user._id}>
                        {user.name} - {user.role}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="status"
                      label={<span style={{ fontWeight: 500 }}>Status</span>}
                      initialValue="Planned"
                    >
                      <Select size="large" style={{ borderRadius: "6px" }}>
                        <Option value="Planned">Planned</Option>
                        <Option value="Ongoing">Ongoing</Option>
                        <Option value="Completed">Completed</Option>
                        <Option value="On Hold">On Hold</Option>
                        <Option value="Cancelled">Cancelled</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="progress"
                      label={<span style={{ fontWeight: 500 }}>Progress (%)</span>}
                      initialValue={0}
                    >
                      <Slider
                        min={0}
                        max={100}
                        marks={{ 0: "0%", 50: "50%", 100: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab={<span><CalendarOutlined /> Timeline</span>} key="2">
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      name="startDate"
                      label={<span style={{ fontWeight: 500 }}>Start Date</span>}
                      rules={[{ required: true, message: "Please select start date" }]}
                    >
                      <DatePicker
                        style={{ width: "100%", borderRadius: "6px" }}
                        size="large"
                        format="YYYY-MM-DD"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="endDate"
                      label={<span style={{ fontWeight: 500 }}>End Date</span>}
                    >
                      <DatePicker
                        style={{ width: "100%", borderRadius: "6px" }}
                        size="large"
                        format="YYYY-MM-DD"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="deadline"
                      label={<span style={{ fontWeight: 500 }}>Deadline</span>}
                    >
                      <DatePicker
                        style={{ width: "100%", borderRadius: "6px" }}
                        size="large"
                        format="YYYY-MM-DD"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab={<span><EnvironmentOutlined /> Location</span>} key="3">
                <Form.Item
                  name="address"
                  label={<span style={{ fontWeight: 500 }}>Address</span>}
                >
                  <Input
                    placeholder="Enter street address"
                    size="large"
                    style={{ borderRadius: "6px" }}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="city"
                      label={<span style={{ fontWeight: 500 }}>City</span>}
                    >
                      <Input
                        placeholder="Enter city"
                        size="large"
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="region"
                      label={<span style={{ fontWeight: 500 }}>Region</span>}
                    >
                      <Input
                        placeholder="Enter region"
                        size="large"
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="lat"
                      label={<span style={{ fontWeight: 500 }}>Latitude</span>}
                    >
                      <InputNumber
                        placeholder="e.g., 5.6037"
                        style={{ width: "100%", borderRadius: "6px" }}
                        size="large"
                        step={0.000001}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="lng"
                      label={<span style={{ fontWeight: 500 }}>Longitude</span>}
                    >
                      <InputNumber
                        placeholder="e.g., -0.1870"
                        style={{ width: "100%", borderRadius: "6px" }}
                        size="large"
                        step={0.000001}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab={<span><FileImageOutlined /> Media & Notes</span>} key="4">
                <Form.Item
                  name="media"
                  label={<span style={{ fontWeight: 500 }}>Project Media</span>}
                >
                  <Upload.Dragger
                    listType="picture"
                    beforeUpload={() => false}
                    multiple
                    accept="image/*,video/*"
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined style={{ fontSize: "48px", color: "#1890ff" }} />
                    </p>
                    <p className="ant-upload-text" style={{ fontSize: "16px" }}>
                      Click or drag files to upload
                    </p>
                    <p className="ant-upload-hint" style={{ color: "#8c8c8c" }}>
                      Support for images and videos
                    </p>
                  </Upload.Dragger>
                </Form.Item>

                <Form.Item
                  name="notes"
                  label={<span style={{ fontWeight: 500 }}>Additional Notes</span>}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Add any additional notes or comments..."
                    style={{ borderRadius: "6px", resize: "none" }}
                    showCount
                    maxLength={1000}
                  />
                </Form.Item>
              </TabPane>
            </Tabs>
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
        .ant-tabs-tab {
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default Project;