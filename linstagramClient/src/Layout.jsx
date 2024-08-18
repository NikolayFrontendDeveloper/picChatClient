import { Outlet, NavLink } from "react-router-dom"
import { useEffect, useState } from "react"
import s from "./styles.module.scss"
import SearchedUser from "./components/SearchedUser";

export default function Layout({id, logOut, user, data}) {
    const [isSearchingModal, setIsSearchingModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [searchInputValue, setSearchInputValue] = useState('')

    const handleSearchingInput = (e) => {
        setSearchInputValue(e.target.value.toLowerCase());
    }

    const changeSearchingModal = () => {
        if (isSearchingModal) {
            setIsSearchingModal(false);
            setSearchInputValue('');
            setUsers([]);
        } else setIsSearchingModal(true);
    }

    useEffect(() => {
        if (searchInputValue !== '') {
            const users = data.filter(user => user.username.toLowerCase().includes(searchInputValue));
            setUsers(users);
        }
    }, [searchInputValue])

    const logOutFunc = () => {
        logOut();
        changeSearchingModal();
    }
    return (
        <>
            <aside className={s.aside_container}>
                {!id ? (
                    <>
                        <div className={s.aside_box}>
                            <NavLink to={"/login"}>
                                <img className={s.aside_icons} src="/login-icon.svg" alt="home-icon" />
                                <p>Log In</p>
                            </NavLink>
                            <NavLink to={"/signup"}>
                                <img className={s.aside_icons} src="/signup-icon.svg" alt="home-icon" />
                                <p>Sign Up</p>
                            </NavLink>
                        </div>
                    </>
                ) : (
                    <>
                        {!isSearchingModal ? (
                            <>
                                <div className={s.aside_box}>
                                    <NavLink to={"/"}>
                                        <p className={s.page_name}>PicChat</p>
                                    </NavLink>
                                    <NavLink to={"/"}>
                                        <img className={s.aside_icons} src="/home-icon.svg" alt="home-icon" />
                                        <p>Main</p>
                                    </NavLink>
                                    <NavLink onClick={changeSearchingModal}>
                                        <img className={s.aside_icons} src="/searching-icon.svg" alt="home-icon" />
                                        <p>Search</p>
                                    </NavLink>
                                    <NavLink to={"/add"}>
                                        <img className={s.aside_icons} src="/add-icon.svg" alt="home-icon" />
                                        <p>Add</p>
                                    </NavLink>
                                    <NavLink to={`/profile/${localStorage.getItem('id')}`}>
                                        {user && user.avaUrl ? (
                                            <img className={s.user_ava} src={user.avaUrl} alt="ava icon" />
                                        ) : (
                                            <img className={s.user_ava} src="/ava-icon.svg" alt="ava icon" />
                                        )}
                                        <p>Profile</p>
                                    </NavLink>
                                </div>
                                <button className={s.logout_btn} onClick={logOut}>
                                    <img className={s.aside_icons} src="/logout-icon.svg" alt="ava icon" />
                                    Log out
                                </button>
                            </>
                        ) : (
                            <div className={s.aside_main_wrapper}>
                                <div className={s.aside_left_wrapper}>
                                    <div className={s.aside_box}>
                                        <NavLink to={"/"}>
                                            <p onClick={changeSearchingModal} className={s.page_name}>L</p>
                                        </NavLink>
                                        <NavLink to={"/"}>
                                            <img onClick={changeSearchingModal} className={s.aside_icons} src="/home-icon.svg" alt="home-icon" />
                                        </NavLink>
                                        <NavLink>
                                            <img onClick={changeSearchingModal} className={s.aside_icons} src="/searching-icon.svg" alt="home-icon" />
                                        </NavLink>
                                        <NavLink to={"/add"}>
                                            <img onClick={changeSearchingModal} className={s.aside_icons} src="/add-icon.svg" alt="home-icon" />
                                        </NavLink>
                                        <NavLink onClick={changeSearchingModal} to={`/profile/${localStorage.getItem('id')}`}>
                                            {user && user.avaUrl ? (
                                                <img className={s.user_ava} src={user.avaUrl} alt="ava icon" />
                                            ) : (
                                                <img className={s.user_ava} src="/ava-icon.svg" alt="ava icon" />
                                            )}
                                        </NavLink>
                                    </div>
                                    <button className={s.logout_btn} onClick={logOutFunc}>
                                        <img className={s.aside_icons} src="/logout-icon.svg" alt="ava icon" />
                                    </button>
                                </div>
                                <div className={s.aside_right_wrapper}>
                                    <div className={s.aside_upper_box}>
                                        <p className={s.aside_upper_box_title}>Searching request</p>
                                        <input onChange={handleSearchingInput} className={s.aside_upper_box_searching_input} type="text" placeholder="Search"/>
                                    </div>
                                    <div className={s.aside_lower_box}>
                                        {Array.isArray(users) && users.length > 0 ? (
                                            users.map((user, index) => (
                                                <SearchedUser
                                                onClick={changeSearchingModal}
                                                user={user}
                                                key={index}/>
                                            ))
                                        ) : (
                                            <p>No requests</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </aside>
            <Outlet></Outlet>
        </>
    )
}