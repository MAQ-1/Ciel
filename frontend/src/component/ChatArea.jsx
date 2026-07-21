import React from 'react'
import Nav from './Nav'
import Messagelist from './Messagelist'
import Chatinput from './Chatinput'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import getMessages from '../features/getMessages'
import { useDispatch } from 'react-redux'
import { setMessages } from '../redux/messageSlice'
import { setArtifacts } from '../redux/messageSlice'



function ChatArea() {
  const { selectedConversation } = useSelector((state) => state.conversation)
  const dispatch = useDispatch()

  useEffect(() => {
    const getMsg = async () => {

      if (selectedConversation) {

        if (selectedConversation.title == "New Chat") {
          // Do something
          return;
        }
        const data = await getMessages(selectedConversation._id);
        dispatch(setMessages(data.messages));


        // artifacts ko bhi set karna hoga
        const latestArtifact = [...data.messages]
          .reverse()
          .find(msg => msg.artifacts?.length > 0);

        dispatch(setArtifacts(latestArtifact?.artifacts || []));
      }
    };

    getMsg();
  }, [selectedConversation?._id]);




  return (
    <div className='flex-1 min-w-0 flex flex-col'>

      <Nav />
      <Messagelist />
      <Chatinput />
    </div>
  )
}

export default ChatArea