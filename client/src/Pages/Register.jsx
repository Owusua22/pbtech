import React from "react";
import { Form, Input, Button, Select, message, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../Redux/Slice/authSlice";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const onFinish = async (values) => {
    try {
      const result = await dispatch(register(values)).unwrap();
      message.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      message.error(error || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card title="Register" className="w-full max-w-md shadow-lg rounded-xl">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item name="contact" label="Contact Number">
            <Input placeholder="Enter contact number" />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input placeholder="Enter address" />
          </Form.Item>

          <Form.Item name="role" label="Role" initialValue="Client">
            <Select>
              <Option value="Admin">Admin</Option>
              <Option value="ProjectManager">Project Manager</Option>
              <Option value="Supervisor">Supervisor</Option>
              <Option value="Worker">Worker</Option>
              <Option value="Client">Client</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Register
            </Button>
          </Form.Item>
          <p className="text-center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-500 cursor-pointer"
            >
              Login
            </span>
          </p>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
