import Post from '../components/Post/Post';
import s from "./styles.module.scss";
import SearchedUser from '../components/SearchedUser';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MainPage({ user, posts, data, updateDataAfterSubscribe, updateDataAfterRemoveSubscribe, updatePostAfterComment, updatePostComment, updateLikesInPost }) {
    const [users, setUsers] = useState([]);
    const [visiblePosts, setVisiblePosts] = useState([]);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const POSTS_PER_PAGE = 10;

    useEffect(() => {
        setVisiblePosts(posts.slice(0, POSTS_PER_PAGE));
    }, [posts]);

    const loadMorePosts = useCallback(() => {
        const newPage = page + 1;
        const newVisiblePosts = posts.slice(0, POSTS_PER_PAGE * newPage);
        setVisiblePosts(newVisiblePosts);
        setPage(newPage);
    }, [page, posts]);

    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50) {
            loadMorePosts();
        }
    }, [loadMorePosts]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        const filteredUsers = data.filter((user) => {
            return (
                !user.subscribers?.includes(localStorage.getItem('id')) &&
                user._id !== localStorage.getItem('id')
            );
        }).slice(0, 10);
        
        setUsers(filteredUsers);
    }, [data]);

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
                            updateLikesInPost={updateLikesInPost} />
                    ))
                ) : (
                    <p>No available posts</p>
                )}
            </div>
            <div className={s.recommendations_container}>
                <p className={s.recommendations_title}>Recommendations:</p>
                {Array.isArray(users) && users.length > 0 ? (
                    users.map((user, index) => (
                        <SearchedUser
                            updateDataAfterSubscribe={updateDataAfterSubscribe}
                            updateDataAfterRemoveSubscribe={updateDataAfterRemoveSubscribe}
                            user={user}
                            key={index}/>
                    ))
                ) : (
                    <p>No recommendations</p>
                )}
            </div>
        </div>
    );
}
