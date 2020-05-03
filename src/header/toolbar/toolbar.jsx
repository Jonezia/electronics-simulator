import './toolbar.css'
import React from 'react'
import newfile from './images/new-file-16.png'
import play from './images/play-16.png'

export default function Toolbar() {
    return(
        <div id="toolbarContainer">
            <div class="toolbarButton">
                <img src={newfile} alt="new"
                id="newFileImage"></img>
                <p>New</p>
            </div>
            <div class="toolbarButton">
                <img src={play} alt="run"
                id="runImage"></img>
                <p>Run</p>
            </div>
        </div>
    )
}