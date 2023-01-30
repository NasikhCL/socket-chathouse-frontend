import React,{useState, useEffect} from 'react';
import {nanoid} from 'nanoid'
import { io } from "socket.io-client";
import './App.css';
import ScrollToBottom from "react-scroll-to-bottom";


// no env=


const userName = prompt("Please enter your name");
const socket = io.connect("https://chathouse-backend.onrender.com");
// const userName = nanoid(4)
function App() {
  // const [userName, setUserName] = useState('')

  const [message, setMessage] = useState('')
  const [chat, setChat] = useState([])
  const sendMsg = async(e)=>{
    e.preventDefault();
    let date =  new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes() 
    if(message !== ""){
      await socket.emit("chat", {message,userName, date})
      setMessage("");
    }


  }
  useEffect(() => {  
      
      socket.on("recive_message", (payload)=>{
      console.log(payload," in use effect");
      setChat(prev =>[...prev, payload])
      
    })
    console.log(chat)
  
     
  },[socket])
  
// no dotenv
// const socket = io.connect("http://localhost:5000");
// const userName = nanoid(4);

// function App() {
//   const [message, setMessage] = useState("")
//   const [chat, setChat] = useState([]);

//   const sendMsg  = (e) => {
//     e.preventDefault();
//     socket.emit("chat", { message, userName })
//     setMessage("")
//   };

//   useEffect(() => {
//     socket.on("chat", (payload) => {
//       setChat([...chat, payload])
//     })
//   })
  return (
    <div className="App w-screen h-screen flex flex-col justify-center items-center bg-gray-600">
      <h1 className='text-blue-400 '>Chat House</h1>
        <ScrollToBottom className='w-full md:w-96 bg-white text-black h-[400px] overflow-y-scroll'>
      <div className='flex flex-col justify-start'>
          {
            chat.map((payload, index) => {
              if(payload.userName === userName){
                return(
                  <div style={{maxWidth:"70%"}} className=' h-fit m-1 self-start'>
                    <p key={index} style={{wordWrap: "break-word"}} className=" p-1 bg-gray-300">
                      {payload.message}
                    </p>
                    <p>{payload.date} <span className='font-bold'>You</span></p>
                  </div>
                )
              }else{
                  return (  
                    <div style={{maxWidth:"70%"}}  className='w-full max-w-3/5 self-end m-1'>
                    <p key={index} style={ {wordWrap: "break-word"}} className=" p-1 bg-blue-300">
                      {payload.message}
                    </p>
                    <p>{payload.date} <span className='font-bold'>{payload.userName}</span></p>
                  </div>
                );
              }
            }) 
          }
        
      </div>
      </ScrollToBottom>
      <form onSubmit={sendMsg} className="w-full md:w-96">
        <input type="text" className='w-4/5 h-9 border' name="chat" placeholder='send text' value={message} onChange={(e)=> setMessage(e.target.value) } />
        <button type='submit' className='w-1/5 h-9 px-3 py-1 font-bold hover:bg-green-600 border'>send</button>
      </form>
    </div>

  );
}

export default App;
