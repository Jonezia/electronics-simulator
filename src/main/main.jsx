import './main.css'
import React,{useState} from 'react'
import Components from './components/components'
import Grid from './grid/grid'
import Parameters from './parameters/parameters'

export default function Main(props) {

    let [activeComponent,setActiveComponent] = useState("Battery");

    const changeActiveComponent = (newComponent) => {
        setActiveComponent(newComponent)
    }

    return(
        <div id="mainContainer">
            <Components changeActiveComponent={changeActiveComponent}
            activeComponent={activeComponent}/>
            <Grid activeComponent={activeComponent}/>
            <Parameters/>
        </div>
    )
}