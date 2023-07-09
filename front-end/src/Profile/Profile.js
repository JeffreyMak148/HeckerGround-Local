import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { FaUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useUser } from '../Context/UserProvider';
import { AiOutlineClose } from 'react-icons/ai';
import fetchUtil from '../util/fetchUtil';
import formatDate from '../util/formatDate';
import "./Profile.css";
import { useModal } from '../Context/ModalProvider';

const Profile = () => {
    const modal = useModal();
    const user = useUser();
    const [profileUser, setProfileUser] = useState(null);
    
    useEffect(() => {
        if(!!modal.profileModal.profileId) {
            fetchUtil(`/api/profile/user/${modal.profileModal.profileId}`, null, "GET")
            .then(({status, data}) => {
                setProfileUser(data);
                modal.setProfileModal(profileModal => ({...profileModal, show: true}));
            })
            .catch(error => {
                modal.setErrorModal(errorModal => ([...errorModal, {errorId: errorModal.length,  error}]));
            })
        }

    }, [modal.profileModal.profileId]);

    const handleClose = () => {
        modal.setProfileModal({show: false, profileId: null});
        user.setShowProfile(false);
    }
    

    function sendLogoutRequest() {
        fetchUtil("/api/auth/signout", null, "POST")
        .then(({status, data}) => {
            user.setIsLoggedIn(false);
        })
        .then(handleClose())
        .catch(error => {
            modal.setErrorModal(errorModal => ([...errorModal, {errorId: errorModal.length,  error}]));
        });
    }

    return (
        <>
            <Modal centered dialogClassName = "profile-modal-dialog" contentClassName="profile-modal-content" show={modal.profileModal.show} onHide={handleClose}>
                <Modal.Header className="profile-modal-header">
                    <div className="flex-1 profile-text">
                        Profile
                    </div>
                    <div>
                        <button className="profile-close-button" onClick={handleClose}><AiOutlineClose/></button>
                    </div>
                </Modal.Header>
                <Modal.Body className="profile-modal-body">
                    <div className="content-overflow">
                        <ul>
                            {
                                !!profileUser
                                ?
                                <>
                                    <li>
                                        <Link to={`/profile/${profileUser.id}`} className="profile-item margin-top-8" onClick={handleClose}>
                                            <div className="flex-display">
                                                <div className="item-icon"><FaUserCircle size="2em"/></div>
                                                <div className="item-user-info">
                                                    <div className="profile-item-top-half">
                                                        {profileUser.username}
                                                    </div>
                                                    <div className="profile-item-bottom-half">
                                                        <span className="item-info-text">#{profileUser.id}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="profile-item margin-top-8 disable-link">
                                            Account created: {formatDate(profileUser.createDateTime, true)}
                                        </Link>
                                    </li>
                                    {
                                        user.isLoggedIn && profileUser.id ===  user.userProfile.id ?
                                            <li>
                                                <Link className="profile-item center-text logout-text-color" onClick={() => sendLogoutRequest()}>
                                                    Logout
                                                </Link>
                                            </li>
                                        :
                                        <></>
                                    }
                                </>
                                :
                                <></>
                            }
                        </ul>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Profile;