import s from "./styles.module.scss";
import { useState, useEffect } from "react";
import CommentModal from "../CommentModal";
import { useNavigate } from "react-router-dom";

export default function UserPost({ deletePost, data, post, user, updateUserAfterRemoveFavorite, updatePostAfterComment, updatePostComment, updateLikesInPost, updateUserAfterFavorite, theme, token, id }) {
    const date = new Date();
    const range = date - post.time;
    const [likes, setLikes] = useState(post.likes || []);
    const [isLiked, setIsLiked] = useState(likes.includes(localStorage.getItem("id")));
    const [isCommentModal, setIsCommentModal] = useState(false);
    const [postAva, setPostAva] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        user.favoritePosts?.forEach(fav => {
            if (fav.postToken === post.token && fav.imageUrl === post.imageUrl) {
                setIsFavorite(true);
            }
        })
    }, [user, isCommentModal])

    const getPostAva = async () => {
        try {
            const userData = data.find(elem => post.token === elem._id);
            
            if (userData && userData.avaUrl) {
                // Пробуем загрузить изображение аватарки
                const response = await fetch(userData.avaUrl);
                if (response.ok) {
                    setPostAva(userData.avaUrl);
                } else {
                    // Если не удалось загрузить, ставим дефолтное значение
                    setPostAva(`/${theme}/ava-icon.svg`);
                    console.log("Если не удалось загрузить, ставим дефолтное значение")
                }
            } else {
                // Если данных нет или нет URL, ставим дефолтное значение
                setPostAva(`/${theme}/ava-icon.svg`);
                // console.log("Если данных нет или нет URL, ставим дефолтное значение")
            }
        } catch (error) {
            console.error("Ошибка при загрузке аватарки:", error);
            setPostAva(`/${theme}/ava-icon.svg`); // В случае ошибки также устанавливаем дефолтное значение
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

    const fetchUserPosts = () => {
        navigate(`/user-posts/${token}/${id}`);
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
            action === 'add-favorite' ? updateUserAfterFavorite({ postToken: post.token, imageUrl: post.imageUrl, time: Date.now() }) : updateUserAfterRemoveFavorite(post);
        } catch (error) {
            console.error(`Error ${action} like:`, error);
        }
    };

    return (
        <div className={s.container}>
            {isCommentModal && (
                <CommentModal
                    deletePost={deletePost}
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
                    updateLikesInPost={updateLikesInPost}
                    isFavorite={isFavorite}
                    handleFavorite={handleFavorite}
                    theme={theme}
                />
            )}
            <img onClick={window.innerWidth < 768 ? fetchUserPosts : openModal} src={post.imageUrl} alt="user image" />
        </div>
    );
}
