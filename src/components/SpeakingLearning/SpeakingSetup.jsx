import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, Typography, Space, message, Alert, Switch } from 'antd';
import { ArrowLeftOutlined, PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { getCachedSpeakingLesson } from '../../services/cacheService';

const { Title, Text } = Typography;
const { Option } = Select;

const SpeakingSetup = ({ onBack, onStartLearning }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [hasCachedLesson, setHasCachedLesson] = useState(false);
  const [createNew, setCreateNew] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');
  const [currentLevel, setCurrentLevel] = useState('');

  const levels = [
    { value: 'A1', label: 'A1 - Sơ cấp', description: 'Người mới bắt đầu học tiếng Anh' },
    { value: 'A2', label: 'A2 - Cơ bản', description: 'Có kiến thức tiếng Anh cơ bản' },
    { value: 'B1', label: 'B1 - Trung cấp thấp', description: 'Có thể giao tiếp đơn giản' },
    { value: 'B2', label: 'B2 - Trung cấp cao', description: 'Giao tiếp tự tin trong nhiều tình huống' },
    { value: 'C1', label: 'C1 - Cao cấp', description: 'Sử dụng tiếng Anh một cách hiệu quả' },
    { value: 'C2', label: 'C2 - Thành thạo', description: 'Gần như thành thạo như người bản xứ' }
  ];

  useEffect(() => {
    if (currentTopic && currentLevel) {
      const cached = getCachedSpeakingLesson(currentTopic, currentLevel);
      setHasCachedLesson(!!cached);
    }
  }, [currentTopic, currentLevel]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await onStartLearning(values.topic, values.level, createNew);
    } catch (error) {
      message.error('Có lỗi xảy ra khi thiết lập bài học. Vui lòng thử lại.');
      console.error('Error setting up speaking lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValuesChange = (changedValues, allValues) => {
    if (changedValues.topic !== undefined) {
      setCurrentTopic(changedValues.topic);
    }
    if (changedValues.level !== undefined) {
      setCurrentLevel(changedValues.level);
    }
  };

  return (
    <div className="speaking-setup-container">
      <Card className="speaking-setup-card">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{
            textAlign: 'center',
            position: 'relative'
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
              Quay lại
            </Button>
            <Title level={2} style={{
              margin: '0',
              color: '#1a1a1a',
              fontWeight: '600'
            }}>
              Thiết lập bài học nói
            </Title>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onValuesChange={handleValuesChange}
            style={{ paddingTop: '8px' }}
          >
            <Form.Item
              label={<Text strong>Chủ đề luyện nói</Text>}
              name="topic"
              rules={[
                { required: true, message: 'Vui lòng nhập chủ đề luyện nói' },
                { min: 2, message: 'Chủ đề phải có ít nhất 2 ký tự' }
              ]}
            >
              <Input 
                placeholder="Ví dụ: giới thiệu bản thân, mua sắm, du lịch..."
                size="large"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #e8e8e8',
                  transition: 'all 0.3s ease'
                }}
              />
            </Form.Item>

            <Form.Item
              label={<Text strong>Trình độ tiếng Anh</Text>}
              name="level"
              rules={[
                { required: true, message: 'Vui lòng chọn trình độ tiếng Anh' }
              ]}
            >
              <Select 
                placeholder="Chọn trình độ tiếng Anh của bạn"
                size="large"
                style={{
                  borderRadius: '12px'
                }}
              >
                {levels.map(level => (
                  <Option key={level.value} value={level.value}>
                    <div>
                      <div style={{ fontWeight: '500' }}>{level.label}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{level.description}</div>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {hasCachedLesson && (
              <Alert
                message="Đã có bài học được lưu"
                description={
                  <div>
                    <div style={{ marginBottom: '12px' }}>
                      Hệ thống đã lưu bài học cho chủ đề và trình độ này. Bạn có muốn tạo bài học mới không?
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Text>Sử dụng bài cũ</Text>
                      <Switch 
                        checked={createNew}
                        onChange={setCreateNew}
                        checkedChildren="Tạo mới"
                        unCheckedChildren="Dùng cũ"
                      />
                      <Text>Tạo bài mới</Text>
                    </div>
                  </div>
                }
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
              />
            )}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={createNew ? <ReloadOutlined /> : <PlayCircleOutlined />}
                loading={loading}
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '16px',
                  backgroundColor: '#52c41a',
                  borderColor: '#52c41a',
                  boxShadow: '0 4px 16px rgba(82, 196, 26, 0.3)',
                  border: 'none'
                }}
              >
                {loading 
                  ? 'Đang tạo bài học...' 
                  : createNew 
                    ? 'Tạo bài học mới' 
                    : hasCachedLesson 
                      ? 'Tiếp tục bài cũ'
                      : 'Bắt đầu luyện nói'
                }
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
      
      <style jsx>{`
        .speaking-setup-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .speaking-setup-card {
          max-width: 600px;
          width: 100%;
          border-radius: 20px !important;
          border: none !important;
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15) !important;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
        }

        @media (max-width: 768px) {
          .speaking-setup-container {
            padding: 8px;
            align-items: flex-start;
          }

          .speaking-setup-card {
            margin-top: 16px;
            margin-left: 4px;
            margin-right: 4px;
          }
        }

        @media (max-width: 480px) {
          .speaking-setup-container {
            padding: 4px;
          }

          .speaking-setup-card {
            margin: 2px;
          }
        }
      `}</style>
    </div>
  );
};

export default SpeakingSetup; 