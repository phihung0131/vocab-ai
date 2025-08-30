import React, { useState } from 'react';
import { Spin, Typography } from 'antd';
import { generateSpeakingLesson } from '../../services/aiService';
import SpeakingSetup from './SpeakingSetup';
import SpeakingLesson from './SpeakingLesson';

const { Title } = Typography;

const SpeakingContainer = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState('setup'); // setup, loading, lesson
  const [lessonData, setLessonData] = useState(null);

  const handleStartLearning = async (topic, level, forceNew = false) => {
    setCurrentStep('loading');
    
    try {
      const lesson = await generateSpeakingLesson(topic, level, forceNew);
      setLessonData(lesson);
      setCurrentStep('lesson');
    } catch (error) {
      console.error('Error starting speaking lesson:', error);
      setCurrentStep('setup');
      throw error;
    }
  };

  const handleRestart = () => {
    setCurrentStep('setup');
    setLessonData(null);
  };

  if (currentStep === 'loading') {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '40px',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
        }}>
          <Spin size="large" />
          <Title level={4} style={{ marginTop: '20px', color: '#666', marginBottom: '8px' }}>
            Đang tạo bài học cho bạn...
          </Title>
          <div style={{ color: '#999' }}>
            Vui lòng đợi trong giây lát
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'lesson') {
    return (
      <SpeakingLesson 
        lesson={lessonData.lesson}
        topic={lessonData.topic}
        level={lessonData.level}
        onBack={onBack}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <SpeakingSetup 
      onBack={onBack}
      onStartLearning={handleStartLearning}
    />
  );
};

export default SpeakingContainer; 