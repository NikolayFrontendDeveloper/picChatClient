import s from './styles.module.scss'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function SearchedUser ({ user, onClick, updateDataAfterSubscribe, updateDataAfterRemoveSubscribe, cancelModal, theme }) {
    const navigate = useNavigate();
    const [isSigned, setIsSigned] = useState(user?.subscribers?.includes(localStorage.getItem('id')) || false);

    useEffect(() => {
        setIsSigned(user?.subscribers?.includes(localStorage.getItem('id')) || false);
    }, [user])

    const navigateToProfile = () => {
        if (onClick) {
            onClick();
        }
        if (cancelModal) {
            cancelModal();
        }
        navigate(`/profile/${user._id}`)
    }

    const subscribe = () => {
        const payload = {
            token: localStorage.getItem('id'),
            targetToken: user._id
        }

        fetch("https://linstagramserver-1.onrender.com/subscribe", {
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
    }

    const removeSubscribe = () => {
        const payload = {
            token: localStorage.getItem('id'),
            targetToken: user._id
        }

        fetch("https://linstagramserver-1.onrender.com/remove-subscribe", {
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
    }

    return (
        <div className={s.user_container}>
            <div className={s.user_img_box}>
                {user && user.avaUrl ? (
                    <img onClick={navigateToProfile} className={s.user_ava} src={user.avaUrl} alt="ava icon" />
                ) : (
                    <img onClick={navigateToProfile} className={s.user_ava} src={`/${theme}/ava-icon.svg`} alt="ava icon" />
                )}
                <p onClick={navigateToProfile} className={s.user_name}>{user.username}</p>
            </div>
            <div className={s.user_data}>
                {
                    !onClick && user._id !== localStorage.getItem('id') && (
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