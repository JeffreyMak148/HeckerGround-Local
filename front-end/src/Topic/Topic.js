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
    const pageSize = 10;

    const [datas, setDatas] = useState([]);
    const [pageNum, setPageNum] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const catId = parseInt(location.pathname.split("/category/")[1]);
        const profileId = parseInt(location.pathname.split("/profile/")[1]);
        const postId = parseInt(location.pathname.split("/posts/")[1]);
        
        if(!!postId) {
            const postCatId = !!content.post && postId === content.post.id ? content.post.catId : null;
            if(!topic.profileId && !!postCatId && postCatId !== topic.selectedCatId) {
                setDatas([]);
                setHasMore(true);
                setPageNum(0);
                topic.setSelectedCatId(postCatId);
            }
        }

        if(!!catId && catId !== topic.selectedCatId) {
            setDatas([]);
            setHasMore(true);
            setPageNum(0);
            topic.setProfileId(null);
            topic.setProfileUser(null);
            topic.setSelectedCatId(catId);
        }

        if(!!profileId && profileId !== topic.profileId) {
            setDatas([]);
            setHasMore(true);
            setPageNum(0);
            topic.setSelectedCatId(null);
            topic.setProfileId(profileId);
        }

    }, [location, content.post]);

    function fetchTopicsByPostIdAndPagination(catIdOption, pageNumOption, pageSizeOption) {
        if(!!topic.selectedCatId && !loadingBar.topicLoading) {
            loadingBar.setTopicLoading(true);
            fetchUtil(`/api/posts/category/${catIdOption}?page=${pageNumOption}&size=${pageSizeOption}`, null, "GET")
            .then(({status, data}) => {
                if(data.length < pageSizeOption) {
                    setHasMore(false);
                }
                setDatas(currentTopics => ([...currentTopics, ...data]));
            })
            .then(() => {
                setPageNum(currentPageNum => (currentPageNum + 1));
                loadingBar.setTopicLoading(false);
            })
            .catch(error => {
                modal.setErrorModal(errorModal => ([...errorModal, {errorId: errorModal.length,  error}]));
                loadingBar.setTopicLoading(false);
            });
        }
    }

    function fetchProfileByProfileIdAndPagination(profileIdOption, pageNumOption, pageSizeOption) {
        if(!!topic.profileId && !loadingBar.topicLoading) {
            loadingBar.setTopicLoading(true);
            fetchUtil(`/api/profile/${profileIdOption}?page=${pageNumOption}&size=${pageSizeOption}`, null, "GET")
            .then(({status, data}) => {
                if(data.posts.length < pageSizeOption) {
                    setHasMore(false);
                }
                topic.setProfileUser(data.user);
                setDatas(currentTopics => ([...currentTopics, ...data.posts]));
            })
            .then(() => {
                setPageNum(currentPageNum => (currentPageNum + 1));
                loadingBar.setTopicLoading(false);
            })
            .catch(error => {
                modal.setErrorModal(errorModal => ([...errorModal, {errorId: errorModal.length,  error}]));
                loadingBar.setTopicLoading(false);
            });
        }
    }

    useEffect(() => {
        setDatas([]);
        setHasMore(true);
        setPageNum(0);
        fetchTopicsByPostIdAndPagination(topic.selectedCatId, 0, pageSize);
    }, [topic.selectedCatId]);

    useEffect(() => {
        setDatas([]);
        setHasMore(true);
        setPageNum(0);
        fetchProfileByProfileIdAndPagination(topic.profileId, 0, pageSize);
    }, [topic.profileId]);

    useEffect(() => {
        if(topic.refresh) {
            setHasMore(true);
            setPageNum(0);
            setDatas([]);
            if(!!topic.selectedCatId && !loadingBar.topicLoading) {
                fetchTopicsByPostIdAndPagination(topic.selectedCatId, 0, pageSize);
            }
    
            if(!!topic.profileId && !loadingBar.topicLoading) {
                fetchProfileByProfileIdAndPagination(topic.profileId, 0, pageSize);
            }
            topic.setRefresh(false);
            scrollToTop();
        }

    }, [topic.refresh]);

    const observer = useRef();
    const lastDataRef = useCallback(node => {
        if(loadingBar.topicLoading) return;
        if(observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore) {
                if(!!topic.selectedCatId) fetchTopicsByPostIdAndPagination(topic.selectedCatId, pageNum, pageSize);
                if(!!topic.profileId) fetchProfileByProfileIdAndPagination(topic.profileId, pageNum, pageSize);
            }
        });

        if(node) observer.current.observe(node);
    }, [loadingBar.topicLoading, hasMore]);

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
                                    <Link to={`/posts/${data.id}`} className={`post-topic-link${content.postId === data.id ? ' selected-post-color' : ''}`} onClick={() => {if(!loadingBar.contentLoading) setPost(data.id)}}>
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
                                    <Link to={`/posts/${data.id}`} className={`post-topic-link${content.postId === data.id ? ' selected-post-color' : ''}`} onClick={() => {if(!loadingBar.contentLoading) setPost(data.id)}}>
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