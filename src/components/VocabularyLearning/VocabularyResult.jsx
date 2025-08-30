import React from 'react';
import { Card, Button, Typography, Space, Progress, Result } from 'antd';
import { TrophyOutlined, RedoOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const VocabularyResult = ({ score, total, onBack, onRestart }) => {
  const percentage = (score / total) * 100;
  
  const getResultStatus = () => {
    if (percentage >= 80) return { status: 'success', message: 'Xuất sắc!', color: '#52c41a' };
    if (percentage >= 60) return { status: 'warning', message: 'Khá tốt!', color: '#faad14' };
    return { status: 'error', message: 'Cần cố gắng thêm!', color: '#ff4d4f' };
  };

  const resultStatus = getResultStatus();

  const getEncouragementMessage = () => {
    if (percentage >= 80) {
      return 'Bạn đã làm rất tốt! Hãy tiếp tục duy trì phong độ này.';
    }
    if (percentage >= 60) {
      return 'Kết quả khá ổn! Hãy luyện tập thêm để cải thiện.';
    }
    return 'Đừng nản chí! Mỗi lần luyện tập đều giúp bạn tiến bộ.';
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          <Result
            icon={<TrophyOutlined style={{ color: resultStatus.color }} />}
            title={
              <Title level={2} style={{ color: resultStatus.color, margin: 0 }}>
                {resultStatus.message}
              </Title>
            }
            subTitle={
              <div>
                <Title level={3} style={{ margin: '16px 0' }}>
                  {score}/{total} câu đúng
                </Title>
                <Progress 
                  percent={percentage} 
                  strokeColor={resultStatus.color}
                  style={{ maxWidth: '300px', margin: '0 auto' }}
                />
                <Text style={{ display: 'block', marginTop: '16px', fontSize: '16px' }}>
                  {getEncouragementMessage()}
                </Text>
              </div>
            }
          />

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              type="primary"
              icon={<RedoOutlined />}
              onClick={onRestart}
              size="large"
            >
              Học tiếp
            </Button>
            <Button 
              icon={<HomeOutlined />}
              onClick={onBack}
              size="large"
            >
              Về trang chủ
            </Button>
          </div>

          <div style={{ 
            backgroundColor: '#f0f0f0', 
            padding: '16px', 
            borderRadius: '8px',
            marginTop: '20px'
          }}>
            <Text strong>Mẹo học tập:</Text>
            <div style={{ marginTop: '8px' }}>
              <Text>• Ghi chép lại những từ vựng mới</Text><br/>
              <Text>• Thực hành sử dụng từ trong câu</Text><br/>
              <Text>• Lặp lại bài học sau 24 giờ</Text>
            </div>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default VocabularyResult; 