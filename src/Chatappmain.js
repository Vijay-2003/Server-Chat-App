import React, { useEffect, useRef, useState } from 'react';
import { Box,Container,VStack,Button, Input, HStack } from '@chakra-ui/react';
import Message from './Components/Message';
import { GoogleAuthProvider,signOut, onAuthStateChanged, getAuth,signInWithPopup } from "firebase/auth"
import { app } from './Components/Firebase';
import {getFirestore,query,orderBy,addDoc, collection,onSnapshot,serverTimestamp} from "firebase/firestore";


const auth = getAuth(app);
const db = getFirestore(app)

const loginHandler = () => {
    const provider= new GoogleAuthProvider();
    signInWithPopup(auth,provider)
}

const logoutHandler = () => {
    signOut(auth)
}

function Chatappmain() {

    const [user,setuser] = useState(false);
    const [message,setmessage] = useState("")
    const [messages,setmessages] = useState([])

    const divforscroll = useRef(null)

    const submithandler = async(e) => {
        e.preventDefault();
    
        try{
            setmessage("");

            await addDoc(collection(db,"Messages"),
        {
            text: message,
            uid: user.uid,
            uri: user.photoURL,
            createdAt: serverTimestamp(),
        })

    
        divforscroll.current.scrollIntoView({behavior: "smooth"});
        }catch(error){
            alert(error)
        }
    }

    useEffect(()=>{
        const q = query(collection(db,"Messages"), orderBy("createdAt","asc"))

       const unsubscribe =  onAuthStateChanged(auth,(data) => {
            setuser(data);

        });

        const unsubscribeformessage = onSnapshot(q, (snap) => {
            setmessages(
                snap.docs.map((item) => {
                const id = item.id
                return {id, ...item.data()};    
             })
             );
        })
            return () => {
                unsubscribe();
                unsubscribeformessage();
            };
    },[]);       

  return (
    <Box bg={"#232323"}>
       {
        user ? (
            <Container h={"100vh"} bg={"white"}>
        <VStack h="full" padding={"4"}>
            <Button onClick={logoutHandler} colorScheme={"red"} width={"full"}>
            Logout</Button>
            <VStack css={{"&::-webkit-scrollbar":{
                display:"none"
            }}} h={"full"} w={"full"} overflowY={"auto"}>
                {
                    messages.map(item => (
                        <Message key={item.id} 
                        user={item.uid === user.uid ? "me" : "other"} 
                        text={item.text} 
                        uri={item.uri}/>  
                    ))
                }

                <div ref={divforscroll}> </div>
            </VStack>

            <form onSubmit={submithandler} style={{"width":"100%"}}>
                <HStack>
                <Input value={message} onChange={(e) => setmessage(e.target.value)} style={{backgroundColor:"#212121", color:"white"}} placeholder='Enter Message....'></Input>
                <Button colorScheme='purple' type='submit'>Send</Button>
                </HStack>
            </form>

        </VStack>

        </Container>
        ):<VStack bg={"white"} justifyContent={"center"} h={"100vh"}>
        
        <Button colorScheme='purple' onClick={loginHandler}>
            Login with google
        </Button>
        </VStack>
       }
    </Box>
  )
}
export default Chatappmain;
