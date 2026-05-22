import React from 'react';
import { Menu, Typography, Spin } from 'antd';
import {
  BookOutlined, CodeOutlined, RobotOutlined, FileTextOutlined,
  FolderOpenOutlined, BulbOutlined, ToolOutlined, SettingOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import type { Category, Topic } from '../../types';
import './Sidebar.css';

const iconMap: Record<string, React.ReactNode> = {
  BookOutlined: <BookOutlined />,
  CodeOutlined: <CodeOutlined />,
  RobotOutlined: <RobotOutlined />,
  AppstoreOutlined: <AppstoreOutlined />,
  FileTextOutlined: <FileTextOutlined />,
  FolderOpenOutlined: <FolderOpenOutlined />,
  BulbOutlined: <BulbOutlined />,
  ToolOutlined: <ToolOutlined />,
  SettingOutlined: <SettingOutlined />,
};

interface SidebarProps {
  categories: Category[];
  loading: boolean;
  selectedTopicId: string | null;
  onTopicSelect: (topic: Topic) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories, loading, selectedTopicId, onTopicSelect,
}) => {
  const menuItems = categories.map((cat) => ({
    key: `cat-${cat.name}`,
    icon: iconMap[cat.icon] || <FolderOpenOutlined />,
    label: cat.name,
    children: cat.topics.map((topic) => ({
      key: topic.id,
      icon: <FileTextOutlined />,
      label: topic.title,
    })),
  }));

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Typography.Title level={5} style={{ margin: 0 }}>
          📚 Topic Viewer
        </Typography.Title>
        <Typography.Text type="secondary" style={{ fontSize: 11 }}>
          AI 话题内容管理
        </Typography.Text>
      </div>
      {loading ? (
        <div className="sidebar-loading">
          <Spin />
        </div>
      ) : (
        <Menu
          mode="inline"
          defaultOpenKeys={categories.map((c) => `cat-${c.name}`)}
          selectedKeys={selectedTopicId ? [selectedTopicId] : []}
          onClick={({ key }) => {
            const topic = categories.flatMap((c) => c.topics).find((t) => t.id === key);
            if (topic) onTopicSelect(topic);
          }}
          items={menuItems}
          className="sidebar-menu"
        />
      )}
    </div>
  );
};
