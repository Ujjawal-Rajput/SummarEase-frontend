import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
// import ExtractJsonFromResponse from './ExtractJsonFromResponse';

const FlashCard = ({ response }) => {
  const [expanded, setExpanded] = useState(false);
  // const [cardData, setCardData] = useState([]);
  const flashcardRef = useRef();

  //it set the data into cardData variable
  // useEffect(() => {
  //     // Call the function and store the result in state
  //     const extractedJson = ExtractJsonFromResponse(response);
  //     //need a different component for getting json of flashcard -> tommorrow
  //     console.log(extractedJson);
  //     setQuizData(extractedJson);
  // }, [response]);

  // Generate random colors for each flashcard
  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const backgroundColor = generateRandomColor(); // Assign random color

  const handleCardClick = () => {
    setExpanded(!expanded);
  };

  const handleDownload = () => {
    html2canvas(flashcardRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'flashcard.png';
      link.click();
    });
  };

  return (
    <div>
      <div
        ref={flashcardRef}
        className={`flashcard ${expanded ? 'expanded' : ''}`}
        style={{ backgroundColor }} // Apply random background color
        onClick={handleCardClick}
      >
        <div className="download-icon" onClick={handleDownload}>
        ⇩
        </div>
        <h2 className="flashcard-heading">Flashcard Heading</h2>
        <p className="flashcard-content">
          This is the content of the flashcard. It can contain text and an image. Click to expand and see more.
        </p>
        <img
          src="#"
          alt="Placeholder"
          className="flashcard-image"
        />
        <div className={`arrow ${expanded ? 'rotate' : ''}`}>▾</div>
      </div>
    </div>
  );
};

export default FlashCard;
