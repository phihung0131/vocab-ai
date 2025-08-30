import React, { useState } from 'react';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import HomePage from './components/HomePage';
import VocabularyContainer from './components/VocabularyLearning/VocabularyContainer';
import SpeakingContainer from './components/SpeakingLearning/SpeakingContainer';
import VocabularyExercise from './components/VocabularyLearning/VocabularyExercise';
import SpeakingLesson from './components/SpeakingLearning/SpeakingLesson';
import './App.css';

function App() {
  const [currentMode, setCurrentMode] = useState('home'); // home, vocabulary, speaking, cached-vocabulary, cached-speaking
  const [cachedData, setCachedData] = useState(null);

  const handleSelectMode = (mode) => {
    setCurrentMode(mode);
    setCachedData(null);
  };

  const handleBackToHome = () => {
    setCurrentMode('home');
    setCachedData(null);
  };

  const handleLoadCachedExercise = (data) => {
    setCachedData(data);
    if (data.type === 'vocabulary') {
      setCurrentMode('cached-vocabulary');
    } else if (data.type === 'speaking') {
      setCurrentMode('cached-speaking');
    }
  };

  const handleCompleteVocabulary = (score, total) => {
    // Handle vocabulary completion - could add to history or show results
    setCurrentMode('home');
  };

  const handleRestartSpeaking = () => {
    setCurrentMode('speaking');
    setCachedData(null);
  };

  const renderCurrentComponent = () => {
    switch (currentMode) {
      case 'vocabulary':
        return <VocabularyContainer onBack={handleBackToHome} />;
      
      case 'speaking':
        return <SpeakingContainer onBack={handleBackToHome} />;
      
      case 'cached-vocabulary':
        return (
          <VocabularyExercise 
            exercises={cachedData.exercises}
            onBack={handleBackToHome}
            onComplete={handleCompleteVocabulary}
          />
        );
      
      case 'cached-speaking':
        return (
          <SpeakingLesson 
            lesson={cachedData.lesson}
            topic={cachedData.topic}
            level={cachedData.level}
            onBack={handleBackToHome}
            onRestart={handleRestartSpeaking}
          />
        );
      
      default:
        return (
          <HomePage 
            onSelectMode={handleSelectMode}
            onLoadCachedExercise={handleLoadCachedExercise}
          />
        );
    }
  };

  return (
    <ConfigProvider 
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 12,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }
      }}
    >
      <div className="App">
        {renderCurrentComponent()}
      </div>
    </ConfigProvider>
  );
}

export default App;
