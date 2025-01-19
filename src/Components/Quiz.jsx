import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import ExtractJsonFromResponse from './ExtractJsonFromResponse';

function Quiz({ response, topic }) {
    const [quizData, setQuizData] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});


    //it set the data into quizData variable
    useEffect(() => {
        // Call the function and store the result in state
        const extractedJson = ExtractJsonFromResponse(response, topic);
        console.log(extractedJson);
        setQuizData(extractedJson);
    }, [response]);

    

    const handleOptionSelect = (questionId, optionId) => {
        setSelectedAnswers(prev => ({
          ...prev,
          [questionId]: optionId
        }));
      };
    
      const getOptionClassName = (questionId, option) => {
        const isSelected = selectedAnswers[questionId] === option.id;
        const hasAnswer = selectedAnswers[questionId] !== undefined;
        
        if (!hasAnswer) return 'option';
        if (option.isCorrect) return 'option correct';
        if (isSelected) return 'option wrong';
        return 'option';
      };
    
      const shouldShowIcon = (questionId, option) => {
        const isSelected = selectedAnswers[questionId] === option.id;
        const hasAnswer = selectedAnswers[questionId] !== undefined;
        
        return (isSelected || (hasAnswer && option.isCorrect));
      };
    
      const calculateScore = () => {
        let score = 0;
        quizData.forEach(question => {
          const selectedOption = question.options.find(opt => opt.id === selectedAnswers[question.id]);
          if (selectedOption?.isCorrect) {
            score++;
          }
        });
        return score;
      };
    
      const score = calculateScore();
      const totalQuestions = quizData.length;
      const hasAnsweredAll = Object.keys(selectedAnswers).length === totalQuestions;
    
      return (
        <div className="container">
          <div className="quiz-container">

            {quizData.map((question,index) => (
              <div key={question.id} className="question-card">
                <h2 className="question">{index + 1}. {question.question}</h2>
                <div className="options-grid">
                  {question.options.map((option) => (
                    <button
                      key={option.id}
                      className={getOptionClassName(question.id, option)}
                      onClick={() => handleOptionSelect(question.id, option.id)}
                      disabled={selectedAnswers[question.id] !== undefined}
                    >
                      {shouldShowIcon(question.id, option) && (
                        <div className={`check-icon ${option.isCorrect ? 'correct' : 'wrong'}`}>
                          {option.isCorrect ? <Check size={16} /> : <X size={16} />}
                        </div>
                      )}
                      <span className="option-text">{option.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {hasAnsweredAll && (
              <div className="score-display">
                Final Score: <span className="score-number">{score}</span> out of {totalQuestions}
              </div>
            )}
          </div>
        </div>
      );
}

export default Quiz
