import s from "../CommentModal/styles.module.scss";
import { useState, useEffect } from "react";
import RemovingCommentModal from '../RemovingCommentModal'
import { useNavigate } from 'react-router-dom';

export default function Comment({ data, addLikeOnComment, removeLikeOnComment, comment, removeComment, theme }) {
    const [isLikedComment, setIsLikedComment] = useState(false);
    const [isCommentModal, setIsCommentModal] = useState(false);
    const [userAva, setUserAva] = useState('');
    const navigate = useNavigate();

    const cancelModal = () => {
        setIsCommentModal(false);
    };

    const openModal = () => {
        setIsCommentModal(true);
    };

    const getCommentAva = () => {
        data.forEach((elem) => {
            if (comment.token === elem._id) {
                setUserAva(elem.avaUrl);
            }
        })
    }

    useEffect(() => {
        getCommentAva();
    }, [])

    useEffect(() => {
        setIsLikedComment(comment.likes && comment.likes.includes(localStorage.getItem("id")));
    }, [comment]);

    return (
        <div className={s.comment_box}>
            <div className={s.comment_wrapper}>
                <div className={s.comment_user_container}>
                    {userAva ? (
                        <img onClick={() => {navigate(`/profile/${comment.token}`)}} className={s.user_icon} src={userAva} alt="ava icon" />
                    ) : (
                        <img onClick={() => {navigate(`/profile/${comment.token}`)}} className={s.user_icon} src={`/${theme}/ava-icon.svg`} alt="ava icon" />
                    )}
                    <p><span onClick={() => {navigate(`/profile/${comment.token}`)}} className={s.username}>{comment.username} </span>{comment.text}</p>
                </div>
                {isLikedComment ? (
                    <img
                        className={s.comments_liked_icon}
                        src="/liked-icon.svg"
                        alt="liked icon"
                        onClick={() => removeLikeOnComment(comment.id)}
                    />
                ) : (
                    <img
                        className={s.comments_notliked_icon}
                        src={`/${theme}/notliked-icon.svg`}
                        alt="not liked icon"
                        onClick={() => addLikeOnComment(comment.id)}
                    />
                )}
            </div>
            <div className={s.comment_underline}>
                <p>Liked: {comment.likes ? comment.likes.length : 0}</p>
                <img onClick={openModal} className={s.additionally_func} src={`/${theme}/additionally-function.svg`} alt="additionally function of comment" />
                {isCommentModal && (
                    <RemovingCommentModal
                        id={comment.id}
                        cancelModal={cancelModal}
                        removeComment={removeComment}
                    />
                )}
            </div>
        </div>
    );
}
