export default function ExtractJsonFromResponse(text,topic) {
    // Clean up the input text
    const cleanText = text
      // Ensure proper separation between JSON objects
      .replace(/}\s+{/g, '},{')
      // Wrap multiple objects in an array if not already wrapped
      .replace(/^{\s*/, '[{')
      .replace(/}\s*$/, '}]')
      // Handle cases where it is already wrapped in an array
      .replace(/^\[\s*\[/, '[')
      .replace(/\]\s*\]$/, ']');
  
    try {
      // Try parsing the entire text as a JSON array
      const parsed = JSON.parse(cleanText);
  
      // Validate each JSON object and filter out incomplete or invalid ones
      return Array.isArray(parsed)
        ? parsed.filter(validateJsonObject)
        : [parsed].filter(validateJsonObject);
    } catch (error) {
      // Fallback to individual JSON object parsing if array parsing fails
      const jsonPattern = /{(?:[^{}]|{[^{}]*})*}/g; // Matches JSON objects
      const matches = text.match(jsonPattern) || [];
  
      return matches
        .map((match) => {
          try {
            const jsonObject = JSON.parse(match.trim());
            if (topic === 'Quiz') return validateJsonObjectForQuiz(jsonObject) ? jsonObject : null;
            else if (topic === 'Flashcard') return validateJsonObjectForFlashcard(jsonObject) ? jsonObject : null;
            else return null;
          } catch (error) {
            console.error('Failed to parse JSON object:', match);
            return null;
          }
        })
        .filter(Boolean); // Filter out invalid or null results
    }
  }

  
  function validateJsonObjectForQuiz(obj) {
    // Define required keys (customize this based on your JSON structure)
    const requiredKeys = ['id', 'question', 'options'];
  
    // Ensure the object is valid, contains all required keys, and exactly 4 options
    return (
      typeof obj === 'object' &&
      obj !== null &&
      requiredKeys.every((key) => key in obj) &&
      Array.isArray(obj.options) &&
      obj.options.length === 4 && // Ensure exactly 4 options
      obj.options.every(
        (option) =>
          typeof option === 'object' &&
          'id' in option &&
          'text' in option &&
          'isCorrect' in option
      ) // Validate each option
    );
  }


  function validateJsonObjectForFlashcard(obj) {
    // Define required keys (customize this based on your JSON structure)
    const requiredKeys = ['id', 'heading', 'description'];
  
    return (
      typeof obj === 'object' &&
      obj !== null &&
      requiredKeys.every((key) => key in obj) &&
      Array.isArray(obj.description) &&
      obj.description.every(
        (option) =>
          typeof option === 'object' &&
          'id' in option &&
          'text' in option
      ) // Validate each option
    );
  }
  