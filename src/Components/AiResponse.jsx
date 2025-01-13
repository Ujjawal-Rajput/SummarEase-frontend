import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AiResponse = ({ response }) => {
    const [displayedText, setDisplayedText] = useState(''); // Text to display
    const [currentIndex, setCurrentIndex] = useState(0); // Current index in the response
    const charsPerTick = 10; // Number of characters to append per tick
  
    useEffect(() => {
      if (currentIndex < response.length) {
        const timeout = setTimeout(() => {
          setDisplayedText((prev) => prev + response.slice(currentIndex, currentIndex + charsPerTick));
          setCurrentIndex((prev) => prev + charsPerTick);
        }, 20); // Adjust speed here (20ms per tick)
        return () => clearTimeout(timeout);
      }
    }, [currentIndex, response]);

    return (
        <div style={{ padding: '1rem', lineHeight: '30px' }}>
            <ReactMarkdown
                children={displayedText}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                children={String(children).replace(/\n$/, '')}
                                style={darcula}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                            />
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                    strong: ({ children }) => <strong style={{ color: '#fff', fontSize: '16px' }}>{children}</strong>,
                }}
            />
        </div>
    );
};

export default AiResponse;
