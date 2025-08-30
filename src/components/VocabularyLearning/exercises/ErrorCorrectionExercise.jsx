import React, { useState } from 'react';
import { Input, Button, Space, Typography, Alert } from 'antd';
import ReactMarkdown from 'react-markdown';

const { Text } = Typography;

const ErrorCorrectionExercise = ({ exercise, onAnswer, showAnswer, userAnswer }) => {
  const [incorrectWord, setIncorrectWord] = useState(userAnswer?.incorrect || '');
  const [correctWord, setCorrectWord] = useState(userAnswer?.correct || '');

  const handleSubmit = () => {
    if (incorrectWord.trim() && correctWord.trim()) {
      onAnswer({
        incorrect: incorrectWord.trim(),
        correct: correctWord.trim()
      });
    }
  };

  const renderSentence = () => {
    const sentence = exercise.problem.sentence;
    
    return (
      <div style={{ 
        fontSize: '16px', 
        lineHeight: '1.6', 
        padding: '16px',
        border: '1px solid #d9d9d9',
        borderRadius: '6px',
        backgroundColor: '#fafafa',
        marginBottom: '20px'
      }}>
        <ReactMarkdown>{sentence}</ReactMarkdown>
      </div>
    );
  };

  const isCorrectAnswer = () => {
    if (!showAnswer) return false;
    return incorrectWord.toLowerCase().trim() === exercise.answer.incorrect_word.toLowerCase() &&
           correctWord.toLowerCase().trim() === exercise.answer.correct_word.toLowerCase();
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Hướng dẫn"
        description="Tìm từ sai trong câu và đưa ra từ đúng để thay thế."
        type="info"
        showIcon
        style={{ marginBottom: '16px' }}
      />
      
      {renderSentence()}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <Text style={{ display: 'block', marginBottom: '8px' }}>
            Từ sai trong câu:
          </Text>
          <Input
            value={incorrectWord}
            onChange={(e) => setIncorrectWord(e.target.value)}
            placeholder="Nhập từ sai..."
            size="large"
            disabled={showAnswer}
            status={showAnswer && !isCorrectAnswer() ? 'error' : ''}
          />
        </div>
        
        <div>
          <Text style={{ display: 'block', marginBottom: '8px' }}>
            Từ đúng để thay thế:
          </Text>
          <Input
            value={correctWord}
            onChange={(e) => setCorrectWord(e.target.value)}
            placeholder="Nhập từ đúng..."
            size="large"
            disabled={showAnswer}
            status={showAnswer && !isCorrectAnswer() ? 'error' : ''}
          />
        </div>
      </div>
      
      {showAnswer && (
        <Alert
          message={`Đáp án đúng: "${exercise.answer.incorrect_word}" → "${exercise.answer.correct_word}"`}
          type={isCorrectAnswer() ? 'success' : 'error'}
          showIcon
        />
      )}
      
      {!showAnswer && (
        <Button 
          type="primary" 
          onClick={handleSubmit} 
          disabled={!incorrectWord.trim() || !correctWord.trim()}
          size="large"
        >
          Xác nhận đáp án
        </Button>
      )}
    </Space>
  );
};

export default ErrorCorrectionExercise; 