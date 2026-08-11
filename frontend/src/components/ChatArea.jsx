import React from 'react'
import MessageList from './MessageList.jsx'
import Nav from './Nav'
import ChatInput from './ChatInput'
import { useDispatch, useSelector } from 'react-redux'
import getMessages from '../features/getMessages.js'
import { setArtifacts, setMessages } from '../redux/messageSlice.js'
import { useEffect } from 'react'

const ChatArea = () => {
    const { selectedConversation } = useSelector(state => state.conversation);
    const dispatch = useDispatch();
    useEffect(() => {
        const getMsg = async () => {
            if (!selectedConversation) {
                dispatch(setMessages([]));
                dispatch(setArtifacts([]));
                return;
            }

            if (selectedConversation.title === "New Chat") {
                dispatch(setMessages([]));
                dispatch(setArtifacts([]));
                return;
            }

            const data = await getMessages(selectedConversation._id);

            dispatch(setMessages(data));

            const latestMessage = [...data]
                .reverse()
                .find(msg => msg.artifacts && msg.artifacts.length > 0);

            dispatch(setArtifacts(latestMessage?.artifacts || []));
        };

        getMsg();
    }, [selectedConversation?._id]);
    return (
        <div className='flex-1 flex flex-col min-w-0'>
            <Nav/>
            <MessageList />
            <ChatInput/>
        </div>
    )
}

export default ChatArea
