import React from 'react';
import { Card, Button, Typography, Space, Tag } from 'antd';
import { ArrowLeftOutlined, HomeOutlined, ReloadOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { Title, Paragraph } = Typography;

const SpeakingLesson = ({ lesson, topic, level, onBack, onRestart }) => {
  return (
    <div className="lesson-container">
      <Card className="lesson-card">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="lesson-header">
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={onBack}
              className="back-button"
            >
              <span className="back-text">Về trang chủ</span>
            </Button>
            
            <div className="header-content">
              <Title level={2} className="lesson-title">
                🗣️ Bài học nói: {topic}
              </Title>
              <Tag className="level-tag">
                Trình độ {level}
              </Tag>
            </div>
          </div>

          <div className="lesson-content">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <Title level={3} className="content-h1">{children}</Title>,
                h2: ({ children }) => <Title level={4} className="content-h2">{children}</Title>,
                h3: ({ children }) => <Title level={5} className="content-h3">{children}</Title>,
                p: ({ children }) => <Paragraph className="content-paragraph">{children}</Paragraph>,
                ul: ({ children }) => <ul className="content-ul">{children}</ul>,
                ol: ({ children }) => <ol className="content-ol">{children}</ol>,
                li: ({ children }) => <li className="content-li">{children}</li>,
                strong: ({ children }) => <strong className="content-strong">{children}</strong>,
                em: ({ children }) => <em className="content-em">{children}</em>,
                code: ({ children }) => <code className="content-code">{children}</code>
              }}
            >
              {lesson}
            </ReactMarkdown>
          </div>

          <div className="action-buttons">
            <Button 
              icon={<ReloadOutlined />}
              onClick={onRestart}
              size="large"
              className="secondary-button"
            >
              <span className="button-text">Học chủ đề khác</span>
            </Button>
            <Button 
              type="primary"
              icon={<HomeOutlined />}
              onClick={onBack}
              size="large"
              className="primary-button"
            >
              <span className="button-text">Về trang chủ</span>
            </Button>
          </div>
        </Space>
      </Card>

      <style jsx>{`
        .lesson-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 40px;
        }

        .lesson-card {
          max-width: 800px;
          width: 100%;
          border-radius: 20px !important;
          border: none !important;
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15) !important;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
        }

        .lesson-header {
          position: relative;
          text-align: center;
          padding-bottom: 16px;
          border-bottom: 2px solid #f0f0f0;
        }

        .back-button {
          position: absolute;
          left: 0;
          top: 0;
          color: #666 !important;
          font-weight: 500 !important;
        }

        .back-text {
          display: inline;
        }

        .header-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .lesson-title {
          margin: 0 !important;
          color: #1a1a1a !important;
          font-weight: 600 !important;
          font-size: 1.5rem !important;
          line-height: 1.3 !important;
        }

        .level-tag {
          background-color: #52c41a !important;
          color: white !important;
          border-color: #52c41a !important;
          font-weight: 500 !important;
          padding: 4px 12px !important;
          border-radius: 12px !important;
        }

        .lesson-content {
          width: 100%;
        }

        .content-h1 {
          color: #1a1a1a !important;
          margin-top: 24px !important;
          margin-bottom: 16px !important;
        }

        .content-h2 {
          color: #1a1a1a !important;
          margin-top: 20px !important;
          margin-bottom: 12px !important;
        }

        .content-h3 {
          color: #1a1a1a !important;
          margin-top: 16px !important;
          margin-bottom: 8px !important;
        }

        .content-paragraph {
          line-height: 1.8 !important;
          margin-bottom: 16px !important;
        }

        .content-ul, .content-ol {
          margin-left: 20px;
          margin-bottom: 16px;
        }

        .content-li {
          margin-bottom: 8px;
          line-height: 1.6;
        }

        .content-strong {
          color: #1890ff;
        }

        .content-em {
          color: #52c41a;
        }

        .content-code {
          background-color: #f5f5f5;
          padding: 4px 8px;
          border-radius: 4px;
          color: #e74c3c;
        }

        .action-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .secondary-button {
          height: 44px !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          font-size: 15px !important;
          padding: 0 24px !important;
          border: 2px solid #1890ff !important;
          color: #1890ff !important;
          background: transparent !important;
        }

        .primary-button {
          height: 44px !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          font-size: 15px !important;
          padding: 0 24px !important;
          background: #52c41a !important;
          border-color: #52c41a !important;
          box-shadow: 0 4px 16px rgba(82, 196, 26, 0.3) !important;
        }

        .button-text {
          display: inline;
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .lesson-container {
            padding: 8px;
            padding-top: 20px;
          }

          .lesson-card {
            margin: 4px;
          }

          .lesson-header {
            padding-bottom: 20px;
          }

          .back-button {
            position: relative !important;
            margin-bottom: 16px;
            font-size: 16px !important;
          }

          .lesson-title {
            font-size: 1.4rem !important;
            text-align: center;
          }

          .level-tag {
            margin-top: 8px;
            font-size: 14px !important;
          }

          .content-h1 {
            font-size: 1.3rem !important;
          }

          .content-h2 {
            font-size: 1.2rem !important;
          }

          .content-h3 {
            font-size: 1.1rem !important;
          }

          .content-paragraph {
            font-size: 15px !important;
          }

          .action-buttons {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .secondary-button,
          .primary-button {
            height: 52px !important;
            font-size: 16px !important;
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .lesson-container {
            padding: 4px;
            padding-top: 12px;
          }

          .lesson-card {
            margin: 2px;
          }

          .back-button {
            font-size: 18px !important;
          }

          .back-text {
            display: none;
          }

          .lesson-title {
            font-size: 1.2rem !important;
            line-height: 1.2 !important;
            padding: 0 10px;
          }

          .content-h1 {
            font-size: 1.2rem !important;
          }

          .content-h2 {
            font-size: 1.1rem !important;
          }

          .content-h3 {
            font-size: 1rem !important;
          }

          .content-paragraph {
            font-size: 14px !important;
            line-height: 1.6 !important;
          }

          .secondary-button,
          .primary-button {
            height: 56px !important;
            font-size: 18px !important;
          }

          .button-text {
            font-size: 16px;
          }
        }

        /* Very small screens */
        @media (max-width: 360px) {
          .lesson-title {
            font-size: 1.1rem !important;
          }

          .secondary-button,
          .primary-button {
            padding: 0 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SpeakingLesson; 