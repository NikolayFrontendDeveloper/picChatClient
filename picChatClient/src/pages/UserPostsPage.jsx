import Post from '../components/Post/Post';
import s from "./styles.module.scss";
import post from "../components/Post/styles.module.scss"
import { useState, useEffect, useCallback, useRef  } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function MainPage({ theme, deletePost, user, posts, data, updateDataAfterSubscribe, updateDataAfterRemoveSubscribe, updatePostAfterComment, updatePostComment, updateLikesInPost }) {
    const navigate = useNavigate();
    const [userPosts, setUserPosts] = useState([]);
    const { token } = useParams();
    const { id } = useParams();
    const postsRef = useRef(null);

    useEffect(() => {
        if (userPosts.length > 0 && id) {
            scrollToIndex(id);
        }
    }, [id, userPosts]);

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

    const scrollToIndex = (index) => {
        const postsNode = postsRef.current;
        if (!postsNode) return;
    
        const imgNode = postsNode.querySelectorAll(`.${post.post_container}`)[index];
        if (imgNode) {
            imgNode.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    };

    if(!localStorage.getItem('id')) {
        navigate('/login');
    }

    return (
        <div className={s.container}>
            <div ref={postsRef} className={s.posts_container}>
                {Array.isArray(userPosts) && userPosts.length > 0 ? (
                    userPosts.sort((a, b) => b.time - a.time).map((post, index) => (
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
