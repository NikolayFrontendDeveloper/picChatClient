import { useState } from "react";
import s from "./styles.module.scss";
import ModalWrapper from "../../components/ModalWrapper";
import SearchedUser from "../../components/SearchedUser";

export default function ChatsPage ({ user, data, theme, messages, updateUserAfterAddingPersonalChat, updateMessagesAfterAddingPersonalChat }) {
    const [isModal, setIsModal] = useState(false);

    const cancelModal = () => {
        setIsModal(false);
    }

    return (
        <div className={s.container}>
            {isModal && (
                <ModalWrapper cancelModal={cancelModal}>
                    {user && user.subscriptions && (
                        data?.map((targetUser, index) => {
                            if (targetUser.subscriptions?.includes(localStorage.getItem('id'))) {
                                return (
                                    <SearchedUser
                                        key={index}
                                        user={targetUser}
                                        cancelModal={cancelModal}
                                        theme={theme}
                                        currentUser={user}
                                        isChatComponent={true}
                                        messages={messages}
                                        updateUserAfterAddingPersonalChat={updateUserAfterAddingPersonalChat}
                                        updateMessagesAfterAddingPersonalChat={updateMessagesAfterAddingPersonalChat}
                                    />
                                );
                            }
                        })
                    )}
                </ModalWrapper>
            )}
            <p onClick={() => {setIsModal(true)}} className={s.correspondence_btn}>Create new correspondence</p>
        </div>
    )
}