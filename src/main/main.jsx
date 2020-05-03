import './main.css'
import React from 'react'
import Components from './components/components'
import Grid from './grid/grid'
import Parameters from './parameters/parameters'

export default function Main() {
    return(
        <div id="mainContainer">
            <Components/>
            <Grid/>
            <Parameters/>
        </div>
    )
}