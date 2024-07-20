import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './Chat.module.css';

interface ImagePreviewProps {
    uploadedFiles: File[];
    cancelUpload: (index: number) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ uploadedFiles, cancelUpload }) => {
    useEffect(() => {
        // Clean up object URLs when component unmounts
        return () => {
            uploadedFiles.forEach(file => URL.revokeObjectURL(URL.createObjectURL(file)));
        };
    }, [uploadedFiles]);

    return (
        uploadedFiles.length > 0 && (
            <div className={styles.imagePreview}>
                {uploadedFiles.map((file, index) => {
                    const fileURL = URL.createObjectURL(file);
                    const fileType = file.type.split('/')[0];
                    return (
                        <div key={index} className="relative mr-2 mb-2">
                            {fileType === 'image' && <img src={fileURL} alt="Preview" className="max-h-16 rounded-md" />}
                            {fileType === 'audio' && <audio controls className="max-h-16"><source src={fileURL} type={file.type} /></audio>}
                            {fileType === 'video' && <video controls className="max-h-16"><source src={fileURL} type={file.type} /></video>}
                            {fileType !== 'image' && fileType !== 'audio' && fileType !== 'video' && <div className="max-h-16 rounded-md bg-gray-200 p-2">{file.name}</div>}
                            <button onClick={() => cancelUpload(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                    );
                })}
            </div>
        )
    );
};

export default ImagePreview;
