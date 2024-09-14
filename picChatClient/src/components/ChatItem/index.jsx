export default function ChatItem () {
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