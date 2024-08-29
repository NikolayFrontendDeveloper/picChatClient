import s from "./styles.module.scss";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import CommentModal from "../CommentModal";

export default function Post({ data, user, post, deletePost, updatePostAfterComment, updatePostComment, updateLikesInPost, theme, getUserData }) {
    const [likes, setLikes] = useState(post.likes || []);
    const [isLiked, setIsLiked] = useState(likes.includes(localStorage.getItem("id")));
    const [isCommentModal, setIsCommentModal] = useState(false);
    const [postAva, setPostAva] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate();
    const [waitingClick, setWaitingClick] = useState(null);
    const [lastClick, setLastClick] = useState(0);

    useEffect(() => {
        user?.favoritePosts?.forEach(fav => {
            if (fav.postToken === post.token && fav.imageUrl === post.imageUrl) {
                setIsFavorite(true);
            }
        })
    }, [user])

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const userData = data.find(elem => post.token === elem._id);
                const defaultAvatar = `/${theme}/ava-icon.svg`;
                if (userData?.avaUrl) {
                    const response = await fetch(userData.avaUrl);
                    setPostAva(response.ok ? userData.avaUrl : defaultAvatar);
                } else {
                    setPostAva(defaultAvatar);
                }
            } catch (error) {
                console.error("Ошибка при загрузке аватарки:", error);
                setPostAva(`/${theme}/ava-icon.svg`);
            }
        };
        fetchAvatar();
    }, [data, post.token, theme]);

    useEffect(() => {
        setIsLiked(likes.includes(localStorage.getItem("id")));
    }, [likes]);

    const time = (() => {
        const range = Date.now() - post.time;
        const units = [
            { limit: 60000, text: 'just now' },
            { limit: 60000 * 5, text: '5 minutes ago' },
            { limit: 3600000, text: 'one hour ago' },
            { limit: 3600000 * 24, text: 'today' },
            { limit: 3600000 * 48, text: 'yesterday' },
            { limit: 3600000 * 24 * 7, text: 'one week ago' },
            { limit: 3600000 * 24 * 7 * 4, text: 'one month ago' }
        ];
        const unit = units.find(({ limit }) => range <= limit);
        return unit ? unit.text : (range > 31536000000 ? `${Math.floor(range / 31536000000)} years ago` : 'over a month ago');
    })();

    const handleLike = async (action) => {
        const payload = { user: post.name, token: localStorage.getItem("id"), imageUrl: post.imageUrl };
        try {
            await fetch(`https://linstagramserver-1.onrender.com/posts/${action}`, {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });
            const updatedLikes = action === 'like' ? [...likes, payload.token] : likes.filter(id => id !== payload.token);
            setLikes(updatedLikes);
            setIsLiked(action === 'like');
            updateLikesInPost(post.imageUrl, updatedLikes);
        } catch (error) {
            console.error(`Error ${action} like:`, error);
        }
    };

    const likePost = async () => {
        const payload = { user: post.name, token: localStorage.getItem("id"), imageUrl: post.imageUrl };
        if (!isLiked) {
            try {
                await fetch('https://linstagramserver-1.onrender.com/posts/like', {
                    method: "POST",
                    body: JSON.stringify(payload),
                    headers: { "Content-Type": "application/json" },
                });
                const updatedLikes = [...likes, payload.token];
                setLikes(updatedLikes);
                setIsLiked(true);
                updateLikesInPost(post.imageUrl, updatedLikes);
            } catch (error) {
                console.error(`Error like:`, error);
            }
        }
    };

    const processClick = (e) => {
        if(lastClick&&e.timeStamp - lastClick < 250 && 
        waitingClick){
            setLastClick(0);
            clearTimeout(waitingClick);
            setWaitingClick(null);
            likePost();
            // console.log('double click')
        } else{
            setLastClick(e.timeStamp);
            setWaitingClick(setTimeout(()=>{
            setWaitingClick(null);
            }, 251))
            // console.log('single click')
        }
    }

    const handleFavorite = async (action) => {
        const payload = { postToken: post.token, token: localStorage.getItem("id"), imageUrl: post.imageUrl };
        try {
            await fetch(`https://linstagramserver-1.onrender.com/${action}`, {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });
            setIsFavorite(action === 'add-favorite');
            getUserData();
        } catch (error) {
            console.error(`Error ${action} like:`, error);
        }
    };

    return (
        <div className={s.post_container}>
            <div onClick={() => navigate(`/profile/${post.token}`)} className={s.user_container}>
                <img
                    className={s.user_icon}
                    src={postAva}
                    alt="ava icon"
                />
                <p><span className={s.user_name}>{post.name}</span> •| {time}</p>
            </div>
            <div className={s.post_wrapper}>
                {isCommentModal && (
                    <CommentModal
                        postAva={postAva}
                        data={data}
                        user={user}
                        likes={likes}
                        isLiked={isLiked}
                        cancelModal={() => setIsCommentModal(false)}
                        post={post}
                        addLike={() => handleLike('like')}
                        removeLike={() => handleLike('unlike')}
                        updatePostAfterComment={updatePostAfterComment}
                        updatePostComment={updatePostComment}
                        deletePost={deletePost}
                        isFavorite={isFavorite}
                        handleFavorite={handleFavorite}
                        theme={theme}
                    />
                )}
                <img
                    className={s.post_img}
                    onClick={(e)=>processClick(e)}
                    src={post.imageUrl}
                    alt="user image"
                />
                <div className={s.image_functions_box}>
                    <div className={s.like_comment_wrapper}>
                        <img
                            onClick={() => handleLike(isLiked ? 'unlike' : 'like')}
                            src={isLiked ? '/liked-icon.svg' : `/${theme}/notliked-icon.svg`}
                            alt={`${isLiked ? 'liked' : 'not liked'} icon`}
                        />
                        <img
                            onClick={() => setIsCommentModal(true)}
                            src={`/${theme}/comment-icon.svg`}
                            alt="comment icon"
                        />
                    </div>
                    <img
                        onClick={() => handleFavorite(isFavorite ? 'delete-favorite' : 'add-favorite')}
                        src={isFavorite ? `/${theme}/favorite-icon.svg` : `/${theme}/not-favorite-icon.svg`}
                        alt="comment icon"
                    />
                </div>
                <p>{likes.length} likes</p>
            </div>
            {post.text && <p><span className={s.user_name}>{post.name}</span> {post.text}</p>}
        </div>
    );
}
