import React, { useState } from 'react';
import { Spin, Typography } from 'antd';
import { generateVocabularyExercises } from '../../services/aiService';
import VocabularySetup from './VocabularySetup';
import VocabularyExercise from './VocabularyExercise';
import VocabularyResult from './VocabularyResult';

const { Title } = Typography;

const VocabularyContainer = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState('setup'); // setup, loading, exercise, result
  const [exercises, setExercises] = useState([]);
  const [result, setResult] = useState(null);

  const handleStartLearning = async (topic, numberOfQuestions, forceNew = false) => {
    setCurrentStep('loading');
    
    try {
      const generatedExercises = await generateVocabularyExercises(topic, numberOfQuestions, forceNew);
      setExercises(generatedExercises);
      setCurrentStep('exercise');
    } catch (error) {
      console.error('Error starting learning:', error);
      setCurrentStep('setup');
      throw error;
    }
  };

  const handleComplete = (score, total) => {
    setResult({ score, total });
    setCurrentStep('result');
  };

  const handleRestart = () => {
    setCurrentStep('setup');
    setExercises([]);
    setResult(null);
  };

  if (currentStep === 'loading') {
    return (
      <div style={{ 
        padding: '40px 20px', 
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Spin size="large" />
        <Title level={4} style={{ marginTop: '20px', color: '#666' }}>
          Đang tạo bài tập cho bạn...
        </Title>
        <div style={{ color: '#999', marginTop: '8px' }}>
          Vui lòng đợi trong giây lát
        </div>
      </div>
    );
  }

  if (currentStep === 'exercise') {
    return (
      <VocabularyExercise 
        exercises={exercises}
        onBack={onBack}
        onComplete={handleComplete}
      />
    );
  }

  if (currentStep === 'result') {
    return (
      <VocabularyResult 
        score={result.score}
        total={result.total}
        onBack={onBack}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <VocabularySetup 
      onBack={onBack}
      onStartLearning={handleStartLearning}
    />
  );
};

export default VocabularyContainer; 