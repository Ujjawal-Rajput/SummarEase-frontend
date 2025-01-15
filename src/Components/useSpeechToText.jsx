import { useState } from 'react';

const useSpeechToText = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.continuous = false; // Keep listening for more speech
  recognition.interimResults = false; // Show only final results
  recognition.lang = 'en-US'; // Set language

  const startListening = () => {
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  recognition.onresult = (event) => {
    const speechToText = event.results[0][0].transcript;
    setTranscript(speechToText);
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    if (event.error === 'no-speech') {
      alert('No speech detected. Please speak clearly and try again.');
    } else {
      alert(`Error: ${event.error}`);
    }
    setIsListening(false);
  };

  recognition.onend = () => {
    setIsListening(false); // Set to false when recognition ends
  };

  return { transcript,isListening, startListening, stopListening };
};

export default useSpeechToText;
