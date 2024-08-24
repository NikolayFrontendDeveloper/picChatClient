import s from "./styles.module.scss";
import { useState, useEffect } from "react";
import Comment from '../Comment';
import PostFuncModal from '../PostFuncModal'
import { useNavigate } from 'react-router-dom';

export default function CommentModal({ theme, deletePost, postAva, data, user, cancelModal, post, isLiked, addLike, removeLike, likes, updatePostAfterComment, updatePostComment, updateLikesInPost }) {
    const [inputText, setInputText] = useState('');
    const [comments, setComments] = useState(post.comments || []);
    const [isModal, setIsModal] = useState(false);
    const navigate = useNavigate();

    const uploadComment = async () => {
        const payload = {
            user: post.name || user.username,
            token: localStorage.getItem("id"),
            imageUrl: post.imageUrl,
            text: inputText
        };

        try {
            const response = await fetch("https://linstagramserver-1.onrender.com/posts/add-comment", {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (data.ok) {
                const newComment = {
                    id: data.id,
                    token: localStorage.getItem("id"),
                    username: user.username,
                    text: inputText,
                    likes: []
                };
                setComments(prevComments => [...prevComments, newComment]);
                setInputText('');
                updatePostAfterComment(post.imageUrl, newComment);
            } else {
                console.error("Error adding comment:", data.comment);
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const addLikeOnComment = async (commentId) => {
        const payload = {
            user: post.name || user.username,
            token: localStorage.getItem("id"),
            imageUrl: post.imageUrl,
            id: commentId
        };

        try {
            const response = await fetch("https://linstagramserver-1.onrender.com/posts/comment/like", {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (data.ok) {
                const updatedComments = comments.map(comment => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            likes: [...(comment.likes || []), localStorage.getItem("id")]
                        };
                    }
                    return comment;
                });
                setComments(updatedComments);
                updatePostComment(post.imageUrl, updatedComments);
            } else {
                console.error("Error adding like to comment:", data.comment);
            }
        } catch (error) {
            console.error("Error adding like to comment:", error);
        }
    };

    const removeLikeOnComment = async (commentId) => {
        const payload = {
            user: post.name || user.username,
            token: localStorage.getItem("id"),
            imageUrl: post.imageUrl,
            id: commentId
        };

        try {
            const response = await fetch("https://linstagramserver-1.onrender.com/posts/comment/unlike", {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (data.ok) {
                const updatedComments = comments.map(comment => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            likes: (comment.likes || []).filter(like => like !== localStorage.getItem("id"))
                        };
                    }
                    return comment;
                });
                setComments(updatedComments);
                updatePostComment(post.imageUrl, updatedComments);
            } else {
                console.error("Error removing like from comment:", data.comment);
            }
        } catch (error) {
            console.error("Error removing like from comment:", error);
        }
    };

    const removeComment = async (commentId) => {
        const payload = {
            user: post.name || user.username,
            token: localStorage.getItem('id'),
            imageUrl: post.imageUrl,
            id: commentId
        };
    
        try {
            const response = await fetch("https://linstagramserver-1.onrender.com/posts/remove-comment", {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            const data = await response.json();
            if (data.ok) {
                const updatedComments = comments.filter(comment => {
                    if (comment.id !== commentId || comment.token !== localStorage.getItem('id')) {
                        return comment
                    }
                });
                setComments(updatedComments);
                updatePostComment(post.imageUrl, updatedComments);
            } else {
                console.error("Error removing comment:", data.comment);
            }
        } catch (error) {
            console.error("Error removing comment:", error);
        }
    }

    const cancelPostFuncModul = () => {
        setIsModal(false);
    }

    return (
        <div className={s.container}>
            {isModal && (
                <PostFuncModal 
                    cancelModal={cancelPostFuncModul}
                    deletePost={deletePost}
                    post={post}/>
            )}
            <div className={s.modal_body}>
                <img className={s.post_image} src={post.imageUrl} alt="image" />
                <div className={s.comments_wrapper}>
                    <div className={s.username_container}>
                        <div onClick={() => {navigate(`/profile/${post.token}`)}} className={s.username_container_box}>
                            {postAva ? (
                                <img className={s.user_icon} src={postAva} alt="ava icon" />
                            ) : (
                                <div className={s.user_icon_placeholder}></div>
                            )}
                            <p className={s.username}>{post.name || user.username}</p>
                        </div>
                        <img onClick={() => {setIsModal(true)}} className={s.post_menu_btn} src={`/${theme}/additionally-function.svg`} alt="menu dots" />
                    </div>
                    <div className={s.comments_box}>
                        {post.text && (
                            <div onClick={() => {navigate(`/profile/${post.token}`)}} className={s.comment_container}>
                                {postAva ? (
                                    <img className={s.user_icon} src={postAva} alt="ava icon" />
                                ) : (
                                    <div className={s.user_icon_placeholder}></div>
                                )}
                                <p><span className={s.username}>{post.name || user.username} </span>{post.text}</p>
                            </div>
                        )}
                        {comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <Comment
                                    key={index}
                                    data={data}
                                    post={post}
                                    comment={comment}
                                    addLikeOnComment={addLikeOnComment}
                                    removeLikeOnComment={removeLikeOnComment}
                                    updatePostAfterComment={updatePostAfterComment}
                                    removeComment={removeComment}
                                    theme={theme}
                                />
                            ))
                        ) : (
                            <div></div>
                        )}
                    </div>
                    <div className={s.image_functions_box}>
                        <div className={s.like_comment_wrapper}>
                            {!isLiked ? (
                                <img onClick={addLike} src={`/${theme}/notliked-icon.svg`} alt="not liked icon" />
                            ) : (
                                <img onClick={removeLike} className={s.liked_icon} src="/liked-icon.svg" alt="liked icon" />
                            )}
                            <img src={`/${theme}/comment-icon.svg`} alt="comment icon" />
                        </div>
                    </div>
                    <p className={s.likes_amount}>{likes.length} likes</p>
                    <div className={s.comment_post_wrapper}>
                        <input
                            onChange={e => setInputText(e.target.value)}
                            value={inputText}
                            className={s.comment_input}
                            type="text"
                            placeholder="Add comment"
                        />
                        <button onClick={uploadComment} className={s.button_upload}>Upload</button>
                    </div>
                </div>
            </div>
            <div onClick={cancelModal} className={s.modal_wrapper}></div>
        </div>
    );
}
