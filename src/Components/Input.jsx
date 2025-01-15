import React, { useState, useEffect } from 'react';
import { Send, Upload } from 'lucide-react';
import '../App.css';
import { currentSessionAtom, messageResponseAtom } from '../Store/State';
import { useRecoilState, useRecoilValue } from 'recoil';
import useSpeechToText from './useSpeechToText';
import { Mic, Disc } from 'lucide-react';
import { useParams } from 'react-router-dom';

function Input() {
    const [inputValue, setInputValue] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [messages, setMessages] = useRecoilState(messageResponseAtom);
    const { transcript, isListening, startListening, stopListening } = useSpeechToText();
    const currentSessionId = useRecoilValue(currentSessionAtom);
    const { session_id } = useParams();
    // const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        if (transcript) {
            setInputValue(transcript); // Update input field when speech is transcribed
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
        selectedFiles.forEach((file) => {
            formData.append("file", file); // Append each file with a unique key
        });

        console.log(JSON.stringify(formData));

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
            console.log(resp);
            // update state in recoil
            setMessages((messages) => [...messages, resp]);

            // reset the useStates
            setInputValue('');
            setSelectedFiles([]);

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="input-area">
            <form onSubmit={handleSubmit} className="input-form">
                <input
                    type="text"
                    name="message"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message here..."
                    className="message-input"
                />

                <input type="file" id="file-input" multiple onChange={handleFileInput} />
                <label htmlFor="file-input" className="input-buttons upload-button">
                    <Upload size={20} />
                </label>

                <button type="submit" disabled={session_id !== currentSessionId.sessionId} className="input-buttons send-button">
                    <Send size={20} />
                </button>

                {isListening ?
                    <div className='input-buttons microphone-button'>
                        <input id="audio-input" onClick={stopListening} disabled={!isListening} />
                        <label htmlFor="audio-input" style={{ color: "red" }} >
                            <Disc size={20} />
                        </label>
                    </div>
                    :
                    <div className='input-buttons microphone-button'>
                        <input id="audio-input" onClick={startListening} disabled={isListening} />
                        <label htmlFor="audio-input">
                            <Mic size={20} />
                        </label>
                    </div>
                }



            </form>

        </div>
    )
}

export default Input
