const CACHE_KEYS = {
  VOCABULARY_EXERCISES: 'vocab_exercises',
  SPEAKING_LESSONS: 'speaking_lessons',
  EXERCISE_HISTORY: 'exercise_history'
};

const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Create cache entry with timestamp
const createCacheEntry = (data) => ({
  data,
  timestamp: Date.now(),
  id: generateId()
});

// Generate unique ID
const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Check if cache entry is valid
const isCacheValid = (cacheEntry) => {
  if (!cacheEntry || !cacheEntry.timestamp) return false;
  return (Date.now() - cacheEntry.timestamp) < CACHE_EXPIRY;
};

// Vocabulary Exercises Cache
export const cacheVocabularyExercises = (topic, numberOfQuestions, exercises) => {
  try {
    const cacheKey = `${CACHE_KEYS.VOCABULARY_EXERCISES}_${topic}_${numberOfQuestions}`;
    const cacheEntry = createCacheEntry({
      topic,
      numberOfQuestions,
      exercises,
      type: 'vocabulary'
    });
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
    addToHistory(cacheEntry);
    return cacheEntry.id;
  } catch (error) {
    console.error('Error caching vocabulary exercises:', error);
    return null;
  }
};

export const getCachedVocabularyExercises = (topic, numberOfQuestions) => {
  try {
    const cacheKey = `${CACHE_KEYS.VOCABULARY_EXERCISES}_${topic}_${numberOfQuestions}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const cacheEntry = JSON.parse(cached);
      if (isCacheValid(cacheEntry)) {
        return cacheEntry.data.exercises;
      } else {
        localStorage.removeItem(cacheKey);
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting cached vocabulary exercises:', error);
    return null;
  }
};

// Speaking Lessons Cache
export const cacheSpeakingLesson = (topic, level, lesson) => {
  try {
    const cacheKey = `${CACHE_KEYS.SPEAKING_LESSONS}_${topic}_${level}`;
    const cacheEntry = createCacheEntry({
      topic,
      level,
      lesson,
      type: 'speaking'
    });
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
    addToHistory(cacheEntry);
    return cacheEntry.id;
  } catch (error) {
    console.error('Error caching speaking lesson:', error);
    return null;
  }
};

export const getCachedSpeakingLesson = (topic, level) => {
  try {
    const cacheKey = `${CACHE_KEYS.SPEAKING_LESSONS}_${topic}_${level}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const cacheEntry = JSON.parse(cached);
      if (isCacheValid(cacheEntry)) {
        return cacheEntry.data.lesson;
      } else {
        localStorage.removeItem(cacheKey);
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting cached speaking lesson:', error);
    return null;
  }
};

// History Management
const addToHistory = (cacheEntry) => {
  try {
    const history = getHistory();
    const newHistory = [cacheEntry, ...history.filter(item => item.id !== cacheEntry.id)];
    
    // Keep only last 20 items
    const limitedHistory = newHistory.slice(0, 20);
    localStorage.setItem(CACHE_KEYS.EXERCISE_HISTORY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Error adding to history:', error);
  }
};

export const getHistory = () => {
  try {
    const history = localStorage.getItem(CACHE_KEYS.EXERCISE_HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
};

export const clearHistory = () => {
  try {
    localStorage.removeItem(CACHE_KEYS.EXERCISE_HISTORY);
  } catch (error) {
    console.error('Error clearing history:', error);
  }
};

export const getCachedExerciseById = (id) => {
  try {
    const history = getHistory();
    const cacheEntry = history.find(item => item.id === id);
    
    if (cacheEntry && isCacheValid(cacheEntry)) {
      return cacheEntry.data;
    }
    return null;
  } catch (error) {
    console.error('Error getting cached exercise by ID:', error);
    return null;
  }
};

// Clear specific cache when creating new exercises
export const clearVocabularyCache = (topic, numberOfQuestions) => {
  try {
    const cacheKey = `${CACHE_KEYS.VOCABULARY_EXERCISES}_${topic}_${numberOfQuestions}`;
    localStorage.removeItem(cacheKey);
  } catch (error) {
    console.error('Error clearing vocabulary cache:', error);
  }
};

export const clearSpeakingCache = (topic, level) => {
  try {
    const cacheKey = `${CACHE_KEYS.SPEAKING_LESSONS}_${topic}_${level}`;
    localStorage.removeItem(cacheKey);
  } catch (error) {
    console.error('Error clearing speaking cache:', error);
  }
}; 