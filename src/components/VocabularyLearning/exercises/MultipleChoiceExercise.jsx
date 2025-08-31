import React, { useState } from 'react';
import { Radio, Button, Space } from 'antd';
import ReactMarkdown from 'react-markdown';

const MultipleChoiceExercise = ({ exercise, onAnswer, showAnswer, userAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(userAnswer || null);

  const handleSubmit = () => {
    if (selectedAnswer) {
      onAnswer(selectedAnswer);
    }
  };

  const renderQuestionWithBlank = () => {
    const question = exercise.problem.question;
    
    // Handle both BLANK and __BLANK__ formats
    const blankPattern = /\b(BLANK|__BLANK__)\b/g;
    const parts = question.split(blankPattern);
    
    return (
      <div style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
        {parts.map((part, index) => {
          // Check if this part is a BLANK placeholder
          if (part === 'BLANK' || part === '__BLANK__') {
            return (
              <span 
                key={index}
                style={{
                  display: 'inline-block',
                  minWidth: '80px',
                  padding: '4px 12px',
                  margin: '0 4px',
                  border: '2px dashed #d9d9d9',
                  borderRadius: '4px',
                  textAlign: 'center',
                  backgroundColor: '#fafafa',
                  borderColor: '#d9d9d9'
                }}
              >
                ___
              </span>
            );
          }
          
          // Regular text part
          return (
            <ReactMarkdown 
              key={index} 
              components={{ p: ({ children }) => <span>{children}</span> }}
            >
              {part}
            </ReactMarkdown>
          );
        })}
      </div>
    );
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        {renderQuestionWithBlank()}
      </div>
      
      <Radio.Group 
        value={selectedAnswer} 
        onChange={(e) => setSelectedAnswer(e.target.value)}
        disabled={showAnswer}
        style={{ width: '100%' }}
      >
        <Space direction="vertical" size="medium" style={{ width: '100%' }}>
          {exercise.problem.options.map((option) => (
            <Radio 
              key={option.key} 
              value={option.key}
              style={{ 
                padding: '12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: showAnswer && option.key === exercise.answer.correct_key 
                  ? '#f6ffed' 
                  : showAnswer && option.key === selectedAnswer && option.key !== exercise.answer.correct_key
                  ? '#fff2f0'
                  : '#fff'
              }}
            >
              <div style={{ marginLeft: '8px' }}>
                <strong>{option.key}.</strong> {option.value}
              </div>
            </Radio>
          ))}
        </Space>
      </Radio.Group>
      
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

export default MultipleChoiceExercise; 