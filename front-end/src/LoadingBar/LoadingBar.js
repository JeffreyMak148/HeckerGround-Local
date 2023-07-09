import React from 'react';
import "./LoadingBar.css";
import { useLoading } from '../Context/LoadingProvider';

const LoadingBar = () => {

    const loading = useLoading();

    return (
        <>
            {
                loading.topicLoading || loading.contentLoading ?
                    <div>
                        <div className="loading-bar"/>
                    </div>
                :
                <></>
            }
        </>
    );
};

export default LoadingBar;