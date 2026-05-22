import React from 'react';
import { Layout } from 'antd';
import './AppLayout.css';

const { Sider, Content } = Layout;

interface AppLayoutProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ sidebar, content }) => {
  return (
    <Layout className="app-layout">
      <Sider width={280} className="app-sider" theme="light">
        {sidebar}
      </Sider>
      <Content className="app-content">
        {content}
      </Content>
    </Layout>
  );
};
