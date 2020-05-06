import './component.css'
import React from 'react'

export default function Component(props) {

    return(
        <div class="componentContainer">
            <p class="componentName">{props.name}</p>
        </div>
    )
}