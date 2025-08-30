import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Progress, message } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

import MultipleChoiceExercise from './exercises/MultipleChoiceExercise';
import FillInBlankExercise from './exercises/FillInBlankExercise';
import MatchingExercise from './exercises/MatchingExercise';
import WordFormExercise from './exercises/WordFormExercise';
import ErrorCorrectionExercise from './exercises/ErrorCorrectionExercise';
import OddOneOutExercise from './exercises/OddOneOutExercise';

const { Title, Paragraph } = Typography;

const VocabularyExercise = ({ exercises, onBack, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentExercise = exercises[currentIndex];
  const progress = ((currentIndex + 1) / exercises.length) * 100;

  const handleAnswer = (answer) => {
    const newAnswers = { ...userAnswers, [currentIndex]: answer };
    setUserAnswers(newAnswers);
    
    // Check if answer is correct
    const correct = checkAnswer(currentExercise, answer);
    setIsCorrect(correct);
    setShowAnswer(true);
  };

  const checkAnswer = (exercise, userAnswer) => {
    switch (exercise.exercise_type) {
      case 'MULTIPLE_CHOICE':
        return userAnswer === exercise.answer.correct_key;
      case 'FILL_IN_THE_BLANK':
        return userAnswer.toLowerCase().trim() === exercise.answer.correct_word.toLowerCase().trim();
      case 'MATCHING':
        return JSON.stringify(userAnswer.sort()) === JSON.stringify(exercise.answer.matches.sort());
      case 'WORD_FORM':
        return userAnswer.toLowerCase().trim() === exercise.answer.correct_form.toLowerCase().trim();
      case 'ERROR_CORRECTION':
        return userAnswer.incorrect === exercise.answer.incorrect_word && 
               userAnswer.correct.toLowerCase().trim() === exercise.answer.correct_word.toLowerCase().trim();
      case 'ODD_ONE_OUT':
        return userAnswer === exercise.answer.correct_key;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setIsCorrect(false);
    } else {
      // Calculate score
      const score = Object.keys(userAnswers).reduce((total, index) => {
        const exercise = exercises[parseInt(index)];
        const userAnswer = userAnswers[index];
        return total + (checkAnswer(exercise, userAnswer) ? 1 : 0);
      }, 0);
      
      onComplete(score, exercises.length);
    }
  };

  const renderExercise = () => {
    const exerciseProps = {
      exercise: currentExercise,
      onAnswer: handleAnswer,
      showAnswer,
      isCorrect,
      userAnswer: userAnswers[currentIndex]
    };

    switch (currentExercise.exercise_type) {
      case 'MULTIPLE_CHOICE':
        return <MultipleChoiceExercise {...exerciseProps} />;
      case 'FILL_IN_THE_BLANK':
        return <FillInBlankExercise {...exerciseProps} />;
      case 'MATCHING':
        return <MatchingExercise {...exerciseProps} />;
      case 'WORD_FORM':
        return <WordFormExercise {...exerciseProps} />;
      case 'ERROR_CORRECTION':
        return <ErrorCorrectionExercise {...exerciseProps} />;
      case 'ODD_ONE_OUT':
        return <OddOneOutExercise {...exerciseProps} />;
      default:
        return <div>Loại bài tập không được hỗ trợ</div>;
    }
  };

  if (!currentExercise) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <Title level={3}>Không có bài tập nào</Title>
        <Button onClick={onBack}>Quay lại</Button>
      </div>
    );
  }

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
        maxWidth: '900px',
        width: '100%',
        borderRadius: '20px',
        border: 'none',
        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(10px)'
      }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={onBack}
            >
              Quay lại trang chủ
            </Button>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <Paragraph style={{ margin: 0, color: '#666' }}>
                Câu {currentIndex + 1} / {exercises.length}
              </Paragraph>
              <Progress percent={progress} showInfo={false} size="small" />
            </div>
          </div>

          <div>
            <Title level={4} style={{ marginBottom: '16px' }}>
              <ReactMarkdown>{currentExercise.instruction}</ReactMarkdown>
            </Title>
            
            {renderExercise()}
            
            {showAnswer && (
              <Card 
                style={{ 
                  marginTop: '20px',
                  backgroundColor: isCorrect ? '#f6ffed' : '#fff2f0',
                  border: `1px solid ${isCorrect ? '#b7eb8f' : '#ffccc7'}`
                }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: isCorrect ? '#52c41a' : '#ff4d4f',
                    fontWeight: 'bold'
                  }}>
                    <CheckCircleOutlined style={{ marginRight: '8px' }} />
                    {isCorrect ? 'Chính xác!' : 'Chưa đúng'}
                  </div>
                  
                  <div>
                    <Title level={5}>Giải thích:</Title>
                    <ReactMarkdown>{currentExercise.explanation}</ReactMarkdown>
                  </div>
                  
                  {currentExercise.answer.key_vocabulary && currentExercise.answer.key_vocabulary.length > 0 && (
                    <div>
                      <Title level={5}>Từ vựng quan trọng:</Title>
                      {currentExercise.answer.key_vocabulary.map((vocab, index) => (
                        <div key={index} style={{ marginBottom: '4px' }}>
                          <strong>{vocab.word}</strong> {vocab.ipa && <span style={{ color: '#666' }}>{vocab.ipa}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </Space>
              </Card>
            )}
            
            {showAnswer && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button 
                  type="primary" 
                  size="large"
                  onClick={handleNext}
                >
                  {currentIndex < exercises.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành'}
                </Button>
              </div>
            )}
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default VocabularyExercise; 