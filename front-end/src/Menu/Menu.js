import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '../Context/UserProvider';
import Login from '../Login';
import { FaBars, FaUserCircle } from "react-icons/fa";
import "./Menu.css";
import fetchUtil from '../util/fetchUtil';
import { Link } from 'react-router-dom';
import useOutsideClick from '../util/useOutsideClick';
import { useTopic } from '../Context/TopicProvider';
import { useModal } from '../Context/ModalProvider';

const Menu = () => {
    const user = useUser();
    const topic = useTopic();
    const modal = useModal();
    const [menu, setMenu] = useState(false);
    const [menuData, setMenuData] = useState([]);
        

    const menuRef = useRef(null);
    const menuOutsideClick = useOutsideClick(menuRef);
    if(menu && menuOutsideClick) {
        setMenu(!menu);
    }
    useEffect(() => {
        fetchUtil("/api/posts/category", null, "GET")
        .then(({status, data}) => {
            setMenuData(data);
            topic.setCategory(data);
        })
        .catch(error => {
            modal.setErrorModal(errorModal => ([...errorModal, {errorId: errorModal.length,  error}]));
        });

    }, []);

    useEffect(() => {
        if(user.showLogin || user.showProfile) {
            setMenu(false);
        }
    }, [user.showLogin, user.showProfile]);

    const handleOpen = () => {
        modal.setProfileModal({show: false, profileId: user.userProfile.id});
        user.setShowProfile(true);
    }

    return (
        <>
            <b className={menu ? "overlay active" : "overlay" }/>
            <div className="menu-button">
                <Link to="#" onClick={() => setMenu(!menu)}>
                    <FaBars className="height-100"/>
                </Link>
            </div>
            <nav ref={menu ? menuRef : null} className={menu ? "nav-menu active content-overflow" : "nav-menu content-overflow"}>
                <div className={"left-menu"}>
                    {user.isLoggedIn ? <button className="user-icon" onClick={handleOpen}><FaUserCircle size="1.5em"/></button> : <Login/>}
                </div>
                <div className={"right-menu"}>
                    <ul className="nav-menu-items" onClick={() => setMenu(!menu)}>
                        {menuData.map((item, index) => {
                            return (
                            <li key={index} className="menu-text">
                                <Link to={`/category/${item.catId}`} onClick={() => {setMenu(!menu)}}>
                                    <span className={topic.selectedCatId === item.catId ? 'selected-category-color' : ''}>{item.category}</span>
                                </Link>
                            </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Menu;