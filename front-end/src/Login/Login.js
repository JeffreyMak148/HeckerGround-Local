import React, { useEffect, useState } from 'react';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import { FaUserCircle } from "react-icons/fa";
import { useUser } from '../Context/UserProvider';
import "./Login.css";

const Login = () => {
    const user = useUser();
    const [show, setShow] = useState(false);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerVerificationPassword, setRegisterVerificationPassword] = useState("");
    const [modalType, setModalType] = useState("login");

    function sendLoginRequest () {
        if(modalType !== "login") {
            setModalType("login");
            return;
        }
        const reqBody = {
            email: loginEmail,
            password: loginPassword
        }

        // Http only cookie can not be assessed by javascript
        fetch("/api/auth/signin", {
            "headers": {
            "Content-Type": "application/json",
            },
            "method": "POST",
            body: JSON.stringify(reqBody),
        })
        .then((response) => {
            if(response.status === 200) {
                user.setIsLoggedIn(true);
                return Promise.all([response.json(), response.headers]);
            } else {
                return Promise.reject("Invalid login attempt");
            }
        })
        .then(([body, headers]) => {
            window.location.href = "";
        })
        .catch((message) => {
            alert(message);
        });
    }

    function sendRegisterRequest () {
        if(modalType !== "register") {
            setModalType("register");
            return;
        }
        if(registerPassword !== registerVerificationPassword) {
            alert("Incorrect password");
            return;
        }
        const reqBody = {
            username: registerUsername,
            email: registerEmail,
            password: registerPassword
        }

        // Http only cookie can not be assessed by javascript
        fetch("/api/auth/signup", {
            "headers": {
            "Content-Type": "application/json",
            },
            "method": "POST",
            body: JSON.stringify(reqBody),
        })
        .then((response) => {
            if(response.status === 200) {
                return Promise.all([response.json(), response.headers]);
            } else {
                return Promise.reject("Invalid register attempt");
            }
        })
        .then(([body, headers]) => {
            fetch("/api/auth/signin", {
                "headers": {
                "Content-Type": "application/json",
                },
                "method": "POST",
                body: JSON.stringify(reqBody),
            })
            .then((response) => {
                if(response.status === 200) {
                    user.setIsLoggedIn(true);
                    return Promise.all([response.json(), response.headers]);
                } else {
                    return Promise.reject("Invalid login attempt");
                }
            })
            .then(([body, headers]) => {
                window.location.href = "";
            })
            .catch((message) => {
                alert(message);
            });
            // window.location.href = "";
        })
        .catch((message) => {
            alert(message);
        });
    }

    const handleClose = () => {
        user.setShowLogin(false);
        setShow(false);
        setModalType("login");
    }

    const handleOpen = () => {
        user.setShowLogin(true);
        setShow(true);
    }

    useEffect(() => {
        setShow(user.showLogin);
    }, [user.showLogin]);

    return (
        <>
            <button className="user-icon" onClick={handleOpen}><FaUserCircle size="1.5em"/></button>
            <Modal centered dialogClassName = "login-modal-dialog" contentClassName="login-modal-content" show={show} onHide={handleClose}>
                <Modal.Body className="login-modal-body">
                    {modalType === "login" ? 
                    // Login
                    <Container>
                        <Row>
                            <Col>
                                <div>
                                    <input className="login-email-input" placeholder="Login email" type="email" id="loginEmail" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div>
                                    <input className="login-password-input" placeholder="Password" type="password" id="loginPassword" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                    :
                    // Register
                    <Container>
                        <Row>
                            <Col>
                                <div>
                                    <input className="register-username-input" placeholder="Username" type="email" id="registerUsername" value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div>
                                    <input className="register-email-input" placeholder="Register email" type="email" id="registerEmail" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div>
                                    <input className="register-password-input" placeholder="Password" type="password" id="registerPassword" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div>
                                    <input className="register-password-input" placeholder="Enter password again" type="password" id="registerVerificationPassword" value={registerVerificationPassword} onChange={(e) => setRegisterVerificationPassword(e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                    }
                </Modal.Body>
                <Modal.Footer className="login-modal-footer">
                        <button className="login-button" type="button" onClick={() => sendLoginRequest()}>
                            Login
                        </button>
                        <button className={`register-button${modalType !== "login" ? ' register-modal-button' : ''}`} id="submit" type="button" onClick={() => sendRegisterRequest()}>
                            Register
                        </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Login;