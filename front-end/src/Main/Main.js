import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Content from '../Content';
import { useModal } from '../Context/ModalProvider';
import { useUser } from '../Context/UserProvider';
import LoadingBar from '../LoadingBar';
import NavBar from '../NavBar';
import Topic from '../Topic/Topic';
import fetchUtil from '../util/fetchUtil';
import "./Main.css";

const Main = ({notFound}) => {

    const user = useUser();
    const modal = useModal();

    useEffect(() => {
        fetchUtil("/api/auth/loggedin", null, "GET")
        .then(({status, data}) => {
            if(!!data) {
                user.setIsLoggedIn(data.authenticated);
                user.setUserProfile(data.principal);
            }
        })
        .catch(error => {
            modal.setErrorModal(errorModal => ([...errorModal, {errorId: errorModal.length,  error}]));
        });
    }, []);

    return (
        <>  
            <LoadingBar/>
            <NavBar/>
            <Container className="main-container">
                <Row className="main-row">
                    <Col xs={3} className="topic-col">
                        <Topic />
                    </Col>
                    <Col className="content-col">
                        <Content notFound={notFound}/>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Main;