import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./Form.css";

const Form = ({ 
    title, 
    children, 
    onSubmit, 
    onClose,
    submitLabel = "Lưu",
    cancelLabel = "Hủy" 
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <div className="form-container">
            <h2>{title}</h2>
            <form onSubmit={handleSubmit}>
                {children}
                
                <div className="form-actions">
                    <button type="submit" className="btn btn-save">
                        <FontAwesomeIcon icon={faSave} /> {submitLabel}
                    </button>
                    <button type="button" className="btn btn-cancel" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} /> {cancelLabel}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Form; 