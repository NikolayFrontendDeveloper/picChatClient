import s from './form.module.scss'
import CustomInput from '../custopInput/index';
import { signupSchema  } from './validationSchema';
import { Formik, Form } from 'formik';

export default function SigninForm({submitHandler, text}) {
    const initialValues = {
        username: '',
        password: ''
    };

    return (
        <div className={s.container}>
            <Formik
                initialValues={initialValues}
                onSubmit={submitHandler}
                validationSchema={signupSchema}
            >
                <Form>
                    <CustomInput
                        label="Username"
                        name="username"
                        placeholder="Enter your login"
                    />
                    <CustomInput
                        label="Password"
                        name="password"
                        placeholder="Enter your password"
                    />
                    <button className="purple_button" type="submit">{text}</button>
                </Form>
            </Formik>
        </div>
    );
}