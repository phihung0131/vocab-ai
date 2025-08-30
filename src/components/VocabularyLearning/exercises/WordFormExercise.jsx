import React, { useState } from 'react';
import { Input, Button, Space, Typography } from 'antd';
import ReactMarkdown from 'react-markdown';

const { Text } = Typography;

const WordFormExercise = ({ exercise, onAnswer, showAnswer, userAnswer }) => {
  const [answer, setAnswer] = useState(userAnswer || '');

  const handleSubmit = () => {
    if (answer.trim()) {
      onAnswer(answer.trim());
    }
  };

  const renderSentenceWithBlank = () => {
    const sentence = exercise.problem.sentence;
    const parts = sentence.split('__BLANK__');
    
    return (
      <div style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
        {parts.map((part, index) => (
          <span key={index}>
            <ReactMarkdown components={{ p: ({ children }) => <span>{children}</span> }}>
              {part}
            </ReactMarkdown>
            {index < parts.length - 1 && (
              <span 
                style={{
                  display: 'inline-block',
                  minWidth: '120px',
                  padding: '4px 12px',
                  margin: '0 4px',
                  border: '2px dashed #d9d9d9',
                  borderRadius: '4px',
                  textAlign: 'center',
                  backgroundColor: showAnswer 
                    ? answer.toLowerCase() === exercise.answer.correct_form.toLowerCase()
                      ? '#f6ffed'
                      : '#fff2f0'
                    : '#fafafa',
                  borderColor: showAnswer
                    ? answer.toLowerCase() === exercise.answer.correct_form.toLowerCase()
                      ? '#52c41a'
                      : '#ff4d4f'
                    : '#d9d9d9'
                }}
              >
                {answer || '___'}
              </span>
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {renderSentenceWithBlank()}
      
      <div>
        <Text strong>Từ gốc: </Text>
        <Text code style={{ fontSize: '16px' }}>{exercise.problem.base_word}</Text>
      </div>
      
      <div>
        <Text style={{ display: 'block', marginBottom: '8px' }}>
          Nhập dạng đúng của từ:
        </Text>
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Nhập dạng đúng của từ..."
          size="large"
          disabled={showAnswer}
          style={{ marginBottom: '16px' }}
        />
      </div>
      
      {!showAnswer && (
        <Button 
          type="primary" 
          onClick={handleSubmit} 
          disabled={!answer.trim()}
          size="large"
        >
          Xác nhận đáp án
        </Button>
      )}
    </Space>
  );
};

export default WordFormExercise; 