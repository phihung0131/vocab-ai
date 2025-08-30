import React, { useState } from 'react';
import { Card, Button, Space, Typography } from 'antd';

const { Text } = Typography;

const MatchingExercise = ({ exercise, onAnswer, showAnswer, userAnswer }) => {
  const [matches, setMatches] = useState(userAnswer || []);
  const [selectedA, setSelectedA] = useState(null);
  const [selectedB, setSelectedB] = useState(null);

  const handleItemClick = (column, key) => {
    if (showAnswer) return;

    if (column === 'A') {
      setSelectedA(selectedA === key ? null : key);
      setSelectedB(null);
    } else {
      if (selectedA) {
        // Create or update match
        const newMatches = matches.filter(m => m.key_a !== selectedA && m.key_b !== key);
        newMatches.push({ key_a: selectedA, key_b: key });
        setMatches(newMatches);
        setSelectedA(null);
        setSelectedB(null);
      } else {
        setSelectedB(selectedB === key ? null : key);
      }
    }
  };

  const getMatchForA = (keyA) => {
    const match = matches.find(m => m.key_a === keyA);
    return match ? match.key_b : null;
  };

  const getMatchForB = (keyB) => {
    const match = matches.find(m => m.key_b === keyB);
    return match ? match.key_a : null;
  };

  const isMatched = (column, key) => {
    if (column === 'A') {
      return getMatchForA(key) !== null;
    } else {
      return getMatchForB(key) !== null;
    }
  };

  const getCardStyle = (column, key) => {
    const baseStyle = {
      cursor: showAnswer ? 'default' : 'pointer',
      marginBottom: '8px',
      transition: 'all 0.2s',
      border: '1px solid #d9d9d9'
    };

    if (showAnswer) {
      // Show correct/incorrect matches
      const correctMatch = exercise.answer.matches.find(m => 
        column === 'A' ? m.key_a === key : m.key_b === key
      );
      const userMatch = column === 'A' ? getMatchForA(key) : getMatchForB(key);
      
      if (correctMatch) {
        const isCorrectMatch = column === 'A' 
          ? correctMatch.key_b === userMatch 
          : correctMatch.key_a === userMatch;
        
        return {
          ...baseStyle,
          backgroundColor: isCorrectMatch ? '#f6ffed' : '#fff2f0',
          borderColor: isCorrectMatch ? '#52c41a' : '#ff4d4f'
        };
      }
    } else {
      // Interactive state
      if (column === 'A' && selectedA === key) {
        return { ...baseStyle, backgroundColor: '#e6f7ff', borderColor: '#1890ff' };
      }
      if (column === 'B' && selectedB === key) {
        return { ...baseStyle, backgroundColor: '#e6f7ff', borderColor: '#1890ff' };
      }
      if (isMatched(column, key)) {
        return { ...baseStyle, backgroundColor: '#f0f0f0', borderColor: '#d9d9d9' };
      }
    }

    return baseStyle;
  };

  const handleSubmit = () => {
    if (matches.length === exercise.problem.column_a.length) {
      onAnswer(matches);
    }
  };

  const getTypeLabel = () => {
    switch (exercise.problem.type) {
      case 'SYNONYMS': return 'Nối từ đồng nghĩa';
      case 'ANTONYMS': return 'Nối từ trái nghĩa';
      case 'DEFINITIONS': return 'Nối từ với định nghĩa';
      default: return 'Nối từ';
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Text style={{ fontSize: '16px', color: '#666' }}>
        {getTypeLabel()}
      </Text>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <Text strong style={{ display: 'block', marginBottom: '12px' }}>Cột A</Text>
          {exercise.problem.column_a.map((item) => (
            <Card
              key={item.key}
              size="small"
              onClick={() => handleItemClick('A', item.key)}
              style={getCardStyle('A', item.key)}
            >
              <Text>{item.key}. {item.value}</Text>
              {isMatched('A', item.key) && (
                <Text style={{ color: '#666', fontSize: '12px', display: 'block' }}>
                  → {getMatchForA(item.key)}
                </Text>
              )}
            </Card>
          ))}
        </div>
        
        <div>
          <Text strong style={{ display: 'block', marginBottom: '12px' }}>Cột B</Text>
          {exercise.problem.column_b.map((item) => (
            <Card
              key={item.key}
              size="small"
              onClick={() => handleItemClick('B', item.key)}
              style={getCardStyle('B', item.key)}
            >
              <Text>{item.key}. {item.value}</Text>
              {isMatched('B', item.key) && (
                <Text style={{ color: '#666', fontSize: '12px', display: 'block' }}>
                  ← {getMatchForB(item.key)}
                </Text>
              )}
            </Card>
          ))}
        </div>
      </div>

      {selectedA && (
        <Text style={{ color: '#1890ff' }}>
          Đã chọn {selectedA} từ cột A. Hãy chọn một mục từ cột B để nối.
        </Text>
      )}
      
      {!showAnswer && (
        <Button 
          type="primary" 
          onClick={handleSubmit} 
          disabled={matches.length < exercise.problem.column_a.length}
          size="large"
        >
          Xác nhận đáp án ({matches.length}/{exercise.problem.column_a.length} cặp)
        </Button>
      )}
    </Space>
  );
};

export default MatchingExercise; 