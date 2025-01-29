import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AiResponse = ({ response }) => {
    const [displayedText, setDisplayedText] = useState(''); // Text to display
    const [currentIndex, setCurrentIndex] = useState(0); // Current index in the response
    const charsPerTick = 10; // Number of characters to append per tick
    const [copiedCodeId, setCopiedCodeId] = useState(null); // Track which code block was copied


    useEffect(() => {
        if (response && currentIndex < response.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + response.slice(currentIndex, currentIndex + charsPerTick));
                setCurrentIndex((prev) => prev + charsPerTick);
            }, 20); // Adjust speed here (20ms per tick)
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, response]);

    const handleCopy = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedCodeId(id); // Set the copied code block ID
        setTimeout(() => setCopiedCodeId(null), 2000); // Reset after 2 seconds
    };

    return (
        <div style={{ lineHeight: '30px' }}>
            <ReactMarkdown
                children={displayedText}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeString = String(children).replace(/\n$/, '');
                        const id = node.position.start.line; // Unique ID based on line number


                        return !inline && match ? (
                            <div style={{ position: 'relative' }}>
                                <SyntaxHighlighter
                                    children={codeString}
                                    style={darcula}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                /><button
                                    onClick={() => handleCopy(codeString, id)}
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        backgroundColor: '#333',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '5px 10px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {copiedCodeId === id ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
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
