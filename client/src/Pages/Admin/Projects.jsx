// frontend/src/pages/admin/Project.jsx
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
  Divider,
  Image,
  Descriptions,
  Timeline,
  Statistic,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  TeamOutlined,
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
  EyeOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  FileTextOutlined,
  HistoryOutlined,
  DollarOutlined,
  RiseOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Option } = Select;
const { TabPane } = Tabs;

// Ghana Cedis formatter
const formatCedis = (amount) => {
  if (!amount && amount !== 0) return "GH₵ 0.00";
  return `GH₵ ${amount.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Cedis Icon Component
const CedisIcon = ({ style }) => (
  <span style={{ fontWeight: 600, fontSize: "14px", ...style }}>GH₵</span>
);

const Project = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.projects);
  const { clients } = useSelector((state) => state.clients);
  const { users } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
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

      if (searchText) {
        filtered = filtered.filter(
          (project) =>
            project.title?.toLowerCase().includes(searchText.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchText.toLowerCase()) ||
            project.client?.name?.toLowerCase().includes(searchText.toLowerCase())
        );
      }

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

  const openDetailModal = (project) => {
    setViewingProject(project);
    setIsDetailModalOpen(true);
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
      Ongoing: <RiseOutlined />,
      Completed: <CheckCircleOutlined />,
      "On Hold": <ClockCircleOutlined />,
      Cancelled: <CloseCircleOutlined />,
    };
    return icons[status] || <ClockCircleOutlined />;
  };

  const getProgressStatus = (progress) => {
    if (progress >= 100) return "success";
    if (progress > 0) return "active";
    return "normal";
  };

  // Calculate project statistics
  const getProjectStats = () => {
    const allProjects = Array.isArray(projects) ? projects : [];
    const totalBudget = allProjects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const avgProgress =
      allProjects.length > 0
        ? Math.round(allProjects.reduce((sum, p) => sum + (p.progress || 0), 0) / allProjects.length)
        : 0;
    const completed = allProjects.filter((p) => p.status === "Completed").length;
    const ongoing = allProjects.filter((p) => p.status === "Ongoing").length;

    return { totalBudget, avgProgress, completed, ongoing, total: allProjects.length };
  };

  const stats = getProjectStats();

  const columns = [
    {
      title: "Project Details",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Space size={12}>
          <Avatar
            style={{
              backgroundColor: record.archived ? "#d9d9d9" : "#1890ff",
              fontSize: "16px",
              fontWeight: 600,
            }}
            size={48}
            icon={<ProjectOutlined />}
          />
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: "15px",
                marginBottom: "2px",
                cursor: "pointer",
                color: "#1890ff",
              }}
              onClick={() => openDetailModal(record)}
            >
              {text}
              {record.archived && (
                <Tag color="default" style={{ marginLeft: 8, fontSize: "11px" }}>
                  Archived
                </Tag>
              )}
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
          <CedisIcon style={{ color: "#52c41a" }} />
          <span style={{ fontWeight: 500, fontSize: "14px" }}>
            {budget?.toLocaleString("en-GH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) || "0.00"}
          </span>
        </Space>
      ),
      sorter: (a, b) => (a.budget || 0) - (b.budget || 0),
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
            status={getProgressStatus(progress)}
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
          />
        </div>
      ),
      sorter: (a, b) => (a.progress || 0) - (b.progress || 0),
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
      filters: [
        { text: "Planned", value: "Planned" },
        { text: "Ongoing", value: "Ongoing" },
        { text: "Completed", value: "Completed" },
        { text: "On Hold", value: "On Hold" },
        { text: "Cancelled", value: "Cancelled" },
      ],
      onFilter: (value, record) => record.status === value,
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
            <div
              style={{
                color: moment(record.deadline).isBefore(moment()) ? "#ff4d4f" : "#8c8c8c",
              }}
            >
              Due: {moment(record.deadline).format("MMM DD, YYYY")}
              {moment(record.deadline).isBefore(moment()) && (
                <Tag color="red" style={{ marginLeft: 4, fontSize: "10px" }}>
                  Overdue
                </Tag>
              )}
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
          <Tooltip title="View details">
            <Button
              type="default"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => openDetailModal(record)}
              style={{ borderRadius: "6px" }}
            />
          </Tooltip>
          <Tooltip title="Edit project">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => openModal(record)}
              style={{ borderRadius: "6px" }}
            />
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
              <Button danger size="small" icon={<DeleteOutlined />} style={{ borderRadius: "6px" }} />
            </Tooltip>
          </Popconfirm>
          <Tooltip title={record.archived ? "Unarchive" : "Archive"}>
            <Button
              size="small"
              icon={<FolderOutlined />}
              onClick={() => handleArchive(record._id)}
              style={{ borderRadius: "6px" }}
            />
          </Tooltip>
        </Space>
      ),
      width: "18%",
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
    <div>
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "12px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={<span style={{ color: "rgba(255,255,255,0.85)" }}>Total Projects</span>}
              value={stats.total}
              valueStyle={{ color: "#fff", fontSize: "28px", fontWeight: 600 }}
              prefix={<ProjectOutlined style={{ marginRight: 8 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "12px",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={<span style={{ color: "rgba(255,255,255,0.85)" }}>Total Budget</span>}
              value={stats.totalBudget}
              precision={2}
              valueStyle={{ color: "#fff", fontSize: "28px", fontWeight: 600 }}
              prefix={<span style={{ marginRight: 8 }}>GH₵</span>}
              formatter={(value) => value.toLocaleString("en-GH")}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "12px",
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={<span style={{ color: "rgba(255,255,255,0.85)" }}>Ongoing Projects</span>}
              value={stats.ongoing}
              valueStyle={{ color: "#fff", fontSize: "28px", fontWeight: 600 }}
              prefix={<RiseOutlined style={{ marginRight: 8 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "12px",
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={<span style={{ color: "rgba(255,255,255,0.85)" }}>Completed</span>}
              value={stats.completed}
              valueStyle={{ color: "#fff", fontSize: "28px", fontWeight: 600 }}
              prefix={<CheckCircleOutlined style={{ marginRight: 8 }} />}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: "12px" }}>
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
              <p style={{ margin: "6px 0 0 0", color: "#8c8c8c", fontSize: "14px" }}>
                Manage and track all your construction projects • Currency: Ghana Cedis (GH₵)
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
            `${index % 2 === 0 ? "table-row-even" : "table-row-odd"} ${
              record.archived ? "archived-row" : ""
            }`
          }
        />
      </Card>

      {/* Project Details Modal */}
      <Modal
        title={null}
        open={isDetailModalOpen}
        onCancel={() => {
          setIsDetailModalOpen(false);
          setViewingProject(null);
        }}
        footer={null}
        width={900}
        centered
        bodyStyle={{ padding: 0 }}
      >
        {viewingProject && (
          <div>
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #1a365d 0%, #2d3748 100%)",
                padding: "24px 32px",
                color: "#fff",
              }}
            >
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => setIsDetailModalOpen(false)}
                style={{ color: "#fff", marginBottom: 16, padding: 0 }}
              >
                Back to Projects
              </Button>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <Avatar
                  size={64}
                  style={{ backgroundColor: "#ed8936", fontSize: 24 }}
                  icon={<ProjectOutlined />}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
                      {viewingProject.title}
                    </h2>
                    <Tag
                      color={getStatusColor(viewingProject.status)}
                      icon={getStatusIcon(viewingProject.status)}
                      style={{ fontSize: 13 }}
                    >
                      {viewingProject.status}
                    </Tag>
                    {viewingProject.archived && (
                      <Tag color="default">Archived</Tag>
                    )}
                  </div>
                  <p style={{ margin: "8px 0 0 0", color: "rgba(255,255,255,0.7)" }}>
                    {viewingProject.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: "24px 32px", maxHeight: "60vh", overflowY: "auto" }}>
              {/* Quick Stats */}
              <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                  <Card
                    style={{
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                    }}
                  >
                    <Statistic
                      title={<span style={{ color: "rgba(255,255,255,0.9)" }}>Budget</span>}
                      value={viewingProject.budget || 0}
                      precision={2}
                      valueStyle={{ color: "#fff", fontSize: 22, fontWeight: 600 }}
                      prefix="GH₵"
                      formatter={(value) => value.toLocaleString("en-GH")}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card
                    style={{
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)",
                    }}
                  >
                    <Statistic
                      title={<span style={{ color: "rgba(255,255,255,0.9)" }}>Progress</span>}
                      value={viewingProject.progress || 0}
                      suffix="%"
                      valueStyle={{ color: "#fff", fontSize: 22, fontWeight: 600 }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card
                    style={{
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)",
                    }}
                  >
                    <Statistic
                      title={<span style={{ color: "rgba(255,255,255,0.9)" }}>Team Size</span>}
                      value={viewingProject.assignedStaff?.length || 0}
                      suffix="members"
                      valueStyle={{ color: "#fff", fontSize: 22, fontWeight: 600 }}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Progress Bar */}
              <Card
                title={
                  <Space>
                    <RiseOutlined style={{ color: "#1890ff" }} />
                    Project Progress
                  </Space>
                }
                style={{ marginBottom: 24, borderRadius: 12 }}
              >
                <Progress
                  percent={viewingProject.progress || 0}
                  status={getProgressStatus(viewingProject.progress)}
                  strokeWidth={12}
                  strokeColor={{
                    "0%": "#108ee9",
                    "50%": "#87d068",
                    "100%": "#52c41a",
                  }}
                />
              </Card>

              <Row gutter={[24, 24]}>
                {/* Client Information */}
                <Col xs={24} lg={12}>
                  <Card
                    title={
                      <Space>
                        <UserOutlined style={{ color: "#1890ff" }} />
                        Client Information
                      </Space>
                    }
                    style={{ borderRadius: 12, height: "100%" }}
                  >
                    {viewingProject.client ? (
                      <Descriptions column={1} size="small">
                        <Descriptions.Item
                          label={
                            <Space>
                              <UserOutlined /> Name
                            </Space>
                          }
                        >
                          <strong>{viewingProject.client.name}</strong>
                        </Descriptions.Item>
                        {viewingProject.client.email && (
                          <Descriptions.Item
                            label={
                              <Space>
                                <MailOutlined /> Email
                              </Space>
                            }
                          >
                            <a href={`mailto:${viewingProject.client.email}`}>
                              {viewingProject.client.email}
                            </a>
                          </Descriptions.Item>
                        )}
                        {viewingProject.client.phone && (
                          <Descriptions.Item
                            label={
                              <Space>
                                <PhoneOutlined /> Phone
                              </Space>
                            }
                          >
                            <a href={`tel:${viewingProject.client.phone}`}>
                              {viewingProject.client.phone}
                            </a>
                          </Descriptions.Item>
                        )}
                        {viewingProject.client.company && (
                          <Descriptions.Item
                            label={
                              <Space>
                                <GlobalOutlined /> Company
                              </Space>
                            }
                          >
                            {viewingProject.client.company}
                          </Descriptions.Item>
                        )}
                      </Descriptions>
                    ) : (
                      <Empty description="No client assigned" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                  </Card>
                </Col>

                {/* Timeline */}
                <Col xs={24} lg={12}>
                  <Card
                    title={
                      <Space>
                        <CalendarOutlined style={{ color: "#1890ff" }} />
                        Project Timeline
                      </Space>
                    }
                    style={{ borderRadius: 12, height: "100%" }}
                  >
                    <Timeline>
                      <Timeline.Item color="blue">
                        <strong>Start Date</strong>
                        <br />
                        <span style={{ color: "#8c8c8c" }}>
                          {viewingProject.startDate
                            ? moment(viewingProject.startDate).format("MMMM DD, YYYY")
                            : "Not set"}
                        </span>
                      </Timeline.Item>
                      {viewingProject.deadline && (
                        <Timeline.Item
                          color={
                            moment(viewingProject.deadline).isBefore(moment()) ? "red" : "orange"
                          }
                        >
                          <strong>Deadline</strong>
                          <br />
                          <span
                            style={{
                              color: moment(viewingProject.deadline).isBefore(moment())
                                ? "#ff4d4f"
                                : "#8c8c8c",
                            }}
                          >
                            {moment(viewingProject.deadline).format("MMMM DD, YYYY")}
                            {moment(viewingProject.deadline).isBefore(moment()) && (
                              <Tag color="red" style={{ marginLeft: 8 }}>
                                Overdue
                              </Tag>
                            )}
                          </span>
                        </Timeline.Item>
                      )}
                      <Timeline.Item color={viewingProject.endDate ? "green" : "gray"}>
                        <strong>End Date</strong>
                        <br />
                        <span style={{ color: "#8c8c8c" }}>
                          {viewingProject.endDate
                            ? moment(viewingProject.endDate).format("MMMM DD, YYYY")
                            : "Not completed yet"}
                        </span>
                      </Timeline.Item>
                    </Timeline>
                  </Card>
                </Col>

                {/* Location */}
                <Col xs={24} lg={12}>
                  <Card
                    title={
                      <Space>
                        <EnvironmentOutlined style={{ color: "#1890ff" }} />
                        Project Location
                      </Space>
                    }
                    style={{ borderRadius: 12 }}
                  >
                    {viewingProject.location?.address ||
                    viewingProject.location?.city ||
                    viewingProject.location?.region ? (
                      <Descriptions column={1} size="small">
                        {viewingProject.location.address && (
                          <Descriptions.Item label="Address">
                            {viewingProject.location.address}
                          </Descriptions.Item>
                        )}
                        {viewingProject.location.city && (
                          <Descriptions.Item label="City">
                            {viewingProject.location.city}
                          </Descriptions.Item>
                        )}
                        {viewingProject.location.region && (
                          <Descriptions.Item label="Region">
                            {viewingProject.location.region}
                          </Descriptions.Item>
                        )}
                        {viewingProject.location.gps?.lat && viewingProject.location.gps?.lng && (
                          <Descriptions.Item label="GPS Coordinates">
                            {viewingProject.location.gps.lat}, {viewingProject.location.gps.lng}
                            <Button
                              type="link"
                              size="small"
                              onClick={() =>
                                window.open(
                                  `https://www.google.com/maps?q=${viewingProject.location.gps.lat},${viewingProject.location.gps.lng}`,
                                  "_blank"
                                )
                              }
                            >
                              Open in Maps
                            </Button>
                          </Descriptions.Item>
                        )}
                      </Descriptions>
                    ) : (
                      <Empty
                        description="No location information"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />
                    )}
                  </Card>
                </Col>

                {/* Assigned Staff */}
                <Col xs={24} lg={12}>
                  <Card
                    title={
                      <Space>
                        <TeamOutlined style={{ color: "#1890ff" }} />
                        Assigned Staff ({viewingProject.assignedStaff?.length || 0})
                      </Space>
                    }
                    style={{ borderRadius: 12 }}
                  >
                    {viewingProject.assignedStaff?.length > 0 ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                        {viewingProject.assignedStaff.map((staff) => (
                          <div
                            key={staff._id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "8px 12px",
                              background: "#f5f5f5",
                              borderRadius: 8,
                            }}
                          >
                            <Avatar style={{ backgroundColor: "#87d068" }} size="small">
                              {staff.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <div>
                              <div style={{ fontWeight: 500, fontSize: 13 }}>{staff.name}</div>
                              <div style={{ fontSize: 11, color: "#8c8c8c" }}>
                                {staff.role || "Team Member"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Empty
                        description="No staff assigned"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />
                    )}
                  </Card>
                </Col>

                {/* Notes */}
                {viewingProject.notes && (
                  <Col xs={24}>
                    <Card
                      title={
                        <Space>
                          <FileTextOutlined style={{ color: "#1890ff" }} />
                          Project Notes
                        </Space>
                      }
                      style={{ borderRadius: 12 }}
                    >
                      <p style={{ margin: 0, whiteSpace: "pre-wrap", color: "#595959" }}>
                        {viewingProject.notes}
                      </p>
                    </Card>
                  </Col>
                )}

                {/* Media Gallery */}
                {viewingProject.media?.length > 0 && (
                  <Col xs={24}>
                    <Card
                      title={
                        <Space>
                          <FileImageOutlined style={{ color: "#1890ff" }} />
                          Project Media ({viewingProject.media.length})
                        </Space>
                      }
                      style={{ borderRadius: 12 }}
                    >
                      <Image.PreviewGroup>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                          {viewingProject.media.map((item, index) => (
                            <div key={index}>
                              {item.type === "video" ? (
                                <video
                                  src={item.url}
                                  style={{
                                    width: 150,
                                    height: 150,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                  }}
                                  controls
                                />
                              ) : (
                                <Image
                                  src={item.url}
                                  alt={`Project media ${index + 1}`}
                                  style={{
                                    width: 150,
                                    height: 150,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                  }}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </Image.PreviewGroup>
                    </Card>
                  </Col>
                )}
              </Row>

              {/* Action Buttons */}
              <Divider />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <Button
                  icon={<EditOutlined />}
                  type="primary"
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    openModal(viewingProject);
                  }}
                >
                  Edit Project
                </Button>
                <Button
                  icon={<FolderOutlined />}
                  onClick={() => {
                    handleArchive(viewingProject._id);
                    setIsDetailModalOpen(false);
                  }}
                >
                  {viewingProject.archived ? "Unarchive" : "Archive"}
                </Button>
                <Popconfirm
                  title="Delete this project?"
                  description="This action cannot be undone."
                  onConfirm={() => {
                    handleDelete(viewingProject._id);
                    setIsDetailModalOpen(false);
                  }}
                  okText="Delete"
                  okButtonProps={{ danger: true }}
                >
                  <Button danger icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Project Modal */}
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
              <TabPane
                tab={
                  <span>
                    <ProjectOutlined /> Basic Info
                  </span>
                }
                key="1"
              >
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
                      label={
                        <span style={{ fontWeight: 500 }}>
                          <UserOutlined /> Client
                        </span>
                      }
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
                      label={
                        <span style={{ fontWeight: 500 }}>
                          <CedisIcon /> Budget (GH₵)
                        </span>
                      }
                      rules={[{ required: true, message: "Please enter budget" }]}
                    >
                      <InputNumber
                        addonBefore="GH₵"
                        style={{ width: "100%", borderRadius: "6px" }}
                        size="large"
                        min={0}
                        step={100}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/GH₵\s?|(,*)/g, "")}
                        placeholder="e.g., 50,000.00"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="assignedStaff"
                  label={
                    <span style={{ fontWeight: 500 }}>
                      <TeamOutlined /> Assigned Staff
                    </span>
                  }
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
                        <Option value="Planned">
                          <Tag color="blue">Planned</Tag>
                        </Option>
                        <Option value="Ongoing">
                          <Tag color="orange">Ongoing</Tag>
                        </Option>
                        <Option value="Completed">
                          <Tag color="green">Completed</Tag>
                        </Option>
                        <Option value="On Hold">
                          <Tag color="default">On Hold</Tag>
                        </Option>
                        <Option value="Cancelled">
                          <Tag color="red">Cancelled</Tag>
                        </Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="progress"
                      label={<span style={{ fontWeight: 500 }}>Progress (%)</span>}
                      initialValue={0}
                    >
                      <Slider min={0} max={100} marks={{ 0: "0%", 50: "50%", 100: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <CalendarOutlined /> Timeline
                  </span>
                }
                key="2"
              >
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

              <TabPane
                tab={
                  <span>
                    <EnvironmentOutlined /> Location
                  </span>
                }
                key="3"
              >
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
                      <Input placeholder="Enter city" size="large" style={{ borderRadius: "6px" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="region"
                      label={<span style={{ fontWeight: 500 }}>Region</span>}
                    >
                      <Select
                        placeholder="Select region"
                        size="large"
                        style={{ borderRadius: "6px" }}
                        showSearch
                      >
                        <Option value="Greater Accra">Greater Accra</Option>
                        <Option value="Ashanti">Ashanti</Option>
                        <Option value="Western">Western</Option>
                        <Option value="Eastern">Eastern</Option>
                        <Option value="Central">Central</Option>
                        <Option value="Northern">Northern</Option>
                        <Option value="Volta">Volta</Option>
                        <Option value="Upper East">Upper East</Option>
                        <Option value="Upper West">Upper West</Option>
                        <Option value="Bono">Bono</Option>
                        <Option value="Bono East">Bono East</Option>
                        <Option value="Ahafo">Ahafo</Option>
                        <Option value="Savannah">Savannah</Option>
                        <Option value="North East">North East</Option>
                        <Option value="Oti">Oti</Option>
                        <Option value="Western North">Western North</Option>
                      </Select>
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

              <TabPane
                tab={
                  <span>
                    <FileImageOutlined /> Media & Notes
                  </span>
                }
                key="4"
              >
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
        .archived-row {
          opacity: 0.7;
          background-color: #f5f5f5 !important;
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
        .ant-input-number-group-addon {
          background-color: #f0f0f0;
          font-weight: 600;
        }
        .ant-statistic-content {
          font-family: inherit;
        }
      `}</style>
    </div>
  );
};

export default Project;