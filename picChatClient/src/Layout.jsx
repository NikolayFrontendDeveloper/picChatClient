import { Outlet, NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import s from "./styles.module.scss";
import SearchedUser from "./components/SearchedUser";
import MenuModal from "./components/MenuModal";

export default function Layout({ id, logOut, user, data, changeTheme, theme, setLayoutWidth }) {
    const [isSearchingModal, setIsSearchingModal] = useState(false);
    const [isMessagesModal, setIsMessagesModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [searchInputValue, setSearchInputValue] = useState('');
    const [menuModal, setMenuModal] = useState(false);
    const layoutRef = useRef(null);

    useEffect(() => {
        if (layoutRef.current) {
            setLayoutWidth(layoutRef.current.offsetWidth);
        }
    }, [layoutRef, isSearchingModal])

    useEffect(() => {
        if (searchInputValue !== '') {
            const filteredUsers = data.filter(user =>
                user.username.toLowerCase().includes(searchInputValue)
            );
            setUsers(filteredUsers);
        }
    }, [searchInputValue, data]);

    const cancelMenuModal = () => {
        setMenuModal(false);
    };

    const openMessagesModal = () => {
        setIsMessagesModal(true);
        setIsSearchingModal(true);
    }

    const cancelMessagesModal = () => {
        setIsMessagesModal(false);
    }

    const handleSearchingInput = (e) => {
        setSearchInputValue(e.target.value.toLowerCase());
    };

    const changeSearchingModal = () => {
        if (isSearchingModal) {
            setIsSearchingModal(false);
            setSearchInputValue('');
            setUsers([]);
        } else {
            setIsSearchingModal(true);
        }
    };

    const logOutFunc = () => {
        logOut();
        changeSearchingModal();
    };

    return (
        <>
            <aside ref={layoutRef} className={s.aside_container}>
                {!id ? (
                    <div className={s.aside_box}>
                        <NavLink to={"/login"}>
                            <img className={s.aside_icons} src={`/${theme}/login-icon.svg`} alt="login-icon" />
                            <p>Log In</p>
                        </NavLink>
                        <NavLink to={"/signup"}>
                            <img className={s.aside_icons} src={`/${theme}/signup-icon.svg`} alt="signup-icon" />
                            <p>Sign Up</p>
                        </NavLink>
                    </div>
                ) : (
                    <>
                        {menuModal && (
                            <MenuModal
                                changeTheme={changeTheme}
                                cancelMenuModal={cancelMenuModal}
                                theme={theme}
                            />
                        )}
                        {!isSearchingModal ? (
                            <>
                                <div className={s.aside_box}>
                                    <NavLink onClick={cancelMessagesModal} to={"/"}>
                                        <p className={s.page_name}>PicChat</p>
                                    </NavLink>
                                    <NavLink onClick={cancelMessagesModal} to={"/"}>
                                        <img className={s.aside_icons} src={`/${theme}/home-icon.svg`} alt="home-icon" />
                                        <p className={s.aside_left_box_title}>Main</p>
                                    </NavLink>
                                    <NavLink onClick={changeSearchingModal}>
                                        <img className={s.aside_icons} src={`/${theme}/searching-icon.svg`} alt="search-icon" />
                                        <p className={s.aside_left_box_title}>Search</p>
                                    </NavLink>
                                    <NavLink onClick={cancelMessagesModal} to={"/add"}>
                                        <img className={s.aside_icons} src={`/${theme}/add-icon.svg`} alt="add-icon" />
                                        <p className={s.aside_left_box_title}>Add</p>
                                    </NavLink>
                                    <NavLink onClick={openMessagesModal} to={'/messages'}>
                                        <img className={s.aside_icons} src={`/${theme}/messages-icon.svg`} alt="add-icon" />
                                        <p className={s.aside_left_box_title}>Messages</p>
                                    </NavLink>
                                    <NavLink onClick={cancelMessagesModal} to={`/profile/${localStorage.getItem('id')}`}>
                                        {user && user.avaUrl ? (
                                            <img className={s.user_ava} src={user.avaUrl} alt="profile-icon" />
                                        ) : (
                                            <img className={s.user_ava} src={`/${theme}/ava-icon.svg`} alt="default-avatar" />
                                        )}
                                        <p className={s.aside_left_box_title}>Profile</p>
                                    </NavLink>
                                </div>
                                <div className={s.aside_box_lower}>
                                    <button onClick={() => setMenuModal(true)} className={s.menu_btn}>
                                        <img className={s.aside_icons} src={`/${theme}/menu-icon.svg`} alt="menu-icon" />
                                        <p>More</p>
                                    </button>
                                    <button className={s.logout_btn} onClick={logOutFunc}>
                                        <img className={s.aside_icons} src="/logout-icon.svg" alt="logout-icon" />
                                        <p>Log out</p>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className={s.aside_main_wrapper}>
                                <div className={s.aside_left_wrapper}>
                                    <div className={s.aside_box}>
                                        <NavLink onClick={cancelMessagesModal} to={"/"}>
                                            <p onClick={changeSearchingModal} className={s.page_name}>P</p>
                                        </NavLink>
                                        <NavLink onClick={cancelMessagesModal} to={"/"}>
                                            <img onClick={changeSearchingModal} className={s.aside_icons} src={`/${theme}/home-icon.svg`} alt="home-icon" />
                                        </NavLink>
                                        <NavLink>
                                            <img onClick={changeSearchingModal} className={s.aside_icons} src={`/${theme}/searching-icon.svg`} alt="search-icon" />
                                        </NavLink>
                                        <NavLink onClick={cancelMessagesModal} to={"/add"}>
                                            <img onClick={changeSearchingModal} className={s.aside_icons} src={`/${theme}/add-icon.svg`} alt="add-icon" />
                                        </NavLink>
                                        <NavLink onClick={openMessagesModal}>
                                            <img className={s.aside_icons} src={`/${theme}/messages-icon.svg`} alt="add-icon" />
                                        </NavLink>
                                        <NavLink onClick={() => {changeSearchingModal(); cancelMessagesModal()}} to={`/profile/${localStorage.getItem('id')}`}>
                                            {user && user.avaUrl ? (
                                                <img className={s.user_ava} src={user.avaUrl} alt="profile-icon" />
                                            ) : (
                                                <img className={s.user_ava} src={`/${theme}/ava-icon.svg`} alt="default-avatar" />
                                            )}
                                        </NavLink>
                                    </div>
                                    <div className={s.aside_box_lower}>
                                        <button onClick={() => setMenuModal(true)} className={s.menu_btn}>
                                            <img className={s.aside_icons} src={`/${theme}/menu-icon.svg`} alt="menu-icon" />
                                        </button>
                                        <button className={s.logout_btn} onClick={logOutFunc}>
                                            <img className={s.aside_icons} src="/logout-icon.svg" alt="logout-icon" />
                                        </button>
                                    </div>
                                </div>
                                {!isMessagesModal ? (
                                    <div className={s.aside_right_wrapper}>
                                        <div className={s.aside_upper_box}>
                                            <p className={s.aside_upper_box_title}>Searching request</p>
                                            <input
                                                onChange={handleSearchingInput}
                                                className={s.aside_upper_box_searching_input}
                                                type="text"
                                                placeholder="Search"
                                            />
                                        </div>
                                        <div className={s.aside_lower_box}>
                                            {users.length > 0 ? (
                                                users.map((user, index) => (
                                                    <SearchedUser
                                                        onClick={changeSearchingModal}
                                                        user={user}
                                                        key={index}
                                                        theme={theme}
                                                    />
                                                ))
                                            ) : (
                                                <p>No requests</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className={s.aside_right_wrapper}>
                                        <div className={s.aside_upper_box}>
                                            <p className={s.aside_upper_box_title}>Searching request</p>
                                            <input
                                                onChange={handleSearchingInput}
                                                className={s.aside_upper_box_searching_input}
                                                type="text"
                                                placeholder="Search"
                                            />
                                        </div>
                                        <div className={s.aside_lower_box}>
                                            {users.length > 0 ? (
                                                users.map((user, index) => (
                                                    <SearchedUser
                                                        onClick={changeSearchingModal}
                                                        user={user}
                                                        key={index}
                                                        theme={theme}
                                                    />
                                                ))
                                            ) : (
                                                <p>No requests</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </aside>
            <Outlet />
        </>
    );
}
