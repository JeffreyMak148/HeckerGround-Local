import React, { useEffect, useState } from 'react';
import { CloseButton } from 'react-bootstrap';
import fetchUtil from '../util/fetchUtil';
import { BsPlusLg } from "react-icons/bs";
import "./CreatePost.css";
import { useUser } from '../Context/UserProvider';
import { Link } from 'react-router-dom';
import { useModal } from '../Context/ModalProvider';
import { useTopic } from '../Context/TopicProvider';

const CreatePost = ({from}) => {

    const [expandCreatePost, setExpandCreatePost] = useState(false);
    const [topicInput, setTopicInput] = useState("");
    const [categoryInput, setCategoryInput] = useState(1);
    const [content, setContent] = useState("");
    const [categoryDropdown, setCategoryDropdown] = useState(null);
    const user = useUser();
    const modal = useModal();
    const topic = useTopic();

    function createPost () {

        if(!user.isLoggedIn) {
            user.setShowLogin(true);
        }

        const reqBody = {
            title: topicInput,
            catId: categoryInput,
            content: content
        }
        fetchUtil("/api/posts", reqBody, "POST")
        .then(({status, data}) => {
            if(status === 200) {
                window.location.href = `/posts/${data.id}`;
            } else if(status === 401) {
                user.setIsLoggedIn(false);
                user.setShowLogin(true);
            }
        })
        .catch(error => {
            modal.setErrorModal(errorModal => ([...errorModal, {errorId: errorModal.length,  error}]));
        });
    }

    useEffect(() => {
        fetchUtil("/api/posts/category", null, "GET")
        .then(({status, data}) => {
            setCategoryDropdown(data);
        })
        .catch(error => {
            modal.setErrorModal(errorModal => ([...errorModal, {errorId: errorModal.length,  error}]));
        });

    }, []);

    useEffect(() => {
        setCategoryInput(!!topic.selectedCatId ? topic.selectedCatId : categoryInput);
    }, [topic.selectedCatId]);

    const handleExpandCreatePost = () => {
        if(!user.isLoggedIn) {
            user.setShowLogin(true);
        } else {
            setExpandCreatePost(true);
        }
    }

    return (
        <div>
            {
            from === "topic" ? 
                <li>
                    <Link className="post-topic-link" onClick={handleExpandCreatePost}>
                        Create Post
                    </Link>
                </li>
            :
                <button className="add-button" onClick={handleExpandCreatePost}><BsPlusLg/></button>
            }
            {
            expandCreatePost ? 
                <div className="create-new-post-container">
                    <div className="flex-display">
                        <div className="flex-1">
                            Create New Post
                        </div>
                        <div>
                            <CloseButton variant="white" className="close-button" onClick={() => setExpandCreatePost(false)} />
                        </div>
                    </div>
                    <div className="flex-display">
                        <input className="create-topic-input" type="text" id="postTopic" placeholder="Topic" value={topicInput} onChange={(e) => setTopicInput(e.target.value)} />
                        <select className="create-category-dropdown" name="postCategory" id="postCategory" value={categoryInput} onChange={(e) => setCategoryInput(e.target.value)}>
                            {categoryDropdown.map(categoryDropdown =>
                                <option selected={categoryDropdown.catId === categoryInput ? "selected" : ""} key={categoryDropdown.catId} value={categoryDropdown.catId}>{categoryDropdown.category}</option>
                            ) }
                        </select>
                    </div>
                    <textarea className="create-content-input" wrap="soft" id="postContent" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
                    <div className="create-button-div">
                        <button className="create-post-button" id="submit" type="button" onClick={() => createPost()}>
                            Create
                        </button>
                    </div>
                </div>
            : <></>
            }
        </div>
    );
};

export default CreatePost;