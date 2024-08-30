import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import s from "./styles.module.scss";
import UserPost from '../../components/UserPost/index';
import AvaModal from "../../components/AvaModal";
import axios from 'axios';
import SubscribeModal from "../../components/SubscribeModal";
import MenuModal from "../../components/MenuModal";

export default function ProfilePage({ favorite, activeTab, setActiveTab, theme, user, changeTheme, logOut, updateUserAfterRemoveFavorite, updateDataAfterRemoveSubscribe, updateDataAfterSubscribe, deletePost, data, updatePostAfterComment, updatePostComment, updateLikesInPost, updateAva, updateUserAfterFavorite }) {
    const [modal, setModal] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const { token } = useParams();
    const [userByToken, setUserByToken] = useState(data.find(user => user._id === token) || null);
    const [isSigned, setIsSigned] = useState(user?.subscriptions?.includes(token) || false);
    const [subscribers, setSubscribers] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [subscribersModal, setSubscribersModal] = useState(false);
    const [subscriptionsModal, setSubscriptionsModal] = useState(false);
    const [menuModal, setMenuModal] = useState(false);

    useEffect(() => {
        const newUser = data.find(user => user._id === token) || null;
        setUserByToken(newUser);
        if (newUser) {
            setSubscriptions(newUser.subscriptions || []);
            setSubscribers(newUser.subscribers || []);
            setIsSigned(user?.subscriptions?.includes(token) || false);
        } else {
            setSubscriptions([]);
            setSubscribers([]);
            setIsSigned(false);
        }
    }, [token, data, user])
    
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const cancelMenuModal = () => {
        setMenuModal(false);
    }

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        const validImageTypes = ['image/jpeg', 'image/png'];

        if (selectedFile && validImageTypes.includes(selectedFile.type)) {
            setPreviewUrl(URL.createObjectURL(selectedFile));
            await handleUpload(selectedFile);
        } else {
            setPreviewUrl('');
        }
    };

    const handleUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'vby5plvu'); // replace with your upload preset

        try {
            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/da1h0vrzb/image/upload', // replace with your Cloudinary cloud name
                formData
            );
            const payload = {
                token: localStorage.getItem('id'),
                imageUrl: response.data.secure_url
            };
            updateAva(response.data.secure_url);
            uploadAva(payload);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const uploadAva = (payload) => {
        removeAvaFromCloudinary();

        fetch("https://linstagramserver-1.onrender.com/add-ava", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
            })
            .then(() => {
                window.location.reload();
            })
    }

    const subscribe = () => {
        const payload = {
            token: localStorage.getItem('id'),
            targetToken: token
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
        updateDataAfterSubscribe(localStorage.getItem('id'), token)
        setIsSigned(true);
        setSubscribers(subscribers + 1);
    }

    const removeSubscribe = () => {
        const payload = {
            token: localStorage.getItem('id'),
            targetToken: token
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
        updateDataAfterRemoveSubscribe(localStorage.getItem('id'), token)
        setIsSigned(false);
        setSubscribers(subscribers - 1);
    }

    const removeAva = () => {
        removeAvaFromCloudinary();

        const payload = {
            token: localStorage.getItem('id')
        }

        fetch("https://linstagramserver-1.onrender.com/remove-ava", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(() => {
            window.location.reload();
        })
    }

    const cancelModal = () => {
        setModal(false);
    }

    const cancelSubscribersModal = () => {
        setSubscribersModal(false);
    }

    const cancelSubscriptionsModal = () => {
        setSubscriptionsModal(false);
    }

    const removeAvaFromCloudinary = () => {
        if (userByToken.avaUrl) {
            const parts = userByToken.avaUrl.split('/');
            const publicIdWithExtension = parts[parts.length - 1];
            const publicId = publicIdWithExtension.split('.')[0];

            if (publicId) {
                fetch("https://linstagramserver-1.onrender.com/delete-image", {
                    method: "POST",
                    body: JSON.stringify({
                        "publicId": publicId,
                        "typeFile": "image"
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            }
        }
    }

    return (
        <>
            {userByToken && (
                <div className={s.page_wrapper}>
                    {menuModal && (
                            <MenuModal
                                changeTheme={changeTheme}
                                cancelMenuModal={cancelMenuModal}
                                theme={theme}
                                logOut={logOut}
                            />
                        )}
                    {modal && (
                        <AvaModal 
                            cancelModal={cancelModal}
                            handleFileChange={handleFileChange}
                            removeAva={removeAva}
                        />
                    )}
                    {subscribersModal && (
                        <SubscribeModal
                            updateDataAfterSubscribe={updateDataAfterSubscribe}
                            updateDataAfterRemoveSubscribe={updateDataAfterRemoveSubscribe}
                            cancelModal={cancelSubscribersModal}
                            subscribers={userByToken.subscribers}
                            data={data}
                            theme={theme}/>
                    )}
                    {subscriptionsModal && (
                        <SubscribeModal
                            updateDataAfterSubscribe={updateDataAfterSubscribe}
                            updateDataAfterRemoveSubscribe={updateDataAfterRemoveSubscribe}
                            cancelModal={cancelSubscriptionsModal}
                            subscriptions={userByToken.subscriptions}
                            data={data}
                            theme={theme}/>
                    )}
                    <div className={s.upper_user_data}>
                        <p className={s.upper_user_data_name}>{userByToken.username}</p>
                        <button onClick={() => {setMenuModal(true)}} className={s.menu_btn}>
                            <img className={s.aside_icons} src={`/${theme}/menu-icon.svg`} alt="menu-icon" />
                        </button>
                    </div>
                    <div className={s.user_information}>
                        { previewUrl || userByToken.avaUrl ? (
                            <img onClick={() => {setModal(true)}} className={s.profile_img} src={previewUrl || userByToken.avaUrl} alt="ava icon" />
                        ) : (
                            <img onClick={() => {setModal(true)}} className={s.profile_img} src={`/${theme}/ava-icon.svg`} alt="ava icon" />
                        )}
                        <div className={s.user_data_wrapper}>
                            <div className={s.user_data_upper_line}>
                                <p className={s.user_data_name}>{userByToken.username}</p>
                                {userByToken._id === localStorage.getItem('id') ? (
                                    <>
                                        <button className={s.edit_btn}>Edit</button>
                                        <button className={s.check_archiv_btn}>Check Archiv</button>
                                        <button className={s.setting_btn}>Setting</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={isSigned ? removeSubscribe : subscribe} className={isSigned ? s.signed_btn : s.subscribe_btn}>
                                            {isSigned ? 'Signed' : 'Subscribe'}
                                        </button>
                                        <img src={`/${theme}/additionally-function.svg`} alt="additionally function" />
                                    </>
                                )}
                            </div>
                            <div className={s.user_data_under_line}>
                                {userByToken && userByToken.posts && userByToken.posts.length > 0 ? (
                                    <p className={s.posts_amount}>{userByToken.posts.length} Posts</p>
                                ) : (
                                    <p className={s.posts_amount}>No Posts</p>
                                )}
                                <p onClick={() => {setSubscribersModal(true)}} className={s.subscribers_amount}>{subscribers.length} Subscribers</p>
                                <p onClick={() => {setSubscriptionsModal(true)}} className={s.subscriptions_amount}>{subscriptions.length} Subscriptions</p>
                            </div>
                        </div>
                    </div>
                    <div className={s.story_wrapper}></div>
                    <div className={s.posts_wrapper}>
                        <div className={s.choose_posts_wrapper}>
                            <p
                                className={`${s.choose_posts_btn} ${activeTab === "posts" ? s.active : ""}`}
                                onClick={() => handleTabClick("posts")}
                            >
                                Posts
                            </p>
                            {token === localStorage.getItem('id') && (
                                <p
                                    className={`${s.choose_posts_btn} ${activeTab === "favorites" ? s.active : ""}`}
                                    onClick={() => handleTabClick("favorites")}
                                >
                                    Favorites
                                </p>
                            )}
                        </div>
                        <div className={s.posts_container}>
                        {token === localStorage.getItem('id') ? (
                            activeTab === "posts" ? (
                                userByToken && userByToken.posts && userByToken.posts.length > 0 ? (
                                    userByToken.posts.sort((a, b) => b.time - a.time).map((post, index) => (
                                        <UserPost
                                            key={index}
                                            id={index}
                                            deletePost={deletePost}
                                            data={data}
                                            post={post}
                                            user={user}
                                            updatePostAfterComment={updatePostAfterComment}
                                            updatePostComment={updatePostComment}
                                            updateLikesInPost={updateLikesInPost}
                                            updateUserAfterFavorite={updateUserAfterFavorite}
                                            updateUserAfterRemoveFavorite={updateUserAfterRemoveFavorite}
                                            theme={theme}
                                            token={token}
                                        />
                                    ))
                                ) : (
                                    <p>No posts available.</p>
                                )
                            ) : (
                                favorite && favorite.length > 0 ? (
                                    favorite.sort((a, b) => b.time - a.time).map((post, index) => (
                                        <UserPost
                                            key={index}
                                            id={index}
                                            deletePost={deletePost}
                                            data={data}
                                            post={post}
                                            user={user}
                                            updatePostAfterComment={updatePostAfterComment}
                                            updatePostComment={updatePostComment}
                                            updateLikesInPost={updateLikesInPost}
                                            updateUserAfterFavorite={updateUserAfterFavorite}
                                            updateUserAfterRemoveFavorite={updateUserAfterRemoveFavorite}
                                            theme={theme}
                                            token={token}
                                        />
                                    ))
                                ) : (
                                    <p>No favorite posts available.</p>
                                )
                            )
                        ) : (
                            userByToken && userByToken.posts && userByToken.posts.length > 0 ? (
                                userByToken.posts.sort((a, b) => b.time - a.time).map((post, index) => (
                                    <UserPost
                                        key={index}
                                        id={index}
                                        deletePost={deletePost}
                                        data={data}
                                        post={post}
                                        user={userByToken}
                                        updatePostAfterComment={updatePostAfterComment}
                                        updatePostComment={updatePostComment}
                                        updateLikesInPost={updateLikesInPost}
                                        updateUserAfterFavorite={updateUserAfterFavorite}
                                        updateUserAfterRemoveFavorite={updateUserAfterRemoveFavorite}
                                        theme={theme}
                                        token={token}
                                    />
                                ))
                            ) : (
                                <p>No posts available.</p>
                            )
                        )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
