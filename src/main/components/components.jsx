import './components.css'
import React,{useState} from 'react'

import Component from './component/component'

let componentsArray = ["Battery","Bulb","Resistor"]

export default function Components(props) {

    let [componentsInput,setComponentsInput] = useState();

    const handleChange = (e) => {
        setComponentsInput(e.target.value)
        console.log(componentsInput)
    }

    const toggleComponents = () => {
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
                onChange={handleChange}/>
            </div>
            <div id="componentsListContainer">
                <div id="componentsList">
                    {componentsArray.map((name,index) => {
                        return <Component name={name} handleClick={props.changeActiveComponent}
                        active={name === props.activeComponent} key={index}/>
                    })}
                </div>
            </div>
        </div>
    )
}