import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useContent } from '../Context/ContentProvider';
import { useModal } from '../Context/ModalProvider';
import { useTopic } from '../Context/TopicProvider';
import CreateComment from '../CreateComment/CreateComment';
import CreatePost from '../CreatePost';
import Menu from '../Menu/Menu';
import RefreshTopic from '../RefreshTopic';
import "./NavBar.css";

const NavBar = () => {
    const content = useContent();
    const topic = useTopic();
    const modal = useModal();
    const [title, setTitle] = useState("Chatting");
    const location = useLocation();

    useEffect(() => {
        const catId = location.pathname.split("/category/")[1];
        const profileId = location.pathname.split("/profile")[1];
        if(!!catId && !!topic.category) {
            let currentCat = topic.category.find(c => c.catId === parseInt(catId));
            if(!!currentCat) {
                setTitle(currentCat.category);
            } else {
                const error = {
                    status: null,
                    data: {
                        status: null,
                        errorMessage: "Category not found"
                    }
                }
                modal.setErrorModal(errorModal => ([...errorModal, {errorId: errorModal.length, error}]));
                setTitle(catId);
            }
        }
        if(!!profileId && !!topic.profileUser) {
            setTitle(topic.profileUser.username);
        }
    }, [location, topic.category, topic.profileUser]);

    useEffect(() => {
        const postCatId = !!content.post ? content.post.catId : null;
        if(!topic.profileId && !!postCatId) {
            let currentCat = topic.category.find(c => c.catId === parseInt(postCatId));
            if(currentCat.category !== title);
            setTitle(currentCat.category);
        }
    }, [content.post])

    return (
        <Container className="nav-bar">
            <Row className="nav-bar-row">
                <Col xs={3} className="nav-bar-color center-text border-right padding-0">
                    <div className="flex-display height-100">
                        <div className="position-absolute">
                            <Menu/>
                        </div>
                        <div className="flex-1">
                            {
                                title ?
                                (
                                    <div>
                                        <h1 className="topic-title">
                                            {title}
                                        </h1>
                                    </div>
                                )
                                :
                                (
                                    <></>
                                )
                            }
                        </div>
                        <div>
                            <RefreshTopic/>
                        </div>
                        <div>
                            <CreatePost/>
                        </div>
                    </div>

                </Col>
                <Col className="nav-bar-color padding-right-0">
                    <div className="flex-display height-100">
                        <div className="flex-1 height-100">
                            {
                                content.post ? 
                                (
                                    <h1 className="post-title">
                                        {content.post.title}
                                    </h1>
                                )
                                :
                                (
                                    <></>                                    
                                )
                            }
                        </div>
                        <div>
                            {
                                !!content.post ? 
                                    <CreateComment/>
                                :
                                    <></>
                            }
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default NavBar;