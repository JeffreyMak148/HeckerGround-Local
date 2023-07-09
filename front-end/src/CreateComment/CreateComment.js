import React, { useState } from 'react';
import { CloseButton } from 'react-bootstrap';
import fetchUtil from '../util/fetchUtil';
import { BsChatRightDots } from "react-icons/bs";
import { HiReply } from "react-icons/hi";
import "./CreateComment.css";
import { useUser } from '../Context/UserProvider';
import { useModal } from '../Context/ModalProvider';
import { useContent } from '../Context/ContentProvider';
import { useTopic } from '../Context/TopicProvider';

const CreateComment= ({reply}) => {

    const postId = window.location.href.split("/posts/")[1];
    const [inputComment, setInputComment] = useState("");
    const user = useUser();
    const modal = useModal();
    const content = useContent();
    const topic = useTopic();

    function createComment () {
        if(!user.isLoggedIn) {
            user.setShowLogin(true);
        }

        const reqBody = {
            postId: modal.createCommentModal.postId,
            content: inputComment,
            replyCommentId: !!modal.createCommentModal.replyComment ? modal.createCommentModal.replyComment.id : null
        }

        fetchUtil(`/api/comments/${postId}`, reqBody, "POST")
        .then(({status, data}) => {
            if(status === 200) {
                window.location.href = "";
            } else if(status === 401) {
                user.setIsLoggedIn(false);
                user.setShowLogin(true);
            }
        })
        .catch(error => {
            modal.setErrorModal(errorModal => ([...errorModal, {errorId: errorModal.length,  error}]));
        });
    }

    const handleShowCreateComment = () => {
        if(!user.isLoggedIn) {
            user.setShowLogin(true);
        } else {
            modal.setCreateCommentModal({show: true, postId: postId, replyComment: reply});
        }
    }

    const handleHideCreateComment = () => {
        modal.setCreateCommentModal({show: false, postId: null, replyComment: null});
    }

    return (
        <div>
            {
                !!reply ?
                    <button className="reply-comment-button" onClick={handleShowCreateComment}><BsChatRightDots/></button>
                :
                    <>
                        <button className="new-comment-button" onClick={handleShowCreateComment}><BsChatRightDots/></button>
                    </>
            }
            {
            modal.createCommentModal.show ? 
                <div className="create-new-comment-container">
                    <div className="create-comment-top">
                        <div className="flex-1">
                        <span className="create-comment-category-text">{!!topic.category ? topic.category.find(c => c.catId === parseInt(content.post.catId)).category : ""}</span> - Create New Comment
                        </div>
                        <div>
                            <button className="create-comment-button" id="submit" type="button" onClick={() => createComment()}>
                                <HiReply/>
                            </button>
                        </div>
                        <div>
                            <CloseButton variant="white" className="close-button" onClick={handleHideCreateComment} />
                        </div>
                    </div>
                    {
                        !!modal.createCommentModal.replyComment ?
                        <div className="create-comment-mid">
                            <div className="create-comment-post-title"><span className="create-comment-reply-text">Reply to : </span>{content.post.title}</div>
                            <div className="create-comment-reply-info">
                                <span className="create-comment-user-id">#{modal.createCommentModal.replyComment.commentNumber}</span>
                                <span className="create-comment-username">{modal.createCommentModal.replyComment.user.username}</span>
                                <blockquote className="create-comment-quote">{modal.createCommentModal.replyComment.content}</blockquote>
                            </div>
                        </div>
                        :
                        <div className="create-comment-mid">
                            <div className="create-comment-post-title"><span className="create-comment-reply-text">Reply to : </span>{content.post.title}</div>
                        </div>
                    }
                    <textarea className="create-comment-input" wrap="soft" id="postComment" placeholder="Comment" value={inputComment} onChange={(e) => setInputComment(e.target.value)} />
                </div>
            : <></>
            }
        </div>
    );
};

export default CreateComment;