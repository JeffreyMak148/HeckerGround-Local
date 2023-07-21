import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CommentCount from '../CommentCount';
import CommentModal from '../CommentModal/CommentModal';
import { useContent } from '../Context/ContentProvider';
import { useLoading } from '../Context/LoadingProvider';
import { useModal } from '../Context/ModalProvider';
import CreateComment from '../CreateComment/CreateComment';
import Profile from '../Profile';
import ReplyComment from '../ReplyComment';
import fetchUtil from '../util/fetchUtil';
import formatDate from '../util/formatDate';
import "./Content.css";
import filterUniqueValues from '../util/filterUniqueValues';
import ErrorDisplay from '../ErrorDisplay';
import Footer from '../Footer/Footer';
import Privacy from '../Privacy/Privacy';
import Terms from '../Terms/Terms';

const Content = ({notFound}) => {

    const [terms, setTerms] = useState(false);
    const [privacy, setPrivacy] = useState(false);
    const [comments, setComments] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const location = useLocation();
    const content = useContent();
    const modal = useModal();
    const loadingBar = useLoading();
    
    useEffect(() => {
        const postId = location.pathname.split("/posts/")[1];
        const termsLocation = location.pathname === "/terms-and-conditions";
        const privacyLocation = location.pathname === "/privacy-policy";
        if(!!postId && postId !== content.postId) {
            content.setPostId(postId);
            setHasMore(true);
            setPageNum(1);
        }

        if(!!termsLocation) {
            setTerms(true);
        } else {
            setTerms(false);
        }

        if(!!privacyLocation) {
            setPrivacy(true);
        } else {
            setPrivacy(false);
        }
    }, [location]);

    useEffect(() => {
        setError(false);
        initialFetchCommentsByPostIdAndPagination();
    }, [content.postId]);

    function initialFetchCommentsByPostIdAndPagination() {
        if(!!content.postId && !loadingBar.contentLoading) {
            loadingBar.setContentLoading(true);
            setLoading(true);
            fetchUtil(`/api/posts/${content.postId}?page=0&size=50`, null, "GET")
            .then(({status, data}) => {
                if(!data.comments && !data.post) {
                    setError(true);
                }
                if(!!data.comments && data.comments.length < 50) {
                    setHasMore(false);
                    setLoading(false);
                }
                content.setPost(data.post);
                setComments(data.comments);
                setLoading(false);
            })
            .then(() => {
                loadingBar.setContentLoading(false);
            })
            .catch(error => {
                modal.setErrorModal(errorModal => ([...errorModal, {errorId: errorModal.length,  error}]));
                loadingBar.setContentLoading(false);
            });
        }
    }

    function fetchCommentsByPostIdAndPagination() {
        if(!!content.postId && !loadingBar.contentLoading) {
            loadingBar.setContentLoading(true);
            setLoading(true);
            fetchUtil(`/api/posts/${content.postId}?page=${pageNum}&size=50`, null, "GET")
            .then(({status, data}) => {
                if(data.comments.length < 50) {
                    setHasMore(false);
                    setLoading(false);
                }
                setComments([...comments, ...data.comments]);
                setLoading(false);
            }).then(() => {
                loadingBar.setContentLoading(false);
            })
            .catch(error => {
                modal.setErrorModal(errorModal => ([...errorModal, {errorId: errorModal.length,  error}]));
                loadingBar.setContentLoading(false);
            });
        }
    }

    const observer = useRef();
    const lastDataRef = useCallback(node => {
        if(loading) return;
        if(observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore && comments.length >= 50) {
                setPageNum((pageNum) => pageNum + 1);
                fetchCommentsByPostIdAndPagination();
            }
        });

        if(node) observer.current.observe(node);
    }, [loading, hasMore]);

    function showProfileModal(profileId) {
        if(!!profileId) {
            modal.setProfileModal(profileModal => ({...profileModal, profileId: profileId}));
        }
    }

    function refreshCommentsByPostIdAndPagination(refreshPageNum) {
        if(!!content.postId && !loadingBar.contentLoading) {
            loadingBar.setContentLoading(true);
            setLoading(true);
            fetchUtil(`/api/posts/${content.postId}?page=${refreshPageNum}&size=50`, null, "GET")
            .then(({status, data}) => {
                if(data.comments.length < 50) {
                    setHasMore(false);
                    setLoading(false);
                }
                setComments([...comments, ...filterUniqueValues(comments, data.comments)]);
                setLoading(false);
            }).then(() => {
                loadingBar.setContentLoading(false);
            })
            .catch(error => {
                modal.setErrorModal(errorModal => ([...errorModal, {errorId: errorModal.length,  error}]));
                loadingBar.setContentLoading(false);
            });
        }
    }

    function refreshContent() {
        if(!!comments && comments[comments.length - 1].commentNumber <= 50) {
            refreshCommentsByPostIdAndPagination(0);
        } else {
            refreshCommentsByPostIdAndPagination(pageNum-1);
        }
    }

    return (
        <>
            <div className="content-overflow">
                {
                    terms || privacy ?
                         terms ? <Terms/> : <Privacy/>
                    :
                        <>
                            <ul>
                                {
                                comments ? comments.map((data, index) => {
                                        if(comments.length === index + 1) {
                                            return <div ref={lastDataRef} key={data.id} className="content-div">
                                                <li>
                                                    <div className="content-info flex-display">
                                                        <div className="content-number-div">
                                                            #{data.commentNumber}
                                                        </div>
                                                        <div className="content-username-div" onClick={() => showProfileModal(data.user.id)}>
                                                            {data.user.username}
                                                        </div>
                                                        <div className="content-date-div">
                                                            {formatDate(data.createDateTime)}
                                                        </div>
                                                        <div className="content-reply-div">
                                                            <CreateComment reply={data}/>
                                                        </div>
                                                    </div>
                                                    <ReplyComment replyComment={data.replyComment} showCount={3}/>
                                                    <div className="content-comment-div">
                                                        {data.content}
                                                    </div>
                                                    {
                                                        data.numberOfReply > 0
                                                        ?
                                                        <div className="content-comment-count">
                                                            <CommentCount count={data.numberOfReply} commentId={data.id}/>
                                                        </div>
                                                        :
                                                        <></>
                                                    }
                                                </li>
                                            </div>;
                                        } else {
                                            return <div key={data.id}>
                                                <div className="content-div">
                                                    <li>
                                                        <div className="content-info flex-display">
                                                            <div className="content-number-div">
                                                                #{data.commentNumber}
                                                            </div>
                                                            <div className="content-username-div" onClick={() => showProfileModal(data.user.id)}>
                                                                {data.user.username}
                                                            </div>
                                                            <div className="content-date-div">
                                                                {formatDate(data.createDateTime)}
                                                            </div>
                                                            <div className="content-reply-div">
                                                                <CreateComment reply={data} />
                                                            </div>
                                                        </div>
                                                        <ReplyComment replyComment={data.replyComment} showCount={3}/>
                                                        <div className="content-comment-div">
                                                            {data.content}
                                                        </div>
                                                        {
                                                            data.numberOfReply > 0
                                                            ?
                                                            <div className="content-comment-count">
                                                                <CommentCount count={data.numberOfReply} commentId={data.id}/>
                                                            </div>
                                                            :
                                                            <></>
                                                        }
                                                    </li>
                                                </div>
                                                {/* {
                                                    data.commentNumber % 50 === 0 ?
                                                        <div>{data.commentNumber}</div>
                                                    :
                                                        <></>
                                                } */}
                                            </div>
                                        }
                                    })
                                : <></>
                                }
                            </ul>
                            { !!comments ? 
                                    <div className="refresh-comment-div"  onClick={() => refreshContent()}><div className="refresh-comment">Refresh Comment</div></div>
                                :
                                    <></>
                            }
                            {
                                error ?
                                    <div className="post-not-available-div">
                                        Post is not available
                                    </div>
                                :
                                    <></>
                            }
                            {
                                notFound ?
                                    <div className="not-found-div">
                                        Page Not Found
                                    </div>
                                :
                                    <></>
                            }
                        </>
                    }
                <Footer/>
            </div>
            <ErrorDisplay/>
            <CommentModal/>
            <Profile/>
        </>
    );
};

export default Content;