import React, { useEffect, useState } from 'react';
import "./ErrorDisplay.css";
import { useModal } from '../Context/ModalProvider';
import ErrorModal from '../ErrorModal';

const ErrorDisplay = () => {
    const modal = useModal();
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        setErrors(modal.errorModal);
    }, [modal.errorModal]);

    return (
        <>
            <div className="error-modal-position">
                {errors.map((item, index) => {
                    return <ErrorModal key={item.errorId} position={4+item.errorId*6} id={item.errorId} />
                })}
            </div>
        </>
    );
};

export default ErrorDisplay;