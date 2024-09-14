import s from './styles.module.scss'

export default function Message ({ message, userByToken, theme }) {
    return (
        message.sender === localStorage.getItem('id') ? (
            <div className={s.message_right_wrapper}>
                <p className={s.message_text}>{message.text}</p>
            </div>
        ) : (
            <div className={s.message_left_wrapper}>
                <img className={s.sender_ava} src={userByToken?.avaUrl ? (userByToken?.avaUrl) : (`/${theme}/ava-icon.svg`)} alt='user ava' />
                <p className={s.message_text}>{message.text}</p>
            </div>
        )
    )
}