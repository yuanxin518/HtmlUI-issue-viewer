import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Spin, Empty } from 'antd';
import {
  BookOutlined,
  CodeOutlined,
  RobotOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  BulbOutlined,
  ToolOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import './App.css';

const { Sider, Content } = Layout;

interface Topic {
  id: string;
  title: string;
  file: string;
}

interface Category {
  name: string;
  icon: string;
  topics: Topic[];
}

interface Directory {
  categories: Category[];
}

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

const App: React.FC = () => {
  const [directory, setDirectory] = useState<Directory | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    fetch('/directory.json')
      .then((res) => res.json())
      .then((data: Directory) => {
        setDirectory(data);
        // auto-select first topic
        if (data.categories.length > 0 && data.categories[0].topics.length > 0) {
          setSelectedTopic(data.categories[0].topics[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleMenuClick = (info: { key: string }) => {
    const topic = directory?.categories
      .flatMap((c) => c.topics)
      .find((t) => t.id === info.key);
    if (topic) {
      setSelectedTopic(topic);
      setIframeKey((k) => k + 1); // force iframe reload
    }
  };

  // Build menu items: Category → SubMenu, Topic → MenuItem
  const menuItems = directory?.categories.map((cat) => ({
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
    <Layout className="app-layout">
      <Sider width={280} className="app-sider" theme="light">
        <div className="app-sider-header">
          <Typography.Title level={4} style={{ margin: 0 }}>
            📚 Topic Viewer
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            AI 生成的话题内容
          </Typography.Text>
        </div>
        {loading ? (
          <div className="sider-loading">
            <Spin />
          </div>
        ) : (
          <Menu
            mode="inline"
            defaultOpenKeys={directory?.categories.map((c) => `cat-${c.name}`)}
            selectedKeys={selectedTopic ? [selectedTopic.id] : []}
            onClick={handleMenuClick}
            items={menuItems}
            className="app-menu"
          />
        )}
      </Sider>
      <Content className="app-content">
        {selectedTopic ? (
          <iframe
            key={iframeKey}
            src={`/topics/${selectedTopic.file}`}
            className="topic-iframe"
            title={selectedTopic.title}
          />
        ) : (
          <div className="empty-state">
            <Empty description="请从左侧选择一个话题" />
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default App;
