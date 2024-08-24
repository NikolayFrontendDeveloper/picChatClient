import SearchedUser from '../SearchedUser'
import ModalWrapper from '../ModalWrapper'
import s from './styles.module.scss'

export default function SubscribeModal ({ subscribers, subscriptions, cancelModal, data, updateDataAfterSubscribe, updateDataAfterRemoveSubscribe, theme }) {
    return (
        <ModalWrapper cancelModal={cancelModal}>
            {subscribers ? (
                <p className={s.title}>Subscribers</p>
            ) : (
                <p className={s.title}>Subscriptions</p>
            )}
            {subscribers && (
                data.map((user, index) => {
                    if (subscribers.includes(user._id)) {
                        return (
                            <SearchedUser
                                key={index}
                                user={user}
                                cancelModal={cancelModal}
                                updateDataAfterSubscribe={updateDataAfterSubscribe}
                                updateDataAfterRemoveSubscribe={updateDataAfterRemoveSubscribe}
                                theme={theme}
                            />
                        );
                    }
                })
            )}
            {subscriptions && (
                data.map((user, index) => {
                    if (subscriptions.includes(user._id)) {
                        return (
                            <SearchedUser
                                key={index}
                                user={user}
                                cancelModal={cancelModal}
                                updateDataAfterSubscribe={updateDataAfterSubscribe}
                                updateDataAfterRemoveSubscribe={updateDataAfterRemoveSubscribe}
                                theme={theme}
                            />
                        );
                    }
                })
            )}
        </ModalWrapper>
    );
}
