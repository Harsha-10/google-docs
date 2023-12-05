import React from 'react'
import { Box } from '@mui/material'
import '../NavBar.css'
import { useState } from 'react';
const logo = require('../images/61447cd55953a50004ee16d9.png');
const NavBar = () => {
    const [val,setVal] = useState("")
    const [title,setTitle] = useState("Untitled document - Google Docs");
    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if(val!==""){setTitle(val);}
            else{setTitle("Untitled document - Google Docs")}
        }
    };
    const handleChange=(evt)=>{
        setVal(evt.target.value);
    }
    document.title=title+" - Google Docs";
    return (
        <Box sx={{flexWrap: 'wrap',flexDirection: 'column'}}>
            <a href="/"><img style={{margin:"0px 0px 2px 4px",width:"3%"}} alt='docs-logo' src={logo} /></a>
            <input type="text" placeholder='Untitled document' value={val} name="title" class="docs-title-input" onChange={handleChange} onKeyDown={handleKeyDown}/>
            <span class="title">Docs</span>
        </Box>
    )
}

export default NavBar