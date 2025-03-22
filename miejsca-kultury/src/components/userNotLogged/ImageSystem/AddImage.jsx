import React, { useState, useRef } from 'react';

function DragAndDrop({ onImageChange }) {
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);

    function selectFile() {
        fileInputRef.current.click();
    }

    function onFileSelect(event) {
        const file = event.target.files[0];
        if (file && file.type.split('/')[0] === 'image') {
            const newImage = {
                url: URL.createObjectURL(file),
                file: file
            };
            setImage(newImage);
            onImageChange(newImage);
        }
    }

    function handleDrop(event) {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type.split('/')[0] === 'image') {
            const newImage = {
                url: URL.createObjectURL(file),
                file: file
            };
            setImage(newImage);
            onImageChange(newImage);
        }
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function deleteImage() {
        setImage(null);
        onImageChange(null);
        console.log("Plik został usunięty.");
    }

    return (
        <div style={{ 
            maxWidth: '800px', 
            margin: '0 auto', 
            padding: '10px'
        }}>
            <div 
                className="drag_and_drop_card" 
                onDrop={handleDrop} 
                onDragOver={handleDragOver}
                style={{
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: '#f9f9f9',
                    maxWidth: '100%',
                    margin: '0 auto'
                }}
            >
                <div className="drag_and_drop_description">
                </div>
                <div 
                    className="drop_area" 
                    onClick={selectFile}
                    style={{
                        padding: '20px 5px',
                        cursor: 'pointer',
                        marginBottom: '15px'
                    }}
                >
                    Wrzuć zdjęcie tutaj lub {"   "}
                    <span 
                        className="select" 
                        role="button" 
                        onClick={selectFile}
                        style={{
                            color: '#0066cc',
                            fontWeight: 'bold',
                            textDecoration: 'underline'
                        }}
                    >
                        Szukaj zdjęcia
                    </span>
                    <input 
                        name="file" 
                        type="file" 
                        className="image_file" 
                        ref={fileInputRef} 
                        onChange={onFileSelect} 
                        style={{ display: 'none' }}
                    />
                </div>
                <div 
                    className="container"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        maxWidth: '100%',
                        overflow: 'hidden'
                    }}
                >
                    {image && (
                        <div 
                            className="image" 
                            style={{ 
                                position: 'relative',
                                maxWidth: '100%',
                                textAlign: 'center'
                            }}
                        >
                            <img 
                                src={image.url} 
                                alt="Selected" 
                                style={{ 
                                    display: 'block', 
                                    maxWidth: '100%',
                                    maxHeight: '300px',
                                    margin: '0 auto',
                                    objectFit: 'contain'
                                }} 
                            />
                            <span 
                                onClick={deleteImage} 
                                className="delete" 
                                style={{ 
                                    position: 'absolute', 
                                    top: '5px', 
                                    right: '5px', 
                                    cursor: 'pointer', 
                                    color: '#8B0000', 
                                    fontSize: '25px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    lineHeight: '1'
                                }}
                            >
                                ×
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DragAndDrop;