import './components.css'
import React from 'react'

import Component from './component/component'

export default function Components(props) {

    let toggleComponents = () => {
        console.log("clicked")
        let Components = document.getElementById("componentsContainer")
        let Toggle = document.getElementById("componentsToggle")
        if (Components.className === "maximised") {
            Components.className = "minimised"
            Toggle.innerHTML = "&gt;"
        } else {
            Components.className = "maximised"
            Toggle.innerHTML = "&lt;"
        }
    }

    return(
        <div id="componentsContainer" className="maximised">
            <div id="componentsToggle" onClick={toggleComponents}>
                <p id="componentsToggleText">&lt;</p>
            </div>
            <p id="componentsTitle">Components</p>
            <div id="componentsInputContainer">
                <input id="componentsInput"
                onChange={props.onChangeComponentsInput}/>
            </div>
            <div id="componentsListContainer">
                <div id="componentsList">
                    <Component name="Battery"/>
                    <Component name="Wire"/>
                    <Component name="Resistor"/>
                </div>
            </div>
        </div>
    )
}