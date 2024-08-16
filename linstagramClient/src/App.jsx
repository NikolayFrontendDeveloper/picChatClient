import React, { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import SigninPage from "./pages/SigninPage";
import AddPage from "./pages/AddPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import "./reset.css"
import "./styles.module.scss"

const App = () => {
    const [id, setId] = useState(localStorage.getItem("id") || false);
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getData();
        getUserData();
        fetchPosts();
    }, []);

    const getData = () => {
        fetch("https://linstagram-mu.vercel.app/data")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
            })
            .then(() => {
                setLoading(false);
            })
            .catch(e => {
                setLoading(false);
            });
    }

    const updateDataAfterSubscribe = (token, targetToken) => {
        const updatedData = data.map(user => {
            if (user._id === token) {
                return {
                    ...user,
                    subscriptions: [...(user.subscriptions || []), targetToken]
                }
            }
            
            if (user._id === targetToken) {
                return {
                    ...user,
                    subscribers: [...(user.subscribers || []), token]
                }
            }

            return user;
        });
        setData(updatedData);
    }

    const updateDataAfterRemoveSubscribe = (token, targetToken) => {
        const updatedData = data.map(user => {
            if (user._id === token) {
                return {
                    ...user,
                    subscriptions: user.subscriptions.filter(subscriptionToken => subscriptionToken !== targetToken)
                };
            }

            if (user._id === targetToken) {
                return {
                    ...user,
                    subscribers: user.subscribers.filter(subscribersToken => subscribersToken !== token)
                };
            }

            return user;
        });
    
        console.log(updatedData);
        setData(updatedData);
    };
    
    const getUserData = () => { 
        const payload = {
            token: localStorage.getItem('id')
        };

        fetch("https://linstagram-mu.vercel.app/get-user", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => {
            setUser(data);
        })
        .catch();
    };

    const fetchPosts = () => {
        const payload = {
            token: localStorage.getItem('id')
        };

        fetch("https://linstagram-mu.vercel.app/get-posts", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => {
            setPosts(data);
        })
        .catch(error => console.error('Error fetching posts:', error));
    };

    const logOut = () => {
        localStorage.removeItem("id");
        setId(false);
        navigate("/login");
    };

    const loginHandler = (values) => {
        const payload = {
            username: values.username,
            password: values.password,
        };

        fetch("https://linstagram-mu.vercel.app/auth/login", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
            })
        .then((res) => res.json())
        .then((data) => {
            if (data.ok) {
                localStorage.setItem("id", data.id);
                setId(data.id);
                navigate("/");
                window.location.reload();
            }
            console.log(data);
        });    
    };

    const signinHandler = (values) => {
        const payload = {
        username: values.username,
        password: values.password,
        };

        fetch("https://linstagram-mu.vercel.app/auth/signup", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json",
        },
        })
        .then((res) => res.json())
        .then((data) => {
            localStorage.setItem("id", data.id);
            setId(data.id);
            navigate("/");
            window.location.reload();
            console.log(data);
        });
    };

    const uploadPost = (payload) => {
        fetch("https://linstagram-mu.vercel.app/posts", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
            })
            .then((res) => res.json())
            .then((data) => {
                navigate("/");
                console.log(data);
                window.location.reload();
            });
        console.log(payload);
    }

    const deletePost = (payload, cancelModal) => {
        fetch("https://linstagram-mu.vercel.app/delete-post", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
            })
            .then((res) => res.json())
            .then((data) => {
                cancelModal();
                console.log(data);
                window.location.reload();
            });
        console.log(payload);
    }

    const updateLikesInPost = (postUrl, likes) => {
        const updatedPosts = posts.map(post => {
            if (post.imageUrl === postUrl) {
                return {
                    ...post,
                    likes: likes
                };
            }
            return post;
        });
        setPosts(updatedPosts);
        if (user && user.posts) {
            const updatedPostsInUser = user.posts.map(post => {
                if (post.imageUrl === postUrl) {
                    return {
                        ...post,
                        likes: likes
                    };
                }
                return post;
            });
            setUser({
                ...user,
                posts: updatedPostsInUser
            });
        }
    }

    const updatePostAfterComment = (postUrl, newComment) => {
        const updatedPosts = posts.map(post => {
            if (post.imageUrl === postUrl) {
                return {
                    ...post,
                    comments: [...(post.comments || []), newComment]
                };
            }
            return post;
        });
        setPosts(updatedPosts);
        if (user && user.posts) {
            const updatedPostsInUser = user.posts.map(post => {
                if (post.imageUrl === postUrl) {
                    return {
                        ...post,
                        comments: [...(post.comments || []), newComment]
                    };
                }
                return post;
            });
            setUser({
                ...user,
                posts: updatedPostsInUser
            });
        }
    };

    const updatePostComment = (postUrl, newComments) => {
        const updatedPosts = posts.map(post => {
            if (post.imageUrl === postUrl) {
                return {
                    ...post,
                    comments: newComments
                };
            }
            return post;
        });
        setPosts(updatedPosts);
        if (user && user.posts) {
            const updatedPostsInUser = user.posts.map(post => {
                if (post.imageUrl === postUrl) {
                    return {
                        ...post,
                        comments: newComments
                    };
                }
                return post;
            });
            setUser({
                ...user,
                posts: updatedPostsInUser
            });
        }
    };

    const updateAva = (newAva) => {
        const updatedUser = {
            ...user,
            avaUrl: newAva
        };
        setUser(updatedUser);
        console.log(user);
    };

    
    if (loading) {
        return <div>Loading...</div>;
    } else {
        return (
            <Routes>
                <Route path="/" element={<Layout id={id} logOut={logOut} user={user} data={data}/>}>
                    <Route index element={<MainPage
                        updateDataAfterSubscribe={updateDataAfterSubscribe}
                        updateDataAfterRemoveSubscribe={updateDataAfterRemoveSubscribe}
                        user={user}
                        posts={posts}
                        data={data}
                        updatePostAfterComment={updatePostAfterComment}
                        updatePostComment={updatePostComment}
                        updateLikesInPost={updateLikesInPost}/>} />
                    <Route
                    path="login"
                    element={<LoginPage loginHandler={loginHandler} />}
                    />
                    <Route
                    path="signup"
                    element={<SigninPage signinHandler={signinHandler} />}
                    />
                    <Route
                    path="add"
                    element={<AddPage uploadPost={uploadPost} />}
                    />
                    <Route
                    path="profile/:token"
                    element={<ProfilePage 
                        updateDataAfterRemoveSubscribe={updateDataAfterRemoveSubscribe}
                        updateDataAfterSubscribe={updateDataAfterSubscribe}
                        data={data}
                        user={user}
                        updatePostAfterComment={updatePostAfterComment}
                        updatePostComment={updatePostComment}
                        updateLikesInPost={updateLikesInPost}
                        updateAva={updateAva}
                        deletePost={deletePost}/>}
                    />
                </Route>
            </Routes>
        );
    }
};

export default App;
