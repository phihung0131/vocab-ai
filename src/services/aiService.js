import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  getCachedVocabularyExercises, 
  cacheVocabularyExercises, 
  clearVocabularyCache,
  getCachedSpeakingLesson,
  cacheSpeakingLesson,
  clearSpeakingCache
} from './cacheService';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const VOCABULARY_PROMPT_TEMPLATE = `Bạn là một AI chuyên tạo bài tập học từ vựng tiếng Anh. Nhiệm vụ của bạn là tạo ra một loạt bài tập đa dạng dựa trên chủ đề và số lượng câu hỏi được cung cấp, sau đó trả về kết quả dưới dạng một cấu trúc JSON nghiêm ngặt.

**Yêu cầu:**

1.  **Chủ đề:** {{TOPIC}}
2.  **Số lượng bài tập:** {{NUMBER_OF_QUESTIONS}}

**Định dạng JSON đầu ra:**
Phản hồi PHẢI LÀ một đối tượng JSON duy nhất, không có bất kỳ văn bản, giải thích hay markdown nào bên ngoài khối JSON. Đối tượng JSON này có một khóa chính là exercises, là một mảng (array) các đối tượng bài tập.

Mỗi đối tượng bài tập trong mảng exercises phải có cấu trúc chính xác như sau:
{
  "exercise_id": integer, // Số thứ tự của bài tập (1, 2, 3, ...)
  "exercise_type": string, // Loại bài tập. PHẢI LÀ một trong các giá trị sau: "MULTIPLE_CHOICE", "FILL_IN_THE_BLANK", "MATCHING", "WORD_FORM", "ERROR_CORRECTION", "ODD_ONE_OUT".
  "instruction": string, // Hướng dẫn làm bài bằng tiếng Việt (có thể dùng Markdown).
  "problem": {
    // Cấu trúc của đối tượng này thay đổi tùy theo exercise_type
  },
  "answer": {
    // Cấu trúc của đối tượng này thay đổi tùy theo exercise_type.
    // Thêm trường key_vocabulary để cung cấp từ mới và phiên âm IPA.
    "key_vocabulary": [
      {
        "word": "từ vựng chính",
        "ipa": "/phiên âm IPA/ : /nghĩa tiếng việt/"
      }
    ]
  },
  "explanation": string // Giải thích chi tiết đáp án bằng tiếng Việt (có thể dùng Markdown).
}

**Cấu trúc chi tiết cho từng exercise_type:**

*   **Nếu exercise_type là "MULTIPLE_CHOICE":**
    *   problem: {"question": "Câu hỏi Markdown có chỗ trống __BLANK__.", "options": [{"key": "A", "value": "Nội dung đáp án A"}, ...]}
    *   answer: {"correct_key": "B", "key_vocabulary": [...]}

*   **Nếu exercise_type là "FILL_IN_THE_BLANK":**
    *   problem: {"sentence": "Câu Markdown có chỗ trống __BLANK__.", "word_bank": ["từ 1", "từ 2", ...]}
    *   answer: {"correct_word": "từ đúng", "key_vocabulary": [...]}

*   **Nếu exercise_type là "MATCHING" (Nối từ):**
    *   problem: {"type": "SYNONYMS" | "ANTONYMS" | "DEFINITIONS", "column_a": [{"key": "1", "value": "từ 1"}, ...], "column_b": [{"key": "a", "value": "định nghĩa/từ đồng nghĩa a"}, ...]}
    *   answer: {"matches": [{"key_a": "1", "key_b": "a"}, ...], "key_vocabulary": [...]} (key_vocabulary gồm tất cả các từ trong column_a).

*   **Nếu exercise_type là "WORD_FORM" (Dạng đúng của từ):**
    *   problem: {"sentence": "Câu Markdown có chỗ trống __BLANK__.", "base_word": "WORD"}
    *   answer: {"correct_form": "wordform", "key_vocabulary": [...]}

*   **Nếu exercise_type là "ERROR_CORRECTION" (Tìm và sửa lỗi sai):**
    *   problem: {"sentence": "Câu này chứa một từ bị dùng **sai**."}
    *   answer: {"incorrect_word": "sai", "correct_word": "đúng", "key_vocabulary": [...]}

*   **Nếu exercise_type là "ODD_ONE_OUT" (Tìm từ khác loại):**
    *   problem: {"options": [{"key": "A", "value": "word A"}, {"key": "B", "value": "word B"}, ...]}
    *   answer: {"correct_key": "C", "key_vocabulary": [...]} (key_vocabulary gồm tất cả các từ trong options).

**Luật bổ sung:**
- **Markdown:** Sử dụng Markdown để định dạng nội dung trong các trường instruction, các chuỗi văn bản trong problem, và explanation để tăng tính rõ ràng. Ví dụ: **từ khóa**, *ghi chú*.
- **Đa dạng:** Phân bổ các exercise_type một cách hợp lý để người học không bị nhàm chán.
- **Phiên âm:** Luôn cung cấp phiên âm IPA chính xác và nghĩa kèm sau trong trường key_vocabulary.
- **Ngôn ngữ:** Tất cả nội dung văn bản cho người dùng phải bằng tiếng Việt.`;

export const generateVocabularyExercises = async (topic, numberOfQuestions, forceNew = false) => {
  try {
    // Check cache first unless forced to create new
    if (!forceNew) {
      const cachedExercises = getCachedVocabularyExercises(topic, numberOfQuestions);
      if (cachedExercises) {
        return cachedExercises;
      }
    } else {
      // Clear existing cache when creating new
      clearVocabularyCache(topic, numberOfQuestions);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = VOCABULARY_PROMPT_TEMPLATE
      .replace('{{TOPIC}}', topic)
      .replace('{{NUMBER_OF_QUESTIONS}}', numberOfQuestions);

    const result = await model.generateContent(prompt);
    
    // Check if request was successful
    if (!result || !result.response) {
      throw new Error('API request failed - no response received');
    }

    // Handle the actual Gemini API response format
    let responseText;
    const response = await result.response;
    
    // Check for API errors or blocked content
    if (!response.candidates || response.candidates.length === 0) {
      if (response.promptFeedback?.blockReason) {
        throw new Error(`Content blocked: ${response.promptFeedback.blockReason}`);
      }
      throw new Error('No response generated - please try again with a different topic');
    }

    const candidate = response.candidates[0];
    if (candidate.finishReason !== 'STOP') {
      throw new Error(`Generation incomplete: ${candidate.finishReason}`);
    }

    responseText = candidate.content.parts[0].text;
    
    if (!responseText || responseText.trim().length === 0) {
      throw new Error('Empty response received - please try again');
    }
    
    // Extract JSON from markdown code blocks if present
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/```\n([\s\S]*?)\n```/);
    const jsonText = jsonMatch ? jsonMatch[1] : responseText;
    
    // Parse JSON response
    let jsonData;
    try {
      jsonData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response text:', responseText);
      throw new Error('Invalid JSON response - please try again');
    }
    
    if (!jsonData.exercises || !Array.isArray(jsonData.exercises)) {
      throw new Error('Invalid response format: missing exercises array');
    }

    if (jsonData.exercises.length === 0) {
      throw new Error('No exercises generated - please try again');
    }
    
    // Cache the new exercises
    cacheVocabularyExercises(topic, numberOfQuestions, jsonData.exercises);
    
    return jsonData.exercises;
  } catch (error) {
    console.error('Error generating vocabulary exercises:', error);
    throw new Error('Không thể tạo bài tập. Vui lòng thử lại.');
  }
};

export const generateSpeakingLesson = async (topic, level, forceNew = false) => {
  try {
    // Check cache first unless forced to create new
    if (!forceNew) {
      const cachedLesson = getCachedSpeakingLesson(topic, level);
      if (cachedLesson) {
        return { lesson: cachedLesson, topic, level };
      }
    } else {
      // Clear existing cache when creating new
      clearSpeakingCache(topic, level);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // TODO: The user will provide the actual speaking prompt
    const prompt = `Tạo bài học luyện nói tiếng Anh cho chủ đề "${topic}" ở trình độ ${level}. 
    Bài học cần bao gồm:
    - Từ vựng quan trọng với phiên âm
    - Các câu giao tiếp thường dùng
    - Tình huống thực tế để thực hành
    - Câu hỏi để người học tự đặt
    Trả về kết quả bằng tiếng Việt trong định dạng markdown dễ đọc.`;
    
    const result = await model.generateContent(prompt);
    
    // Check if request was successful
    if (!result || !result.response) {
      throw new Error('API request failed - no response received');
    }

    // Handle the actual Gemini API response format
    const response = await result.response;
    
    // Check for API errors or blocked content
    if (!response.candidates || response.candidates.length === 0) {
      if (response.promptFeedback?.blockReason) {
        throw new Error(`Content blocked: ${response.promptFeedback.blockReason}`);
      }
      throw new Error('No response generated - please try again with a different topic');
    }

    const candidate = response.candidates[0];
    if (candidate.finishReason !== 'STOP') {
      throw new Error(`Generation incomplete: ${candidate.finishReason}`);
    }

    const responseText = candidate.content.parts[0].text;
    
    if (!responseText || responseText.trim().length === 0) {
      throw new Error('Empty response received - please try again');
    }
    
    // Cache the new lesson
    cacheSpeakingLesson(topic, level, responseText);
    
    return { lesson: responseText, topic, level };
  } catch (error) {
    console.error('Error generating speaking lesson:', error);
    throw new Error('Không thể tạo bài học nói. Vui lòng thử lại.');
  }
}; 