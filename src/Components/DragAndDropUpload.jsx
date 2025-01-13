import React, { useState } from 'react';
import '../App.css';

const DragAndDropUpload = () => {
    const [dragging, setDragging] = useState(false);

    const handleDragIn = (e) => {
        e.preventDefault();
        console.log("dragged in");
        setDragging(true);
    };

    const handleDragOut = (e) => {
        e.preventDefault();
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const files = e.dataTransfer.files;
        console.log(files); // Handle file upload here
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        console.log(files); // Handle file upload here
    };

    return (
        <div
            className={`upload-box ${dragging ? 'dragging' : ''}`}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDrop={handleDrop}
        >
            <div className="upload-icon">📤</div>
            <p>Drag & Drop files here</p>
            <p>or</p>


            <input
                type="file"
                id="file-input"
                onChange={handleFileChange}
                className="file-input"
            />
            <label htmlFor="file-input" className="file-upload-btn">Choose Files</label>
        </div>
    );
};

export default DragAndDropUpload;
