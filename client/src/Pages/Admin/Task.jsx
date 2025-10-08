// frontend/src/Pages/Admin/TaskManagement.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  addTask,
  editTask,
  removeTask,
  clearTaskError,
} from "../../Redux/Slice/taskSlice";
import { fetchAllUsers } from "../../Redux/Slice/authSlice";
import { fetchProjects } from "../../Redux/Slice/projectSlice";

import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  Popconfirm,
  message,
  Tag,
} from "antd";
import { Plus, Edit, Trash2 } from "lucide-react";
import dayjs from "dayjs";

const { Option } = Select;

const Task = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  const { users } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.projects);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks, users, and projects on mount
  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchAllUsers());
    dispatch(fetchProjects());
  }, [dispatch]);

  // Show error messages
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearTaskError());
    }
  }, [error, dispatch]);

  // Handle Add/Edit submit
  const handleSubmit = async (values) => {
    const taskData = {
      ...values,
      deadline: values.deadline ? values.deadline.toISOString() : null,
    };

    try {
      if (editingTask) {
        await dispatch(editTask({ id: editingTask._id, data: taskData })).unwrap();
        message.success("Task updated successfully");
      } else {
        await dispatch(addTask(taskData)).unwrap();
        message.success("Task added successfully");
      }
      setIsModalOpen(false);
      setEditingTask(null);
      form.resetFields();
    } catch (err) {
      message.error(err || "Something went wrong");
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await dispatch(removeTask(id)).unwrap();
      message.success("Task deleted successfully");
    } catch (err) {
      message.error(err || "Failed to delete task");
    }
  };

  // Columns
  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Assigned To",
      dataIndex: ["assignedTo", "name"],
      key: "assignedTo",
      render: (user) => user || "Unassigned",
    },
    {
      title: "Project",
      dataIndex: ["project", "name"],
      key: "project",
      render: (project) => project || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color =
          status === "Completed"
            ? "green"
            : status === "In Progress"
            ? "blue"
            : "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    { title: "Priority", dataIndex: "priority", key: "priority" },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "N/A"),
    },
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
              setEditingTask(record);
              form.setFieldsValue({
                ...record,
                assignedTo: record.assignedTo?._id,
                project: record.project?._id,
                deadline: record.deadline ? dayjs(record.deadline) : null,
              });
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this task?"
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
        <h2 className="text-xl font-semibold">Task Management</h2>
        <Button
          type="primary"
          icon={<Plus size={18} />}
          onClick={() => {
            setEditingTask(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Add Task
        </Button>
      </div>

      <Table
        rowKey="_id"
        dataSource={tasks}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      {/* Add/Edit Modal */}
      <Modal
        title={editingTask ? "Edit Task" : "Add Task"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onOk={() => form.submit()}
        okText={editingTask ? "Update" : "Add"}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter task title" }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Enter task description" rows={3} />
          </Form.Item>

          <Form.Item name="assignedTo" label="Assign To">
            <Select placeholder="Select a user" allowClear>
              {users?.map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="project" label="Project">
            <Select placeholder="Select a project" allowClear>
              {projects?.map((project) => (
                <Option key={project._id} value={project._id}>
                  {project.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Status" initialValue="Not Started">
            <Select>
              <Option value="Not Started">Not Started</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>

          <Form.Item name="priority" label="Priority" initialValue="Medium">
            <Select>
              <Option value="Low">Low</Option>
              <Option value="Medium">Medium</Option>
              <Option value="High">High</Option>
            </Select>
          </Form.Item>

          <Form.Item name="deadline" label="Deadline">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Task;
