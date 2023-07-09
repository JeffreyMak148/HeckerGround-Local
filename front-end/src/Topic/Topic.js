import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContent } from '../Context/ContentProvider';
import { useLoading } from '../Context/LoadingProvider';
import { useModal } from '../Context/ModalProvider';
import { useTopic } from '../Context/TopicProvider';
import CreatePost from '../CreatePost';
import fetchUtil from '../util/fetchUtil';
import formatDate from '../util/formatDate';
import "./Topic.css";



const Topic = () => {

    const location = useLocation();
    const topic = useTopic();
    const content = useContent();
    const modal = useModal();
    const loadingBar = useLoading();

    const [datas, setDatas] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const catId = location.pathname.split("/category/")[1];
        const profileId = location.pathname.split("/profile/")[1];
        const postId = location.pathname.split("/posts/")[1];
        
        if(!!postId) {
            const postCatId = !!content.post && parseInt(postId) === content.post.id ? content.post.catId : null;
            if(!topic.profileId && !!postCatId && postCatId !== topic.selectedCatId) {
                setDatas([]);
                setHasMore(true);
                setPageNum(1);
                topic.setSelectedCatId(parseInt(postCatId));
            }
        }

        if(!!catId && parseInt(catId) !== topic.selectedCatId) {
            setDatas([]);
            setHasMore(true);
            setPageNum(1);
            topic.setProfileId(null);
            topic.setProfileUser(null);
            topic.setSelectedCatId(parseInt(catId));
        }

        if(!!profileId && parseInt(profileId) !== topic.profileId) {
            setDatas([]);
            setHasMore(true);
            setPageNum(1);
            topic.setSelectedCatId(null);
            topic.setProfileId(parseInt(profileId));
        }

    }, [location, content.post]);

    useEffect(() => {
        if(!!topic.selectedCatId && !loadingBar.topicLoading) {
            setLoading(true);
            loadingBar.setTopicLoading(true);
            fetchUtil(`/api/posts/category/${topic.selectedCatId}?page=0&size=10`, null, "GET")
            .then(({status, data}) => {
                if(data.length === 0) {
                    setHasMore(false);
                }
                setDatas(data);
                setLoading(false);
            })
            .then(() => {
                loadingBar.setTopicLoading(false);
            })
            .catch(error => {
                modal.setErrorModal(errorModal => ([...errorModal, {errorId: errorModal.length,  error}]));
                loadingBar.setTopicLoading(false);
            });
        }

        if(!!topic.profileId && !loadingBar.topicLoading) {
            setLoading(true);
            loadingBar.setTopicLoading(true);
            fetchUtil(`/api/profile/${topic.profileId}?page=0&size=10`, null, "GET")
            .then(({status, data}) => {
                if(data.posts.length === 0) {
                    setHasMore(false);
                }
                topic.setProfileUser(data.user);
                setDatas(data.posts);
                setLoading(false);
            })
            .then(() => {
                loadingBar.setTopicLoading(false);
            })
            .catch(error => {
                modal.setErrorModal(errorModal => ([...errorModal, {errorId: errorModal.length,  error}]));
                loadingBar.setTopicLoading(false);
            });
        }

    }, [topic.selectedCatId, topic.profileId]);

    useEffect(() => {
        if(topic.refresh) {
            if(!!topic.selectedCatId && !loadingBar.topicLoading) {
                setLoading(true);
                loadingBar.setTopicLoading(true);
                fetchUtil(`/api/posts/category/${topic.selectedCatId}?page=0&size=10`, null, "GET")
                .then(({status, data}) => {
                    if(data.length === 0) {
                        setHasMore(false);
                    }
                    setDatas(data);
                    setLoading(false);
                })
                .then(() => {
                    loadingBar.setTopicLoading(false);
                })
                .catch(error => {
                    modal.setErrorModal(errorModal => ([...errorModal, {errorId: errorModal.length,  error}]));
                    loadingBar.setTopicLoading(false);
                });
            }
    
            if(!!topic.profileId && !loadingBar.topicLoading) {
                setLoading(true);
                loadingBar.setTopicLoading(true);
                fetchUtil(`/api/profile/${topic.profileId}?page=0&size=10`, null, "GET")
                .then(({status, data}) => {
                    if(data.posts.length === 0) {
                        setHasMore(false);
                    }
                    topic.setProfileUser(data.user);
                    setDatas(data.posts);
                    setLoading(false);
                })
                .then(() => {
                    loadingBar.setTopicLoading(false);
                })
                .catch(error => {
                    modal.setErrorModal(errorModal => ([...errorModal, {errorId: errorModal.length,  error}]));
                    loadingBar.setTopicLoading(false);
                });
            }

            setHasMore(true);
            setPageNum(1);
            topic.setRefresh(false);
            scrollToTop();
        }

    }, [topic.refresh]);
    
    function fetchPostsByCategoryAndPagination() {
        if(!!topic.selectedCatId && !loadingBar.topicLoading) {
            loadingBar.setTopicLoading(true);
            setLoading(true);
            fetchUtil(`/api/posts/category/${topic.selectedCatId}?page=${pageNum}&size=10`, null, "GET")
            .then(({status, data}) => {
                if(data.length === 0) {
                    setHasMore(false);
                }
                setDatas([...datas, ...data]);
                setLoading(false);
            })
            .then(() => {
                loadingBar.setTopicLoading(false);
            })
            .catch(error => {
                modal.setErrorModal(errorModal => ([...errorModal, {errorId: errorModal.length,  error}]));
                loadingBar.setTopicLoading(false);
            });
        }
    }

    function fetchPostsByProfileIdAndPagination() {
        if(!!topic.profileId && !loadingBar.topicLoading) {
            loadingBar.setTopicLoading(true);
            setLoading(true);
            fetchUtil(`/api/profile/${topic.profileId}?page=${pageNum}&size=10`, null, "GET")
            .then(({status, data}) => {
                if(data.posts.length === 0) {
                    setHasMore(false);
                }
                setDatas([...datas, ...data.posts]);
                setLoading(false);
            })
            .then(() => {
                loadingBar.setTopicLoading(false);
            })
            .catch(error => {
                modal.setErrorModal(errorModal => ([...errorModal, {errorId: errorModal.length,  error}]));
                loadingBar.setTopicLoading(false);
            });
        }
    }

    const observer = useRef();
    const lastDataRef = useCallback(node => {
        if(loading) return;
        if(observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore) {
                setPageNum((pageNum) => pageNum + 1);
                if(!!topic.selectedCatId) fetchPostsByCategoryAndPagination();
                if(!!topic.profileId) fetchPostsByProfileIdAndPagination();
            }
        });

        if(node) observer.current.observe(node);
    }, [loading, hasMore]);

    const topicRef = useRef();
    const scrollToTop = () => {
        topicRef.current.scroll({
            top: 0,
            behavior: "smooth"
        });
    };

    function setPost(postId) {
        content.setPostId(postId);
        //Clear comment modal
        modal.setCreateCommentModal({show: false, postId: null, replyComment: null});
    }
    

    return (
        <div className="content-overflow" ref={topicRef}>
            <ul>
               {
               datas ? datas.map((data, index) => {
                        if(datas.length === index + 1) {
                            return <div ref={lastDataRef} key={data.id} className="post-topic-div">
                                <li>
                                    <Link to={`/posts/${data.id}`} className={`post-topic-link${parseInt(content.postId) === data.id ? ' selected-post-color' : ''}`} onClick={() => {if(!loadingBar.contentLoading) setPost(data.id)}}>
                                        <div className="post-topic-top-half">
                                            <span className="username-color">{data.user.username}</span> <span className="date-color">{formatDate(data.createDateTime)}</span>
                                        </div>
                                        <div className="post-topic-bottom-half">
                                            {data.title}
                                        </div>
                                    </Link>
                                </li>
                            </div>;
                        } else {
                            return <div key={data.id} className="post-topic-div">
                                <li>
                                    <Link to={`/posts/${data.id}`} className={`post-topic-link${parseInt(content.postId) === data.id ? ' selected-post-color' : ''}`} onClick={() => {if(!loadingBar.contentLoading) setPost(data.id)}}>
                                        <div className="post-topic-top-half">
                                            <span className="username-color">{data.user.username}</span> <span className="date-color">{formatDate(data.createDateTime)}</span>
                                        </div>
                                        <div className="post-topic-bottom-half">
                                            {data.title}
                                        </div>
                                    </Link>
                                </li>
                            </div>
                        }
                    })
                : <></>
                }
                {!hasMore && <div className="post-topic-end-div"><CreatePost from="topic"/></div>}
            </ul>
        </div>
    );
};

export default Topic;