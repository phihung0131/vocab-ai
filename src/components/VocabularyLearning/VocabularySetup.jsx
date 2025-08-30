import React, { useState, useEffect } from 'react';
import { Card, Form, Input, InputNumber, Button, Typography, Space, message, Alert, Switch } from 'antd';
import { ArrowLeftOutlined, PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { getCachedVocabularyExercises } from '../../services/cacheService';

const { Title, Text } = Typography;

const VocabularySetup = ({ onBack, onStartLearning }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [hasCachedExercises, setHasCachedExercises] = useState(false);
  const [createNew, setCreateNew] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');
  const [currentNumber, setCurrentNumber] = useState(5);

  useEffect(() => {
    if (currentTopic && currentNumber) {
      const cached = getCachedVocabularyExercises(currentTopic, currentNumber);
      setHasCachedExercises(!!cached);
    }
  }, [currentTopic, currentNumber]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await onStartLearning(values.topic, values.numberOfQuestions, createNew);
    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo bài tập. Vui lòng thử lại.');
      console.error('Error creating exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValuesChange = (changedValues, allValues) => {
    if (changedValues.topic !== undefined) {
      setCurrentTopic(changedValues.topic);
    }
    if (changedValues.numberOfQuestions !== undefined) {
      setCurrentNumber(changedValues.numberOfQuestions);
    }
  };

  return (
    <div className="setup-container">
      <Card className="setup-card">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="setup-header">
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={onBack}
              className="back-button"
            >
              Quay lại
            </Button>
            <Title level={2} className="setup-title">Thiết lập bài học từ vựng</Title>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onValuesChange={handleValuesChange}
            initialValues={{
              numberOfQuestions: 5
            }}
            className="setup-form"
          >
            <Form.Item
              label={<Text strong>Chủ đề học tập</Text>}
              name="topic"
              rules={[
                { required: true, message: 'Vui lòng nhập chủ đề học tập' },
                { min: 2, message: 'Chủ đề phải có ít nhất 2 ký tự' }
              ]}
            >
              <Input 
                placeholder="Ví dụ: gia đình, thực phẩm, công việc..."
                size="large"
                className="modern-input"
              />
            </Form.Item>

            <Form.Item
              label={<Text strong>Số lượng câu hỏi</Text>}
              name="numberOfQuestions"
              rules={[
                { required: true, message: 'Vui lòng chọn số lượng câu hỏi' },
                { type: 'number', min: 3, max: 20, message: 'Số lượng câu hỏi phải từ 3 đến 20' }
              ]}
            >
              <InputNumber
                min={3}
                max={20}
                size="large"
                style={{ width: '100%' }}
                placeholder="Chọn số lượng câu hỏi"
                className="modern-input"
              />
            </Form.Item>

            {hasCachedExercises && (
              <Alert
                message="Đã có bài tập được lưu"
                description={
                  <div>
                    <div style={{ marginBottom: '12px' }}>
                      Hệ thống đã lưu bài tập cho chủ đề này. Bạn có muốn tạo bài tập mới không?
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
                className="submit-button"
              >
                {loading 
                  ? 'Đang tạo bài tập...' 
                  : createNew 
                    ? 'Tạo bài tập mới' 
                    : hasCachedExercises 
                      ? 'Tiếp tục bài cũ'
                      : 'Bắt đầu học'
                }
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>

      <style jsx>{`
        .setup-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .setup-card {
          max-width: 600px;
          width: 100%;
          border-radius: 20px !important;
          border: none !important;
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15) !important;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
        }

        .setup-header {
          text-align: center;
          position: relative;
        }

        .back-button {
          position: absolute;
          left: 0;
          top: 0;
          color: #666 !important;
          font-weight: 500 !important;
        }

        .setup-title {
          margin: 0 !important;
          color: #1a1a1a !important;
          font-weight: 600 !important;
        }

        .setup-form {
          padding-top: 8px;
        }

        .modern-input {
          border-radius: 12px !important;
          border: 2px solid #e8e8e8 !important;
          transition: all 0.3s ease !important;
        }

        .modern-input:hover {
          border-color: #1890ff !important;
        }

        .modern-input:focus {
          border-color: #1890ff !important;
          box-shadow: 0 0 0 4px rgba(24, 144, 255, 0.1) !important;
        }

        .submit-button {
          width: 100%;
          height: 48px !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          box-shadow: 0 4px 16px rgba(24, 144, 255, 0.3) !important;
          border: none !important;
        }

        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(24, 144, 255, 0.4) !important;
        }

        @media (max-width: 768px) {
          .setup-container {
            padding: 8px;
            align-items: flex-start;
          }

          .setup-card {
            margin-top: 16px;
            margin-left: 4px;
            margin-right: 4px;
          }

          .back-button {
            position: relative;
            margin-bottom: 16px;
            font-size: 16px !important;
          }

          .setup-title {
            font-size: 1.8rem !important;
          }

          .modern-input {
            font-size: 16px !important;
            height: 48px !important;
          }

          .submit-button {
            height: 52px !important;
            font-size: 18px !important;
          }
        }

        @media (max-width: 480px) {
          .setup-container {
            padding: 4px;
          }

          .setup-card {
            margin: 2px;
          }

          .back-button {
            font-size: 18px !important;
          }

          .setup-title {
            font-size: 2rem !important;
            line-height: 1.3 !important;
          }

          .modern-input {
            font-size: 18px !important;
            height: 52px !important;
            padding: 14px 16px !important;
          }

          .submit-button {
            height: 56px !important;
            font-size: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default VocabularySetup; 