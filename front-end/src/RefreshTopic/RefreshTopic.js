import React from 'react';
import "./RefreshTopic.css";
import { MdRefresh } from "react-icons/md";
import { useTopic } from '../Context/TopicProvider';

const RefreshTopic = () => {

    const topic = useTopic();

    const refreshTopic = () => {
        topic.setRefresh(true);
    }

    return (
        <div>
            <button className="refresh-button" onClick={refreshTopic}><MdRefresh/></button>
        </div>
    );
};

export default RefreshTopic;