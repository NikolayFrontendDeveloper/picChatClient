import s from "./styles.module.scss";

export default function ModalWrapper({children, cancelModal}) {
    return (
        <div className={s.container}>
            <div className={s.modal_body}>{children}</div>
            <div onClick={cancelModal} className={s.modal_wrapper}></div>
        </div>
    )
}