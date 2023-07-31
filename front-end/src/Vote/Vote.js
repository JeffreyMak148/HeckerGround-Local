import React from 'react';
import { BiSolidUpvote, BiSolidDownvote } from "react-icons/bi";
import "./Vote.css";



const Vote = ({upvoteCount, downvoteCount}) => {
    

    return (
        <div className="comment-vote-div">
            <button className="comment-upvote-button" onClick={() => console.log("like")}><BiSolidUpvote size="0.8em"/><div className="comment-upvote-count">{upvoteCount}</div></button>
            <button className="comment-downvote-button" onClick={() => console.log("dislike")}><BiSolidDownvote size="0.8em"/><div className="comment-downvote-count">{downvoteCount}</div></button>
        </div>
    );
};

export default Vote;