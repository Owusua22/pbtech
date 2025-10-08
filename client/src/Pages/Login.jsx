import React from "react";
import { Form, Input, Button, message, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Redux/Slice/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const onFinish = async (values) => {
    try {
      const result = await dispatch(login(values)).unwrap();
      message.success("Login successful!");
      navigate("/");
    } catch (error) {
      message.error(error || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card title="Login" className="w-full max-w-md shadow-lg rounded-xl">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>
          <p className="text-center">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-500 cursor-pointer"
            >
              Register
            </span>
          </p>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
