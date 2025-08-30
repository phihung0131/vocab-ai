import React from 'react';
import { Card, Button, Typography, Space, Tag } from 'antd';
import { ArrowLeftOutlined, HomeOutlined, ReloadOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { Title, Paragraph } = Typography;

const SpeakingLesson = ({ lesson, topic, level, onBack, onRestart }) => {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '40px'
    }}>
      <Card style={{
        maxWidth: '800px',
        width: '100%',
        borderRadius: '20px',
        border: 'none',
        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(10px)'
      }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{
            position: 'relative',
            textAlign: 'center',
            paddingBottom: '16px',
            borderBottom: '2px solid #f0f0f0'
          }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={onBack}
              style={{
                position: 'absolute',
                left: '0',
                top: '0',
                color: '#666',
                fontWeight: '500'
              }}
            >
              Về trang chủ
            </Button>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Title level={2} style={{
                margin: '0',
                color: '#1a1a1a',
                fontWeight: '600'
              }}>
                🗣️ Bài học nói: {topic}
              </Title>
              <Tag color="#52c41a" style={{
                fontWeight: '500',
                padding: '4px 12px',
                borderRadius: '12px'
              }}>
                Trình độ {level}
              </Tag>
            </div>
          </div>

          <div style={{
            background: '#fafafa',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #e8e8e8',
            maxHeight: '60vh',
            overflowY: 'auto'
          }}>
            <ReactMarkdown
              components={{
                h1: ({ children }) => <Title level={3} style={{ color: '#1a1a1a', marginTop: '24px' }}>{children}</Title>,
                h2: ({ children }) => <Title level={4} style={{ color: '#1a1a1a', marginTop: '20px' }}>{children}</Title>,
                h3: ({ children }) => <Title level={5} style={{ color: '#1a1a1a', marginTop: '16px' }}>{children}</Title>,
                p: ({ children }) => <Paragraph style={{ lineHeight: '1.8', marginBottom: '16px' }}>{children}</Paragraph>,
                ul: ({ children }) => <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>{children}</ul>,
                ol: ({ children }) => <ol style={{ marginLeft: '20px', marginBottom: '16px' }}>{children}</ol>,
                li: ({ children }) => <li style={{ marginBottom: '8px', lineHeight: '1.6' }}>{children}</li>,
                strong: ({ children }) => <strong style={{ color: '#1890ff' }}>{children}</strong>,
                em: ({ children }) => <em style={{ color: '#52c41a' }}>{children}</em>,
                code: ({ children }) => <code style={{ 
                  backgroundColor: '#f5f5f5', 
                  padding: '4px 8px', 
                  borderRadius: '4px',
                  color: '#e74c3c'
                }}>{children}</code>
              }}
            >
              {lesson}
            </ReactMarkdown>
          </div>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Button 
              icon={<ReloadOutlined />}
              onClick={onRestart}
              size="large"
              style={{
                height: '44px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '15px',
                padding: '0 24px',
                border: '2px solid #1890ff',
                color: '#1890ff',
                background: 'transparent'
              }}
            >
              Học chủ đề khác
            </Button>
            <Button 
              type="primary"
              icon={<HomeOutlined />}
              onClick={onBack}
              size="large"
              style={{
                height: '44px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '15px',
                padding: '0 24px',
                background: '#52c41a',
                borderColor: '#52c41a',
                boxShadow: '0 4px 16px rgba(82, 196, 26, 0.3)'
              }}
            >
              Về trang chủ
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default SpeakingLesson; 