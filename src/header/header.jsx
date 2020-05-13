import './header.css'
import React from 'react'
import Title from './title/title'
import Toolbar from './toolbar/toolbar'

export default function Header(props) {
    return(
        <div id="headerContainer">
            <Title/>
            <Toolbar onClickClearPaper={props.onClickClearPaper}/>
        </div>
    )
}