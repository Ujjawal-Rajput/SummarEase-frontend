import React, { useState } from 'react';
import { Send, Upload } from 'lucide-react';
import '../App.css';
import { messageResponseAtom } from '../Store/State';
import { useRecoilState } from 'recoil';

function Input() {
    const [inputValue, setInputValue] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [messages, setMessages] = useRecoilState(messageResponseAtom);

    const handleFileInput = (e) => {
        const files = Array.from(e.target.files);  // Convert FileList to Array
        console.log(files);
        setSelectedFiles(files); // Update state with the file
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newMessage = {
            id: 1234,
            file: selectedFiles,
            message: inputValue
        }

        // Save the new message and its response to the backend while fetching the same response 
        try {
            // https://summarease-backend.onrender.com/get-response
            const response = await fetch('http://127.0.0.1:5000/get-response', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMessage),
            });
            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }
            const resp = await response.json();

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
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message here..."
                    className="message-input"
                />

                <input type="file" id="file-input" onChange={handleFileInput} />
                <label htmlFor="file-input" className="upload-button">
                    <Upload size={20} />
                </label>

                <button type="submit" className="send-button">
                    <Send size={20} />
                </button>
            </form>

        </div>
    )
}

export default Input
