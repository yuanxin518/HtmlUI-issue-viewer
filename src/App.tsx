import React, { useState, useEffect } from 'react';
import { useDirectory } from './hooks/useDirectory';
import { AppLayout } from './components/Layout/AppLayout';
import { Sidebar } from './components/Sidebar/Sidebar';
import { TopicViewer } from './components/Viewer/Viewer';
import type { Category, Topic } from './types';
import './App.css';

const App: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const { load } = useDirectory();

  useEffect(() => {
    load()
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0 && cats[0].topics.length > 0) {
          setSelectedTopic(cats[0].topics[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setIframeKey((k) => k + 1);
  };

  return (
    <AppLayout
      sidebar={
        <Sidebar
          categories={categories}
          loading={loading}
          selectedTopicId={selectedTopic?.id ?? null}
          onTopicSelect={handleTopicSelect}
        />
      }
      content={
        <TopicViewer topic={selectedTopic} iframeKey={iframeKey} />
      }
    />
  );
};

export default App;
