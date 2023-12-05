import React from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { useEffect,useState } from 'react'
import { Box } from '@mui/material'
import styled from '@emotion/styled'
import '../App.css'
import {io} from 'socket.io-client'
import { Params, useParams } from 'react-router-dom'
const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],                    
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],            
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],    
    [{ 'indent': '-1'}, { 'indent': '+1' }], 
    [{ 'direction': 'rtl' }],                
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],          
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean']                                        
    ];
const Component = styled.div`
    background:#F9FBFD
    `
const Editor = () => {
    const [socket,setSocket] = useState();
    const [quill,setQuill] = useState();
    const {id: documentID} = useParams();
    useEffect(() => {
        const quill = new Quill('#container', {
            theme: 'snow',
            modules:{toolbar:toolbarOptions,}
        })
        quill.disable();
        quill.setText('Loading the doc...')
        setQuill(quill);
    }, [])
    useEffect(()=>{
        const socketServer = io('https://google-docs-backend.vercel.app/');
        setSocket(socketServer);
        return ()=>{
            socketServer.disconnect(); 
        }
    },[])

    //send changes
    useEffect(()=>{
        if(quill===null || socket===null){return;}
        const handleChange=(delta, oldDelta, source)=> {
            if (source !== 'user') {
                return;
            }
            socket.emit('send-changes',delta); 
        }
        quill && quill.on('text-change', handleChange);
        return ()=>{
            quill && quill.off('text-change',handleChange);
        }
    },[quill,socket])

    //recieve and update contents
    useEffect(()=>{
        if(quill===null || socket===null){return;}
        const handleChange=(delta)=> {
            quill.updateContents(delta); 
        }
        socket && socket.on('recieve-changes', handleChange);
        return ()=>{
            socket && socket.off('recieve-changes',handleChange);
        }
    },[quill,socket])

    useEffect(()=>{
        if(quill===null || socket===null){return;}
        socket && socket.emit('get-doc',documentID);
        console.log(documentID);
        socket && socket.once('load-doc',document=>{
            quill.setContents(document);
            quill.enable();
        })
    },[quill,socket,documentID])

    useEffect(()=>{
        if(socket===null || quill===null){return;}
        const interval = setInterval(()=>{
            socket && socket.emit('save',quill.getContents())
        },2000);
        return ()=> clearInterval(interval);
    },[quill,socket])
    return (
        <Component>
            <Box className='container' id='container'></Box>
        </Component>
    )
}


export default Editor
