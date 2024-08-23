import s from "./styles.module.scss";
import "./switcher.scss";
import ModalWrapper from "../ModalWrapper";

export default function MenuModal({ changeTheme, cancelMenuModal, theme }) {
    return (
        <ModalWrapper cancelModal={cancelMenuModal}>
            <p>More:</p>
            <div className={s.main_container_item}>
                <img className={s.dark_mode_img} src={`/${theme}/dark-icon.svg`} alt="dark mode icon" />
                <p>Dark Mode</p>
                <label className="switch">
                    <input 
                        type="checkbox" 
                        onChange={changeTheme} 
                        checked={theme === 'dark'}
                    />
                    <span className="slider">
                        <svg className="slider-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation">
                            <path fill="none" d="m4 16.5 8 8 16-16"></path>
                        </svg> 
                    </span>
                </label>
            </div>
        </ModalWrapper>
    );
}
