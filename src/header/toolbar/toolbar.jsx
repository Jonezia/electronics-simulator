import './toolbar.css'
import React from 'react'
import newfile from './images/new-file-16.png'
import play from './images/play-16.png'

export default function Toolbar(props) {

    const clearGrid = () => {
        props.onClickClearPaper()
    }

    return(
        <div id="toolbarContainer">
            <div className="toolbarButton" onClick={clearGrid}>
                <img src={newfile} alt="new"
                id="newFileImage"></img>
                <p className="toolbarButtonText">New</p>
            </div>
            <div className="toolbarButton">
                <img src={play} alt="run"
                id="runImage"></img>
                <p className="toolbarButtonText">Run</p>
            </div>
        </div>
    )
}