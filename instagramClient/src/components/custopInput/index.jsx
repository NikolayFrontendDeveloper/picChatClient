import s from './CustomInput.module.scss'
import { useField } from 'formik';
import { PatternFormat } from 'react-number-format';

const CustomInput = ({ label, format, ...props }) => {
    const [field, meta] = useField(props);

    return (
        <div className={s.form__group}>
            {format ? (
                <PatternFormat
                    {...field}
                    {...props}
                    className={s.form__field}
                    onBlur={field.onBlur}
                    format={format}
                />
            ) : (
                <input {...field} {...props} className={s.form__field} />
            )}
            <label className={s.form__label} htmlFor={props.id || props.name}>{label}</label>
            {meta.touched && meta.error ? (
                <div style={{ color: 'red' }}>{meta.error}</div>
            ) : null}
        </div>
    );
};

export default CustomInput;
