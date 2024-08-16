import s from './styles.module.scss'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function SearchedUser ({ user, onClick, updateDataAfterSubscribe, updateDataAfterRemoveSubscribe }) {
    const navigate = useNavigate();
    const [isSigned, setIsSigned] = useState(user?.subscribers?.includes(localStorage.getItem('id')) || false);

    const navigateToProfile = () => {
        if (onClick) {
            onClick();
        }
        navigate(`/profile/${user._id}`)
    }

    const subscribe = () => {
        const payload = {
            token: localStorage.getItem('id'),
            targetToken: user._id
        }

        fetch("http://localhost:3000/subscribe", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        })
        .catch((err) => {
            console.log(err);
        })
        updateDataAfterSubscribe(localStorage.getItem('id'), user._id)
        setIsSigned(true);
    }

    const removeSubscribe = () => {
        const payload = {
            token: localStorage.getItem('id'),
            targetToken: user._id
        }

        fetch("http://localhost:3000/remove-subscribe", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        })
        .catch((err) => {
            console.log(err);
        })
        updateDataAfterRemoveSubscribe(localStorage.getItem('id'), user._id)
        setIsSigned(false);
    }

    return (
        <div className={s.user_container}>
            {user && user.avaUrl ? (
                <img onClick={navigateToProfile} className={s.user_ava} src={user.avaUrl} alt="ava icon" />
            ) : (
                <img onClick={navigateToProfile} className={s.user_ava} src="/ava-icon.svg" alt="ava icon" />
            )}
            <div className={s.user_data}>
                <p onClick={navigateToProfile} className={s.user_name}>{user.username}</p>
                {
                    !onClick && (
                        !isSigned ? (
                            <button onClick={subscribe} className={s.subscribe_btn}>Subscribe</button>
                        ) : (
                            <button onClick={removeSubscribe} className={s.signed_btn}>Signed</button>
                        )
                    )
                }
            </div>
        </div>
    )
}