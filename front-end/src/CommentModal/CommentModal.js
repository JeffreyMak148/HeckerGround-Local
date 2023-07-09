import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import CommentCount from '../CommentCount';
import { useModal } from '../Context/ModalProvider';
import CreateComment from '../CreateComment/CreateComment';
import ReplyComment from '../ReplyComment';
import fetchUtil from '../util/fetchUtil';
import formatDate from '../util/formatDate';
import "./CommentModal.css";

const CommentModal = () => {

    const [comment, setComment] = useState(null);
    const [replyComments, setReplyComments] = useState(null);
    const modal = useModal();

    const handleClose = () => modal.setCommentModal(commentModal => ({commentId: null, show: false}));

    useEffect(() => {
        if(!!modal.commentModal.commentId) {
            fetchUtil(`/api/comments/${modal.commentModal.commentId}`, null, "GET")
            .then(({status, data}) => {
                setComment(data.comment);
                setReplyComments(data.replyComments);
                modal.setCommentModal(commentModal => ({...commentModal, show: true}));
            })
            .catch(error => {
                modal.setErrorModal(errorModal => ([...errorModal, {errorId: errorModal.length,  error}]));
            })
        }

    }, [modal.commentModal.commentId]);

    return (
        <>
            <Modal centered dialogClassName = "comment-modal-dialog" contentClassName="comment-modal-content content-overflow" show={modal.commentModal.show} onHide={handleClose}>
                <Modal.Body className="comment-modal-body">
                    <div className="comment-modal-top">

                    </div>
                    <div className="comment-modal-mid">
                        {
                            comment ? 
                                <div key={comment.id}>
                                    <div className="flex-display margin-bottom-1">
                                        <div className="comment-modal-comment-number">
                                            #{comment.commentNumber}
                                        </div>
                                        <div className="comment-modal-comment-username">
                                            {comment.user.username}
                                        </div>
                                        <div className="comment-modal-comment-date">
                                            {formatDate(comment.createDateTime)}
                                        </div>
                                        <div className="comment-modal-comment-button">
                                            <CreateComment reply={comment}/>
                                        </div>
                                    </div>
                                    <ReplyComment replyComment={comment.replyComment} showCount={3}/>
                                    <div className="comment-modal-comment-content">
                                        {comment.content}
                                    </div>
                                </div>
                            :
                            <></>
                        }
                    </div>
                    <div className="reply-text">Replied</div>
                    <div className="comment-modal-bottom">
                        {
                            replyComments ? replyComments.map((data, index) => {
                                return <div className="comment-modal-reply" key={data.id}>
                                    <div className="flex-display">
                                        <div className="comment-modal-reply-number">
                                            #{data.commentNumber}
                                        </div>
                                        <div className="comment-modal-reply-username">
                                            {data.user.username}
                                        </div>
                                        <div className="comment-modal-reply-date">
                                            {formatDate(data.createDateTime)}
                                        </div>
                                        <div className="comment-modal-reply-button">
                                            <CreateComment reply={data}/>
                                        </div>
                                    </div>
                                    <div className="comment-modal-reply-content">
                                        {data.content}
                                    </div>
                                    {
                                        data.numberOfReply > 0 ?
                                        <div className="comment-modal-comment-count">
                                            <CommentCount count={data.numberOfReply} commentId={data.id}/>
                                        </div>
                                        :
                                        <></>
                                    }
                                </div>
                            })
                            :
                            <></>
                        }
                    </div>
                    <div className="fin-text">Fin</div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CommentModal;