import React from 'react'
import Nav from './Nav'
import Messagelist from './Messagelist'
import Chatinput from './Chatinput'






function ChatArea() {
  return (
    <div className='flex-1 flex flex-col'>
         
         <Nav/>
         <Messagelist/>
         <Chatinput/>
    </div>
  )
}

export default ChatArea