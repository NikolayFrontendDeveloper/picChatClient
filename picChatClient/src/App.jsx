import React, { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import SigninPage from "./pages/SigninPage";
import AddPage from "./pages/AddPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import UserPostsPage from "./pages/UserPostsPage";
import "./reset.css";
import "./styles.module.scss";
import './_variables.scss';

const App = () => {
    const navigate = useNavigate();
    const [id, setId] = useState(localStorage.getItem("id") || false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allPosts, setAllPosts] = useState([]);
    const [favorite, setFavorite] = useState([]);
    const [activeTab, setActiveTab] = useState("posts");

    useEffect(() => {
        getData();
        getUserData();
        fetchPosts();
        getAllPosts();
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        const fetchFavoritePosts = async () => {
            if (user?.favoritePosts) {
                const sortedFavoritePosts = [...user.favoritePosts].sort((a, b) => b.time - a.time);
                const favoritePosts = allPosts?.filter(post =>
                    sortedFavoritePosts.some(fav => fav.postToken === post.token && fav.imageUrl === post.imageUrl)
                );
                setFavorite(favoritePosts || []);
            } else {
                setFavorite([]);
            }
        };

        fetchFavoritePosts();

        console.log(user)
    }, [allPosts, user]);

    const changeTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };    

    const getData = () => {
        fetch("https://linstagramserver-1.onrender.com/data")
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

    const getAllPosts = async () => {
        try {
            const res = await fetch("https://linstagramserver-1.onrender.com/posts");
            const data = await res.json();
            setAllPosts(data);
            setLoading(false);
        } catch (e) {
            setLoading(false);
        }
    };

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
    
        setData(updatedData);
    };
    
    const getUserData = () => { 
        const payload = {
            token: localStorage.getItem('id')
        };

        fetch("https://linstagramserver-1.onrender.com/get-user", {
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

    const updateUserAfterFavorite = (newFavorite) => {
        setUser(prevUser => ({
            ...prevUser,
            favoritePosts: [...prevUser.favoritePosts, newFavorite]
        }));
    };

    const updateUserAfterRemoveFavorite = (postToRemove) => {
        setUser(prevUser => ({
            ...prevUser,
            favoritePosts: prevUser.favoritePosts.filter(fav => 
                !(fav.postToken === postToRemove.token && fav.imageUrl === postToRemove.imageUrl)
            )
        }));
    };

    const fetchPosts = () => {
        const payload = {
            token: localStorage.getItem('id')
        };

        fetch("https://linstagramserver-1.onrender.com/get-posts", {
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

        fetch("https://linstagramserver-1.onrender.com/auth/login", {
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
            }
        });    
    };

    const signinHandler = (values) => {
        const payload = {
        username: values.username,
        password: values.password,
        };

        fetch("https://linstagramserver-1.onrender.com/auth/signup", {
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
        });
    };

    const uploadPost = (payload) => {
        fetch("https://linstagramserver-1.onrender.com/posts", {
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

    const deletePost = ({ token, imageUrl}) => {
        const payload = {
            token: token,
            imageUrl: imageUrl
        }

        function extractPublicId(url) {
            const parts = url.split('/');
            const publicIdWithExtension = parts[parts.length - 1];
            const publicId = publicIdWithExtension.split('.')[0];
            return publicId;
        }

        fetch("https://linstagramserver-1.onrender.com/delete-post", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
            });
        fetch("https://linstagramserver-1.onrender.com/delete-image", {
            method: "POST",
            body: JSON.stringify({
                "publicId": extractPublicId(imageUrl),
                "typeFile": "image"
            }),
            headers: {
                "Content-Type": "application/json",
            },
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                window.location.reload();
            });
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

    const test = () => {
        console.log("Ok")
    }

    if (loading) {
        return <div>Loading...</div>;
    } else {
        return (
            <Routes>
                <Route path="/" element={<Layout id={id} logOut={logOut} user={user} data={data} changeTheme={changeTheme} theme={theme} />}>
                    <Route index element={<MainPage
                        updateDataAfterSubscribe={updateDataAfterSubscribe}
                        updateDataAfterRemoveSubscribe={updateDataAfterRemoveSubscribe}
                        user={user}
                        posts={posts}
                        data={data}
                        updatePostAfterComment={updatePostAfterComment}
                        updatePostComment={updatePostComment}
                        updateLikesInPost={updateLikesInPost}
                        deletePost={deletePost}
                        theme={theme}
                        getUserData={getUserData}/>}
                        />
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
                        deletePost={deletePost}
                        theme={theme}
                        changeTheme={changeTheme}
                        logOut={logOut}
                        updateUserAfterFavorite={updateUserAfterFavorite}
                        updateUserAfterRemoveFavorite={updateUserAfterRemoveFavorite}
                        allPosts={allPosts}
                        favorite={favorite}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        />}
                    />
                    <Route
                    path="/user-posts/:token/:id"
                    element={<UserPostsPage 
                        posts={posts}
                        updateDataAfterRemoveSubscribe={updateDataAfterRemoveSubscribe}
                        updateDataAfterSubscribe={updateDataAfterSubscribe}
                        data={data}
                        user={user}
                        updatePostAfterComment={updatePostAfterComment}
                        updatePostComment={updatePostComment}
                        updateLikesInPost={updateLikesInPost}
                        updateAva={updateAva}
                        deletePost={deletePost}
                        theme={theme}
                        changeTheme={changeTheme}
                        logOut={logOut}
                        favorite={favorite}
                        getUserData={getUserData}
                        activeTab={activeTab}
                        />}
                    />
                </Route>
            </Routes>
        );
    }
};

export default App;
