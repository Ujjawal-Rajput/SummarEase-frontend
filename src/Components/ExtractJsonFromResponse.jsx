export default function ExtractJsonFromResponse(text) {
    // First clean up the text by ensuring proper JSON formatting
    const cleanText = text
      // Remove any whitespace between objects
      .replace(/}\s+{/g, '},{')
      // Wrap multiple objects in an array if they're not already
      .replace(/^{\s*/, '[{')
      .replace(/}\s*$/, '}]')
      // Handle case where it's already wrapped in array
      .replace(/^\[\s*\[/, '[')
      .replace(/\]\s*\]$/, ']');
  
    try {
      // Try parsing the entire text as a JSON array
      const parsed = JSON.parse(cleanText);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      // Fallback to individual object parsing if array parsing fails
      const jsonPattern = /{(?:[^{}]|{[^{}]*})*}/g;
      const matches = text.match(jsonPattern) || [];
      
      return matches.map(match => {
        try {
          return JSON.parse(match.trim());
        } catch (error) {
          console.error('Failed to parse JSON object:', match);
          return null;
        }
      }).filter(Boolean);
    }
  }