import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import {Link } from '@mui/material';
import '../NavBar.css';
import Cookies from 'js-cookie';
import { Params, useParams } from 'react-router-dom';
import { Link as RouterLink} from 'react-router-dom';
const logo = require('../images/61447cd55953a50004ee16d9.png');
const H = require('../images/H.png');
const NavBar = () => {
    const [val, setVal] = useState('');
    const [latest,setLatest] = useState('');
    const [titles, setTitles] = useState({});
    const { id:documentId } = useParams();
    useEffect(() => {
        try {
            const savedTitlesJson = Cookies.get('titles');
            const savedTitles = savedTitlesJson ? JSON.parse(savedTitlesJson) : {};
            setTitles(savedTitles);
            const latestTitle = savedTitles[documentId]?.length > 0
                ? savedTitles[documentId][savedTitles[documentId].length - 1]
                : 'Untitled document -Google Docs';
            document.title = latestTitle+' -Google Docs';
            if(latestTitle==='Untitled document -Google Docs'){
                setVal("");
            }
            else{
                setVal(latestTitle);
            }
        } catch (error) {
            console.error('Error parsing JSON from cookies:', error);
            setTitles({});
        }
    }, [documentId]);

    useEffect(() => {
        Cookies.set('titles', JSON.stringify(titles), { expires: 7 });
    }, [titles]);

    const handleTitleChange = (val) => {
        if (val && !titles[documentId]?.includes(val)) {
            setTitles((prevTitles) => {
                const newTitles = { ...prevTitles, [documentId]: [...(prevTitles[documentId] || []), val] };
                const latestTitle = newTitles[documentId]?.length > 0 ? newTitles[documentId][newTitles[documentId].length - 1]: 'Untitled document';
                setLatest(latestTitle);
                document.title=val+' -Google Docs';
                console.log(latest);
                return newTitles;
            });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (val !== 'Untitled document') {
                handleTitleChange(val);
            }
        }
    };

    const handleChange = (evt) => {
        setVal(evt.target.value);
    };

    const reloadDocument = () => {
        window.location.reload();
    };

    return (
        <Box sx={{ flexWrap: 'wrap', flexDirection: 'column',marginBottom:'7px' }}>
            <Link component={RouterLink} to={`/docs/${documentId}`} onClick={reloadDocument}>
                <img style={{ margin: '0px 0px 2px 4px', width: '3%' }} alt="docs-logo" src={logo} />
            </Link>
            <input
                type="text"
                placeholder="Untitled document"
                value={val}
                name="title"
                className="docs-title-input"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            <span className="title">Docs</span>
            <a href="https://github.com/harsha-10" target="_blank" rel="noopener noreferrer">
                <img style={{width: '3%', paddingLeft:'72.8rem' }} alt="docs-H" src={H} />
            </a>
        </Box>
    );
};

export default NavBar;
