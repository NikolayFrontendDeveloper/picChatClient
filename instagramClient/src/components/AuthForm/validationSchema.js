import * as Yup from 'yup';

export const signupSchema = Yup.object({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});