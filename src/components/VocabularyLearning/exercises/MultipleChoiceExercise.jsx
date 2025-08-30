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

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <ReactMarkdown>{exercise.problem.question}</ReactMarkdown>
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