import React, { useState } from 'react';
import { Input, Button, Space, Tag } from 'antd';
import ReactMarkdown from 'react-markdown';

const FillInBlankExercise = ({ exercise, onAnswer, showAnswer, userAnswer }) => {
  const [selectedWord, setSelectedWord] = useState(userAnswer || '');

  const handleSubmit = () => {
    if (selectedWord.trim()) {
      onAnswer(selectedWord.trim());
    }
  };

  const handleWordClick = (word) => {
    if (!showAnswer) {
      setSelectedWord(word);
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
                    ? selectedWord.toLowerCase() === exercise.answer.correct_word.toLowerCase()
                      ? '#f6ffed'
                      : '#fff2f0'
                    : '#fafafa',
                  borderColor: showAnswer
                    ? selectedWord.toLowerCase() === exercise.answer.correct_word.toLowerCase()
                      ? '#52c41a'
                      : '#ff4d4f'
                    : '#d9d9d9'
                }}
              >
                {selectedWord || '___'}
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
        <div style={{ marginBottom: '16px' }}>
          <strong>Ngân hàng từ:</strong>
        </div>
        <Space wrap>
          {exercise.problem.word_bank.map((word, index) => (
            <Tag
              key={index}
              onClick={() => handleWordClick(word)}
              style={{
                padding: '8px 16px',
                cursor: showAnswer ? 'default' : 'pointer',
                backgroundColor: selectedWord === word 
                  ? '#1890ff' 
                  : '#f0f0f0',
                color: selectedWord === word ? '#fff' : '#000',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              {word}
            </Tag>
          ))}
        </Space>
      </div>

      <div>
        <Input
          value={selectedWord}
          onChange={(e) => setSelectedWord(e.target.value)}
          placeholder="Nhập từ vào đây hoặc chọn từ ngân hàng từ"
          size="large"
          disabled={showAnswer}
          style={{ marginBottom: '16px' }}
        />
      </div>
      
      {!showAnswer && (
        <Button 
          type="primary" 
          onClick={handleSubmit} 
          disabled={!selectedWord.trim()}
          size="large"
        >
          Xác nhận đáp án
        </Button>
      )}
    </Space>
  );
};

export default FillInBlankExercise; 