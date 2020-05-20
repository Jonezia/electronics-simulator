import './component.css'
import React from 'react'

export default function Component(props) {

    let selected
    props.active ? selected = "selected" : selected = "unselected";
    
    return(
        <div className={"componentContainer " + selected}
        onClick={()=>props.handleClick(props.name)}>
            <p className="componentName">{props.name}</p>
        </div>
    )
}