import React from 'react'
import MessageInput from './MessageInput.jsx'
import Nav from './Nav'
import ChatInput from './ChatInput'
import { useDispatch, useSelector } from 'react-redux'
import getMessages from '../features/getMessages.js'
import { setMessages } from '../redux/messageSlice.js'
import { useEffect } from 'react'

const ChatArea = () => {
    const { selectedConversation } = useSelector(state => state.conversation);
    const dispatch = useDispatch();
    useEffect(() => {
        
        const getMsg = async () => {
            if (selectedConversation) {
                const  data  = await getMessages(selectedConversation?._id);
                dispatch(setMessages(data))
            }
        }
        getMsg()
    }, [selectedConversation]);
    return (
        <div className='flex-1 flex flex-col'>
            <Nav/>
            <MessageInput />
            <ChatInput/>
        </div>
    )
}

export default ChatArea
