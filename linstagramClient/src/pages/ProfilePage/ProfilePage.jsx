import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import s from "./styles.module.scss";
import UserPost from '../../components/UserPost/index';
import AvaModal from "../../components/AvaModal";
import axios from 'axios';
import SubscribeModal from "../../components/SubscribeModal";

export default function ProfilePage({ updateDataAfterRemoveSubscribe, updateDataAfterSubscribe, deletePost, data, updatePostAfterComment, updatePostComment, updateLikesInPost, updateAva }) {
    const [modal, setModal] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const { token } = useParams();
    const [user, setUser] = useState(data.find(user => user._id === token) || null);
    const [currentUser, setCurrentUser] = useState(data.find(user => user._id === localStorage.getItem('id')) || null);
    const [isSigned, setIsSigned] = useState(currentUser?.subscriptions?.includes(token) || false);
    const [subscribers, setSubscribers] = useState(user.subscribers || []);
    const [subscriptions, setSubscriptions] = useState(user.subscriptions || []);
    const [subscribersModal, setSubscribersModal] = useState(false);
    const [subscriptionsModal, setSubscriptionsModal] = useState(false);

    useEffect(() => {
        setUser(data.find(user => user._id === token) || null);
        setSubscriptions(user.subscriptions || []);
        setSubscribers(user.subscribers || []);
        setIsSigned(currentUser?.subscriptions?.includes(token) || false);
        setCurrentUser(data.find(user => user._id === localStorage.getItem('id')) || null);
    }, [token, data])

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
        fetch("https://linstagramserver-1.onrender.com/add-ava", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
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

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <>
            {user && (
                <div className={s.page_wrapper}>
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
                            subscribers={user.subscribers}
                            data={data}/>
                    )}
                    {subscriptionsModal && (
                        <SubscribeModal
                            updateDataAfterSubscribe={updateDataAfterSubscribe}
                            updateDataAfterRemoveSubscribe={updateDataAfterRemoveSubscribe}
                            cancelModal={cancelSubscriptionsModal}
                            subscriptions={user.subscriptions}
                            data={data}/>
                    )}
                    <div className={s.user_information}>
                        { previewUrl || user.avaUrl ? (
                            <img onClick={() => {setModal(true)}} className={s.profile_img} src={previewUrl || user.avaUrl} alt="ava icon" />
                        ) : (
                            <img onClick={() => {setModal(true)}} className={s.profile_img} src="/ava-icon.svg" alt="ava icon" />
                        )}
                        <div className={s.user_data_wrapper}>
                            <div className={s.user_data_line}>
                                <p className={s.user_data_name}>{user.username}</p>
                                {user._id === localStorage.getItem('id') ? (
                                    <>
                                        <button className={s.edit_btn}>Edit</button>
                                        <button className={s.check_archiv_btn}>Check Archiv</button>
                                        <button className={s.setting_btn}>Setting</button>
                                    </>
                                ) : (
                                    <>
                                        {isSigned ? (
                                            <button onClick={removeSubscribe} className={s.signed_btn}>Signed</button>
                                        ) : (
                                            <button onClick={subscribe} className={s.subscribe_btn}>Subscribe</button>
                                        )}
                                        <img src="/additionally-function.svg" alt="additionally function" />
                                    </>
                                )}
                            </div>
                            <div className={s.user_data_line}>
                                {user && user.posts && user.posts.length > 0 ? (
                                    <p className={s.posts_amount}>{user.posts.length} Posts</p>
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
                            <p className={s.choose_posts_btn}>Posts</p>
                        </div>
                        <div className={s.posts_container}>
                            {user && user.posts && user.posts.length > 0 ? (
                                user.posts.sort((a, b) => b.time - a.time).map((post, index) => (
                                    <UserPost
                                        key={index}
                                        deletePost={deletePost}
                                        data={data}
                                        post={post}
                                        user={user}
                                        updatePostAfterComment={updatePostAfterComment}
                                        updatePostComment={updatePostComment}
                                        updateLikesInPost={updateLikesInPost}
                                    />
                                ))
                            ) : (
                                <p>No posts available.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
