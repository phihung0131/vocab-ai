import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, List, Empty, Tag, message } from 'antd';
import { BookOutlined, SoundOutlined, HistoryOutlined, DeleteOutlined } from '@ant-design/icons';
import { getHistory, clearHistory, getCachedExerciseById } from '../services/cacheService';

const { Title, Paragraph, Text } = Typography;

const HomePage = ({ onSelectMode, onLoadCachedExercise }) => {
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClearHistory = () => {
    console.log('handleClearHistory called'); // Debug log
    
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử học tập?')) {
      try {
        console.log('Clearing history...'); // Debug log
        clearHistory();
        setHistory([]);
        setShowHistory(false);
        message.success('Đã xóa lịch sử thành công!');
        console.log('History cleared successfully');
      } catch (error) {
        console.error('Error clearing history:', error);
        message.error('Có lỗi xảy ra khi xóa lịch sử. Vui lòng thử lại!');
      }
    } else {
      console.log('Clear history cancelled'); // Debug log
    }
  };

  const handleLoadHistory = (id) => {
    const cachedData = getCachedExerciseById(id);
    if (cachedData) {
      onLoadCachedExercise(cachedData);
      setShowHistory(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type) => {
    return type === 'vocabulary' ? '#1890ff' : '#52c41a';
  };

  const getTypeLabel = (type) => {
    return type === 'vocabulary' ? 'Từ vựng' : 'Học nói';
  };

  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <div className="hero-section">
          <div className="hero-content">
            <Title level={1} className="hero-title">
              🎯 VocabAI
            </Title>
            <Paragraph className="hero-subtitle">
              Học tiếng Anh thông minh với AI
            </Paragraph>
            <Text className="hero-description">
              Nâng cao từ vựng và kỹ năng giao tiếp với các bài tập được cá nhân hóa
            </Text>
          </div>
        </div>
        
        <Row gutter={[24, 24]} className="learning-options">
          <Col xs={24} sm={12}>
            <Card
              className="learning-card vocabulary-card"
              hoverable
              onClick={() => onSelectMode('vocabulary')}
            >
              <div className="card-content">
                <div className="card-icon">
                  <BookOutlined />
                </div>
                <Title level={3} className="card-title">Học từ vựng</Title>
                <Paragraph className="card-description">
                  Luyện tập từ vựng qua 6 dạng bài tập đa dạng: trắc nghiệm, điền từ, nối từ...
                </Paragraph>
                <div className="card-features">
                  <Tag color="#1890ff">Trắc nghiệm</Tag>
                  <Tag color="#1890ff">Điền từ</Tag>
                  <Tag color="#1890ff">Nối từ</Tag>
                </div>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12}>
            <Card
              className="learning-card speaking-card"
              hoverable
              onClick={() => onSelectMode('speaking')}
            >
              <div className="card-content">
                <div className="card-icon speaking-icon">
                  <SoundOutlined />
                </div>
                <Title level={3} className="card-title">Luyện nói</Title>
                <Paragraph className="card-description">
                  Thực hành giao tiếp theo chủ đề và trình độ từ A1 đến C2
                </Paragraph>
                <div className="card-features">
                  <Tag color="#52c41a">Giao tiếp</Tag>
                  <Tag color="#52c41a">Phát âm</Tag>
                  <Tag color="#52c41a">Thực hành</Tag>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {history.length > 0 && (
          <div className="history-section">
            <div className="history-header">
              <Button 
                type="text" 
                icon={<HistoryOutlined />}
                onClick={() => setShowHistory(!showHistory)}
                className="history-toggle"
              >
                Lịch sử học tập ({history.length})
              </Button>
              {showHistory && history.length > 0 && (
                <Button 
                  type="text" 
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleClearHistory}
                  size="small"
                >
                  Xóa lịch sử
                </Button>
              )}
            </div>
            
            {showHistory && (
              <Card className="history-card">
                <List
                  dataSource={history.slice(0, 5)}
                  locale={{
                    emptyText: <Empty description="Chưa có lịch sử học tập" />
                  }}
                  renderItem={(item) => (
                    <List.Item 
                      className="history-item"
                      onClick={() => handleLoadHistory(item.id)}
                    >
                      <div className="history-content">
                        <div className="history-main">
                          <Text strong>{item.data.topic}</Text>
                          <Tag color={getTypeColor(item.data.type)} size="small">
                            {getTypeLabel(item.data.type)}
                          </Tag>
                        </div>
                        <Text className="history-date">
                          {formatDate(item.timestamp)}
                        </Text>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .homepage-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .homepage-content {
          max-width: 900px;
          width: 100%;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 48px;
        }

        .hero-content {
          background: rgba(255, 255, 255, 0.95);
          padding: 40px 32px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        }

        .hero-title {
          color: #1a1a1a !important;
          font-size: 3rem !important;
          font-weight: 700 !important;
          margin-bottom: 16px !important;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.25rem !important;
          color: #4a4a4a !important;
          margin-bottom: 8px !important;
          font-weight: 500 !important;
        }

        .hero-description {
          color: #666 !important;
          font-size: 1rem;
        }

        .learning-options {
          margin-bottom: 32px;
        }

        .learning-card {
          height: 100%;
          border-radius: 16px !important;
          border: none !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
          transition: all 0.3s ease !important;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
        }

        .learning-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.16) !important;
        }

        .vocabulary-card:hover {
          border-color: #1890ff !important;
        }

        .speaking-card:hover {
          border-color: #52c41a !important;
        }

        .card-content {
          padding: 24px;
          text-align: center;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card-icon {
          font-size: 48px;
          color: #1890ff;
          margin-bottom: 20px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .speaking-icon {
          color: #52c41a !important;
        }

        .card-title {
          margin-bottom: 12px !important;
          color: #1a1a1a !important;
        }

        .card-description {
          color: #666 !important;
          margin-bottom: 20px !important;
          line-height: 1.6;
          flex-grow: 1;
        }

        .card-features {
          display: flex;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .history-section {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          padding: 24px;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .history-toggle {
          color: #1890ff !important;
          font-weight: 500 !important;
        }

        .history-card {
          margin-top: 16px;
          border-radius: 12px !important;
          border: 1px solid #e8e8e8;
        }

        .history-item {
          cursor: pointer;
          transition: background-color 0.2s;
          border-radius: 8px;
          margin: 4px 0;
          padding: 8px 12px !important;
        }

        .history-item:hover {
          background-color: #f0f8ff;
        }

        .history-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .history-main {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .history-date {
          color: #999 !important;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .homepage-container {
            padding: 8px;
            align-items: flex-start;
            min-height: 100vh;
          }

          .hero-content {
            padding: 24px 16px;
            margin-bottom: 24px;
          }

          .hero-title {
            font-size: 2.8rem !important;
          }

          .hero-subtitle {
            font-size: 1.3rem !important;
          }

          .hero-description {
            font-size: 1.1rem !important;
          }

          .card-content {
            padding: 24px 16px;
          }

          .card-icon {
            font-size: 48px;
            height: 64px;
          }

          .card-title {
            font-size: 1.4rem !important;
          }

          .card-description {
            font-size: 1rem !important;
            line-height: 1.6 !important;
          }

          .history-section {
            padding: 16px 12px;
            margin: 0 4px;
          }

          .history-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .history-toggle {
            font-size: 16px !important;
          }
        }

        @media (max-width: 480px) {
          .homepage-container {
            padding: 4px;
          }

          .hero-content {
            padding: 20px 12px;
            margin-bottom: 20px;
          }

          .hero-title {
            font-size: 3rem !important;
            line-height: 1.2 !important;
          }

          .hero-subtitle {
            font-size: 1.4rem !important;
            line-height: 1.3 !important;
          }

          .hero-description {
            font-size: 1.2rem !important;
            line-height: 1.6 !important;
          }

          .learning-options {
            margin-bottom: 20px;
          }

          .card-content {
            padding: 20px 12px;
          }

          .card-title {
            font-size: 1.5rem !important;
          }

          .card-description {
            font-size: 1.1rem !important;
            line-height: 1.7 !important;
          }

          .card-features {
            gap: 6px;
          }

          .history-section {
            padding: 12px 8px;
            margin: 0 2px;
          }

          .history-toggle {
            font-size: 18px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage; 