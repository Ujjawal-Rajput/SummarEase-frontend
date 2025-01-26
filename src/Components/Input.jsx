import React, { useState, useEffect } from 'react';
import { Send, Upload, Check } from 'lucide-react';
import '../App.css';
import { currentSessionAtom, messageResponseAtom, responseTopic } from '../Store/State';
import { useRecoilState, useRecoilValue } from 'recoil';
import useSpeechToText from '../Utils/useSpeechToText';
import { Mic, Disc } from 'lucide-react';
import { useParams } from 'react-router-dom';

function Input() {
    const [inputValue, setInputValue] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [messages, setMessages] = useRecoilState(messageResponseAtom);
    const [selectedOption, setSelectedOption] = useRecoilState(responseTopic);
    const { transcript, isListening, startListening, stopListening } = useSpeechToText();
    const currentSessionId = useRecoilValue(currentSessionAtom);
    const { session_id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    // const [isListening, setIsListening] = useState(false);

    const [rows, setRows] = useState(1);
    const maxLines = 8;

    const options = [
        { id: 'Ask-ai', label: 'Ask ai' },
        { id: 'Summarize', label: 'Summarize' },
        { id: 'Flashcard', label: 'Flashcard' },
        { id: 'Quiz', label: 'Quiz' },
    ];

    // useEffect(()=>{
    //     setSelectedOption('1');
    // },[])

    useEffect(() => {
        if (transcript) {
            setInputValue((previousInput) => previousInput + ' ' + transcript); // Update input field when speech is transcribed
        }
    }, [transcript]);

    // function handleStopListening() {
    //     setIsListening(false);
    //     stopListening();
    // }

    // function handleStartListening() {
    //     setIsListening(true);
    //     startListening();
    // }



    // const handleFileInput = (e) => {
    //     const files = Array.from(e.target.files);  // Convert FileList to Array
    //     console.log(files);
    //     setSelectedFiles(files); // Update state with the file
    // };

    const handleFileInput = (e) => {
        setSelectedFiles([...e.target.files]); // Store selected files in state
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // -------------------------------------------------------------
        //this code it optional because already disabled submit button
        if (session_id != currentSessionId.sessionId) {
            alert("Invalid sessionId is used");
            return;
        }
        // -------------------------------------------------------------
        setIsLoading(true);


        if (!inputValue.trim()) return;
        // const newMessage = {
        //     id: 1234,
        //     file: selectedFiles,
        //     message: inputValue
        // }

        // {'id': 1234, 'file': [{}, {}, {}, {}], 'message': 'hello'}

        // console.log(newMessage)

        // Create FormData
        const formData = new FormData();
        formData.append('message', inputValue);
        formData.append('session_id', session_id);
        formData.append('topic', selectedOption);
        selectedFiles.forEach((file) => {
            formData.append("file", file); // Append each file with a unique key
        });

        // console.log(JSON.stringify(formData));

        // Save the new message and its response to the backend while fetching the same response 
        try {
            const token = JSON.parse(localStorage.getItem('auth')).token; //{user: {email: "a@a.a", name: "a"}, token: "jwt-token"}

            if (!token) {
                throw new Error('Unauthorized');
            }
            // https://summarease-backend.onrender.com/get-response
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/get-response`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                },
                body: formData,
            });

            const resp = await response.json();
            // console.log(resp);

            // update state in recoil
            setMessages((messages) => [...messages, resp]);

            // reset the useStates
            setInputValue('');
            setSelectedFiles([]);
            setIsLoading(false);

        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent adding a new line
            handleSubmit(event); // Call the submit handler
        }
    };

    const handleInputChange = (e) => {
        const lineBreaks = e.target.value.split('\n').length; // Count the number of lines
        if (lineBreaks <= maxLines) {
            setInputValue(e.target.value);
            setRows(Math.min(lineBreaks, maxLines)); // Adjust rows up to maxLines
        } else {
            setInputValue(e.target.value); 
        }
    };

    return (
        <div className="input-area">
            <form onSubmit={handleSubmit} className="input-form">



                {/* -------------- */}
                <div className="radioGroup">
                    {options.map((option) => (
                        <div key={option.id}>
                            <input
                                type="radio"
                                id={option.id}
                                name="options"
                                value={option.id}
                                checked={selectedOption === option.id}
                                onChange={(e) => setSelectedOption(e.target.value)}
                                className='radioInput'
                            />
                            <label htmlFor={option.id} className="radioLabel">
                                <div className="checkCircle">
                                    {selectedOption === option.id && (
                                        <Check className="checkIcon" size={16} />
                                    )}
                                </div>
                                <span className="radioText">{option.label}</span>
                            </label>
                        </div>
                    ))}
                </div>
                {/* -------------- */}


                <textarea
                    type="text"
                    name="message"
                    value={inputValue}
                    onKeyDown={handleKeyDown}
                    rows={rows}
                    onChange={handleInputChange}
                    placeholder="Type your message here..."
                    className={isLoading ? "message-input loading-input" : "message-input"}
                    disabled={isLoading}
                    required
                />

                <input type="file" id="file-input" multiple onChange={handleFileInput} />
                <label htmlFor="file-input" className="input-buttons upload-button">
                    <Upload size={20} />
                    <span className="tooltiptext">Only (.pdf, .docx, .csv, .txt) are supported</span>
                </label>

                <button type="submit" disabled={session_id !== currentSessionId.sessionId} className="input-buttons send-button">
                    <Send size={20} />
                </button>

                {isListening ?
                    <div className='input-buttons microphone-button'>
                        <input id="audio-input" onClick={stopListening} disabled={!isListening} />
                        <label htmlFor="audio-input" style={{ color: "red", cursor: 'pointer' }} >
                            <Disc size={20} />
                        </label>
                    </div>
                    :
                    <div className='input-buttons microphone-button'>
                        <input id="audio-input" onClick={startListening} disabled={isListening} />
                        <label htmlFor="audio-input" style={{ cursor: 'pointer' }}>
                            <Mic size={20} />
                        </label>
                    </div>
                }



            </form>

        </div>
    )
}

export default Input
