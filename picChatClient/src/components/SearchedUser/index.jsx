import s from './styles.module.scss'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function SearchedUser ({ user, messages, onClick, updateDataAfterSubscribe, updateDataAfterRemoveSubscribe, cancelModal, theme, currentUser, isChatComponent, updateUserAfterAddingPersonalChat, updateMessagesAfterAddingPersonalChat }) {
    const navigate = useNavigate();
    const [isSigned, setIsSigned] = useState(user?.subscribers?.includes(localStorage.getItem('id')) || false);
    const [personalChatIdList, setPersonalChatIdList] = useState([]);

    useEffect(() => {
        setIsSigned(user?.subscribers?.includes(localStorage.getItem('id')) || false);
    }, [user])

    useEffect(() => {
        if (currentUser) {
            setPersonalChatIdList(currentUser.chats?.map(chat => {
                if (chat.chatId && chat.personalChat == true) {
                    return chat.chatId;
                }
            }) || null);
        }
    }, [])

    const addNewChat = () => {
        const payload = {
            "token": localStorage.getItem('id'),
            "userToken": user._id
        }

        fetch("https://linstagramserver-1.onrender.com/messages/add-chat", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)

            const payload = {
                _id: data.chatId,
                personalChat: true,
                members: [localStorage.getItem('id'), user._id]
            }

            updateUserAfterAddingPersonalChat(data.chatId, user._id);
            updateMessagesAfterAddingPersonalChat(payload);
            navigate(`/messages/${data.chatId}`);
        })
        .catch();
    }

    const navigateToChat = () => {
        if (!personalChatIdList) {
            addNewChat();
        } else {
            const chatId = messages.map(chat => {
                if (personalChatIdList.includes(chat._id) && chat.members.includes(user._id)) {
                    return chat._id;
                }
                // console.log(chat)
                // console.log(chat.members.includes(localStorage.getItem('id'), user._id))
            })[0];

            if (!chatId) {
                addNewChat();
            } else {
                navigate(`/messages/${chatId}`);
            }
        }
    }

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
                    !onClick && updateDataAfterSubscribe ? (
                        !isSigned ? (
                            <button onClick={subscribe} className={s.subscribe_btn}>Subscribe</button>
                        ) : (
                            <button onClick={removeSubscribe} className={s.signed_btn}>Signed</button>
                        )
                    ) : (
                        isChatComponent && (
                            <button onClick={navigateToChat} className={s.subscribe_btn}>Write</button>
                        )
                    )
                }
            </div>
        </div>
    )
}