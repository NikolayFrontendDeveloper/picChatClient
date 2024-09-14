import s from './styles.module.scss';
import { useEffect, useState, useRef  } from 'react';
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';

export default function MessengerPage ({ user, data, layoutWidth, messages, theme, socket}) {
    const [inputText, setInputText] = useState('');
    const { chatId } = useParams();
    const [chatData, setChatData] = useState(null);
    const [userByToken, setUserByToken] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (chatId) {
                const varChatData = messages.find(mes => mes._id === chatId);
                if (varChatData) {
                    setChatData(varChatData);
                    const userToken = varChatData.members.filter(token => token !== localStorage.getItem('id'))[0];
                    if (userToken) {
                        const userData = data.find(user => user._id === userToken);
                        setUserByToken(userData);
                    }
                }
            }
        };
        
        fetchData();
        joinRoom();
    }, [chatId, messages, data]);

    useEffect(() => {
        console.log(chatData)
    }, [chatData])

    useEffect(() => {
        const handleReceiveMessage = (data) => {
            setChatData((prevChatData) => {
                console.log("Previous chatData:", prevChatData);
                const updatedChatData = {
                    ...prevChatData,
                    messages: [...(prevChatData.messages || []), data]
                };
                console.log("Updated chatData:", updatedChatData);
                return updatedChatData;
            });
        };
    
        socket.on("receive_message", handleReceiveMessage);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [socket]);

    const joinRoom = () => {
        if (chatId) {
            console.log(`Joining room ${chatId}`);
            socket.emit("join_room", chatId, (response) => {
                console.log("Join room response:", response);
            });
        }
    };

    const sendMessage = async () => {
        if (inputText) {
            const messageDataForSocket = {
                "roomId": chatId,
                "sender": localStorage.getItem('id'),
                "text": inputText,
                "time": Date.now()
            }
            
            await socket.emit("send_message", messageDataForSocket);

            const messageData = {
                "sender": localStorage.getItem('id'),
                "text": inputText,
                "time": Date.now()
            }

            setChatData((prevChatData) => {
                console.log("Previous chatData:", prevChatData);
                const updatedChatData = {
                    ...prevChatData,
                    messages: [...(prevChatData.messages || []), messageData]
                };
                console.log("Updated chatData:", updatedChatData);
                return updatedChatData;
            });

            const payload = {
                "roomId": chatId,
                "token": localStorage.getItem('id'),
                "text": inputText
            }

            fetch("https://linstagramserver-1.onrender.com/messages/add-message", {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json",
                },
                })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                });

            setInputText('');
        }
    }

    return (
        chatData && (
            <div className={s.container} style={{ paddingLeft: layoutWidth }}>
                <header className={s.messenger_header} style={{ paddingLeft: layoutWidth/2, paddingRight: layoutWidth/2 }}>
                    <div className={s.user_data_container}>
                        <img className={s.user_ava} src={userByToken?.avaUrl ? (userByToken?.avaUrl) : (`/${theme}/ava-icon.svg`)} alt='user ava' />
                        <p className={s.user_name}>{userByToken?.username}</p>
                    </div>
                </header>
                <main className={s.messenger_main} style={{ paddingLeft: layoutWidth, paddingTop: '77px', paddingBottom: '71px' }}>
                    <div className={s.message_wrapper}>
                        {chatData && chatData.messages && 
                            chatData.messages.map((message, index) => (
                                <Message
                                    key={index}
                                    message={message}
                                    userByToken={userByToken}
                                    theme={theme}
                                />
                            ))
                        }
                    </div>
                </main>
                <footer className={s.messenger_footer} style={{ paddingLeft: layoutWidth/2, paddingRight: layoutWidth/2  }}>
                    <div className={s.footer_left_wrapper}>
                        <input onChange={(e) => {setInputText(e.target.value)}} value={inputText} className={s.messenger_input} type="text" placeholder='Write something...' />
                    </div>
                    <div className={s.footer_right_wrapper}>
                        {inputText && (
                            <button onClick={sendMessage} className={s.btn_submit}>Submit</button>
                        )}
                    </div>
                </footer>
            </div>
        )
    )
}