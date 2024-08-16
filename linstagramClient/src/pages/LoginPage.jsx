import AuthForm from '../components/AuthForm'
import s from "./styles.module.scss"

export default function LoginPage({ loginHandler }) {
    return (
        <div className={s.container}>
            <h1>Login Page</h1>
            <AuthForm submitHandler={loginHandler} text="Login"></AuthForm>
        </div>
    )
}