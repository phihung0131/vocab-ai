import React, { useState } from 'react';
import { Card, Button, Space, Typography } from 'antd';

const { Text } = Typography;

const OddOneOutExercise = ({ exercise, onAnswer, showAnswer, userAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(userAnswer || null);

  const handleSubmit = () => {
    if (selectedAnswer) {
      onAnswer(selectedAnswer);
    }
  };

  const getCardStyle = (option) => {
    const baseStyle = {
      cursor: showAnswer ? 'default' : 'pointer',
      marginBottom: '12px',
      transition: 'all 0.2s',
      textAlign: 'center',
      padding: '20px'
    };

    if (showAnswer) {
      if (option.key === exercise.answer.correct_key) {
        return { 
          ...baseStyle, 
          backgroundColor: '#f6ffed', 
          borderColor: '#52c41a',
          border: '2px solid #52c41a'
        };
      } else if (option.key === selectedAnswer && option.key !== exercise.answer.correct_key) {
        return { 
          ...baseStyle, 
          backgroundColor: '#fff2f0', 
          borderColor: '#ff4d4f',
          border: '2px solid #ff4d4f'
        };
      }
    } else {
      if (selectedAnswer === option.key) {
        return { 
          ...baseStyle, 
          backgroundColor: '#e6f7ff', 
          borderColor: '#1890ff',
          border: '2px solid #1890ff'
        };
      }
    }

    return { 
      ...baseStyle,
      border: '1px solid #d9d9d9',
      backgroundColor: '#fff'
    };
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Text style={{ fontSize: '16px', color: '#666' }}>
        Chọn từ khác loại với các từ còn lại:
      </Text>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
        {exercise.problem.options.map((option) => (
          <Card
            key={option.key}
            onClick={() => !showAnswer && setSelectedAnswer(option.key)}
            style={getCardStyle(option)}
            hoverable={!showAnswer}
          >
            <div>
              <Text strong style={{ fontSize: '16px' }}>{option.key}</Text>
            </div>
            <div style={{ marginTop: '8px' }}>
              <Text>{option.value}</Text>
            </div>
          </Card>
        ))}
      </div>
      
      {!showAnswer && (
        <Button 
          type="primary" 
          onClick={handleSubmit} 
          disabled={!selectedAnswer}
          size="large"
        >
          Xác nhận đáp án
        </Button>
      )}
    </Space>
  );
};

export default OddOneOutExercise; 