import s from "./styles.module.scss";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import CommentModal from "../CommentModal";

export default function Post({ data, user, post, updatePostAfterComment, updatePostComment, updateLikesInPost }) {
    const date = new Date();
    const range = date - post.time;
    const [likes, setLikes] = useState(post.likes || []);
    const [isLiked, setIsLiked] = useState(likes.includes(localStorage.getItem("id")));
    const [isCommentModal, setIsCommentModal] = useState(false);
    const [postAva, setPostAva] = useState('');
    const navigate = useNavigate();

    const getPostAva = async () => {
        try {
            const userData = data.find(elem => post.token === elem._id);
            
            if (userData && userData.avaUrl) {
                const response = await fetch(userData.avaUrl);
                if (response.ok) {
                    setPostAva(userData.avaUrl);
                } else {
                    setPostAva('/ava-icon.svg');
                    console.log("Если не удалось загрузить, ставим дефолтное значение")
                }
            } else {
                setPostAva('/ava-icon.svg');
                // console.log("Если данных нет или нет URL, ставим дефолтное значение")
            }
        } catch (error) {
            console.error("Ошибка при загрузке аватарки:", error);
            setPostAva('/ava-icon.svg');
        }
    };

    useEffect(() => {
        getPostAva();
    }, []);

    useEffect(() => {
        setIsLiked(likes.includes(localStorage.getItem("id")));
    }, [likes]); 

    let time;
    const getTime = () => {
        if (range <= 60000) {
            time = 'just now';
        } else if (range <= 60000 * 5) {
            time = '5 minutes ago';
        } else if (range <= 3600000) {
            time = 'one hour ago';
        } else if (range <= 3600000 * 24) {
            time = 'today';
        } else if (range <= 3600000 * 48) {
            time = 'yesterday';
        } else if (range <= 3600000 * 24 * 7) {
            time = 'one week ago';
        } else if (range <= 3600000 * 24 * 7 * 4) {
            time = 'one month ago';
        } else if (range.getFullYear() < 1) {
            time = `${range.getMonth()} months ago`;
        } else if (range.getFullYear() === 1) {
            time = 'one year ago';
        } else {
            time = `${range.getFullYear()} years ago`;
        }
    };
    getTime();

    const addLike = async () => {
        const payload = {
            "user": post.name,
            "token": localStorage.getItem("id"),
            "imageUrl": post.imageUrl
        };

        fetch("https://linstagramserver-1.onrender.com/posts/like", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        })
        .catch((error) => {
            console.error("Error adding like:", error);
        });
        setLikes([...likes, localStorage.getItem("id")]);
        setIsLiked(true);
        updateLikesInPost(post.imageUrl, [...likes, localStorage.getItem("id")]);
    };

    const removeLike = async () => {
        const payload = {
            "user": post.name,
            "token": localStorage.getItem("id"),
            "imageUrl": post.imageUrl
        };
    
        fetch("https://linstagramserver-1.onrender.com/posts/unlike", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        })
        .catch((error) => {
            console.error("Error removing like:", error);
        });
        const updatedLikes = likes.filter(token => token !== localStorage.getItem("id"));
        setLikes(updatedLikes);
        setIsLiked(false);
        updateLikesInPost(post.imageUrl, updatedLikes);
    };

    const cancelModal = () => {
        setIsCommentModal(false);
    };

    const openModal = () => {
        setIsCommentModal(true);
    };

    return (
        <div className={s.post_container}>
            <div onClick={() => {navigate(`/profile/${post.token}`)}} className={s.user_container}>
                {postAva ? (
                    <img className={s.user_icon} src={postAva} alt="ava icon" />
                ) : (
                    <div className={s.user_icon_placeholder}></div>
                )}
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
                        cancelModal={cancelModal} 
                        post={post} 
                        addLike={addLike} 
                        removeLike={removeLike} 
                        updatePostAfterComment={updatePostAfterComment}
                        updatePostComment={updatePostComment}
                    />
                )}
                <img className={s.post_img} onClick={openModal} src={post.imageUrl} alt="user image" />
                <div className={s.image_functions_box}>
                    <div className={s.like_comment_wrapper}>
                        {!isLiked ? (
                            <img onClick={addLike} src="/notliked-icon.svg" alt="not liked icon" />
                        ) : (
                            <img onClick={removeLike} className={s.liked_icon} src="/liked-icon.svg" alt="liked icon" />
                        )}
                        <img onClick={openModal} src="/comment-icon.svg" alt="comment icon" />
                    </div>
                </div>
                <p>{likes.length} likes</p>
            </div>
            {post.text && (
                <p><span className={s.user_name}>{post.name}</span> {post.text}</p>
            )}
        </div>
    );
}
