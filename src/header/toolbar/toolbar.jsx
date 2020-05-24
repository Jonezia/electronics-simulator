import './toolbar.css'
import React from 'react'
import newfile from './images/new-file-16.png'
import undo from './images/undo-16.png'
import redo from './images/redo-16.png'

export default function Toolbar(props) {

    return(
        <div id="toolbarContainer">
            <div className="toolbarButton" id="newButton">
                <img src={newfile} alt="new"
                id="newFileImage"></img>
                <p className="toolbarButtonText">New</p>
            </div>
            <div className="toolbarButton" id="undoButton">
                <img src={undo} alt="undo"
                id="undoImage"></img>
                <p className="toolbarButtonText">Undo</p>
            </div>
            <div className="toolbarButton" id="redoButton">
                <img src={redo} alt="redo"
                id="redoImage"></img>
                <p className="toolbarButtonText">Redo</p>
            </div>
        </div>
    )
}