import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import ExtractJsonFromResponse from './ExtractJsonFromResponse';

const FlashCard = ({ response, topic }) => {
  const [cardData, setCardData] = useState([]);
  const flashcardRef = useRef();

  // it set the data into cardData variable
  useEffect(() => {
    // Call the function and store the result in state
    const extractedJson = ExtractJsonFromResponse(response, topic);
    // console.log(extractedJson);
    setCardData(extractedJson);
  }, [response]);

  // // Generate random colors for each flashcard
  // const generateRandomColor = () => {
  //   const letters = '0123456789ABCDEF';
  //   let color = '#';
  //   for (let i = 0; i < 6; i++) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   return color;
  // };

  // const backgroundColor = generateRandomColor(); // Assign random color


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

      {cardData.length > 0 && (
        <button
          onClick={handleDownload}
          className='flashcard-download-button'>
          Download Flashcards as Image
        </button>
      )}
      
      <div ref={flashcardRef} className='flashcard-outerdiv'>
        {cardData.map((card, index) => (
          <div
            className='flashcard-innerdiv'
            key={index}
            style={{
              backgroundColor: 'rgb(24, 31, 46)',
              // backgroundColor: generateRandomColor(),
              // transform: expanded ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            <h3>{index + 1}. {card.heading}</h3><br />
            <ul>
              {card.description.map((option, optIndex) => (
                <li key={optIndex}>
                  <strong>{optIndex + 1}. </strong>
                  {option.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    </div>
  );
};

export default FlashCard;
