import AuthForm from '../components/AuthForm'
import s from "./styles.module.scss"

export default function SigninPage({ signinHandler }) {
    return (
        <div className={s.container}>
            <h1>Sign Up Page</h1>
            <AuthForm submitHandler={signinHandler} text="Sign Up"></AuthForm>
        </div>
    )
}