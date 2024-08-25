import Post from '../components/Post/Post';
import s from "./styles.module.scss";
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function MainPage({ theme, deletePost, user, posts, data, updateDataAfterSubscribe, updateDataAfterRemoveSubscribe, updatePostAfterComment, updatePostComment, updateLikesInPost }) {
    const [visiblePosts, setVisiblePosts] = useState([]);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const POSTS_PER_PAGE = 10;
    const [userPosts, setUserPosts] = useState([]);
    const { token } = useParams();
    const { id } = useParams();

    useEffect(() => {
        const user = data.find(user => user._id === token);
        data.map(user => {
            if (user._id === token) {
            }
        });
        if (user) {
            setUserPosts(user.posts || []);
        }
    }, [data, token]);

    useEffect(() => {
        setVisiblePosts(userPosts.slice(0, POSTS_PER_PAGE));
    }, [userPosts]);

    const loadMorePosts = useCallback(() => {
        const newPage = page + 1;
        const newVisiblePosts = userPosts.slice(0, POSTS_PER_PAGE * newPage);
        setVisiblePosts(newVisiblePosts);
        setPage(newPage);
    }, [page, userPosts]);

    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50) {
            loadMorePosts();
        }
    }, [loadMorePosts]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    if(!localStorage.getItem('id')) {
        navigate('/login');
    }


    return (
        <div className={s.container}>
            <div className={s.posts_container}>
                {Array.isArray(visiblePosts) && visiblePosts.length > 0 ? (
                    visiblePosts.map((post, index) => (
                        <Post key={index}
                            data={data}
                            user={user}
                            post={post}
                            updatePostAfterComment={updatePostAfterComment}
                            updatePostComment={updatePostComment}
                            updateLikesInPost={updateLikesInPost}
                            deletePost={deletePost}
                            theme={theme} />
                    ))
                ) : (
                    <p>No available posts</p>
                )}
            </div>
        </div>
    );
}
