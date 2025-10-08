import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  Users,
  Briefcase,
  ClipboardList,

  UserCog,
  LayoutDashboard,

  BookCopy,
  Image,
} from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/admin" },
    { key: "users", label: "Users", icon: <Users size={18} />, path: "/admin/users" },
    { key: "clients", label: "Clients", icon: <UserCog size={18} />, path: "/admin/clients" },
    { key: "projects", label: "Projects", icon: <Briefcase size={18} />, path: "/admin/projects" },
    { key: "tasks", label: "Tasks", icon: <ClipboardList size={18} />, path: "/admin/tasks" },
    { key: "appointments", label: "Appointments", icon: <BookCopy size={18} />, path: "/admin/appointments" },
    {key: "media", label: "Media", icon: <Image size={18} />, path: "/admin/media" },

  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(val) => setCollapsed(val)}
        theme="dark"
      >
        <div className="text-white text-center py-4 font-bold text-lg tracking-wide">
          {collapsed ? "🛠️" : "Admin Panel"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: () => navigate(item.path),
          }))}
        />
      </Sider>

      {/* Main Content */}
      <Layout>
        <Header className="bg-white shadow-md px-4 flex justify-between items-center">
          <h2 className="font-semibold text-lg">Admin Dashboard</h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 font-medium">Welcome, Admin</span>
          </div>
        </Header>
        <Content className="m-4 p-4 bg-white rounded-lg shadow">
          <Outlet /> {/* Child route renders here */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
