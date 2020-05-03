import './header.css'
import React from 'react'
import Title from './title/title'
import Toolbar from './toolbar/toolbar'

export default function Header() {
    return(
        <div id="headerContainer">
            <Title/>
            <Toolbar/>
        </div>
    )
}