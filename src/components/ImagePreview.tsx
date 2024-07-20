import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './Chat.module.css'; // Import the styles

interface ImagePreviewProps {
    uploadedImages: File[];
    cancelUpload: (index: number) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ uploadedImages, cancelUpload }) => {
    return (
        uploadedImages.length > 0 && (
            <div className={styles.imagePreview}>
                {uploadedImages.map((image, index) => (
                    <div key={index} className="relative mr-2 mb-2">
                        <img src={URL.createObjectURL(image)} alt="Preview" className="max-h-16 rounded-md" />
                        <button onClick={() => cancelUpload(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                ))}
            </div>
        )
    );
};

export default ImagePreview;
