import React, { useEffect, useState } from 'react';
import { CloseButton } from 'react-bootstrap';
import fetchUtil from '../util/fetchUtil';
import { BsPlusLg } from "react-icons/bs";
import "./RefreshTopic.css";
import { useUser } from '../Context/UserProvider';
import { Link } from 'react-router-dom';
import { useModal } from '../Context/ModalProvider';
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