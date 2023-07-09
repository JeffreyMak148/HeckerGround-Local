import React from 'react';
import { useModal } from '../Context/ModalProvider';
import { FaCommentDots } from "react-icons/fa";
import "./CommentCount.css";

const CommentCount = ({count, commentId}) => {

    const modal = useModal();

    const changeCommentId = () => {
        if(!!commentId) {
            modal.setCommentModal(commentModal => ({...commentModal, commentId: commentId}));
        }
    }

    return (
        <>
            {
                count === 0 ?
                <></>
                :
                <>
                    <div>
                        <button className="comment-count-button" onClick={changeCommentId}><FaCommentDots/><div className="comment-count-number">{count}</div></button>
                    </div>
                </>
            }
        </>
    );
};

export default CommentCount;