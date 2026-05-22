import React from 'react';
import { Empty } from 'antd';
import type { Topic } from '../../types';
import './Viewer.css';

interface ViewerProps {
  topic: Topic | null;
  iframeKey: number;
}

export const TopicViewer: React.FC<ViewerProps> = ({ topic, iframeKey }) => {
  if (!topic) {
    return (
      <div className="viewer-empty">
        <Empty description="请从左侧选择一个话题" />
      </div>
    );
  }

  return (
    <iframe
      key={iframeKey}
      src={`/topics/${topic.file}`}
      className="viewer-iframe"
      title={topic.title}
    />
  );
};
