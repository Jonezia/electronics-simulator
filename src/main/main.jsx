import './main.css'
import React,{useState} from 'react'
import Components from './components/components'
import Grid from './grid/grid'

export default function Main(props) {

    let [activeComponent,setActiveComponent] = useState("OnesSource");
    let [nodeCount,setNodeCount] = useState(1);

    const changeActiveComponent = (newComponent) => {
        if (["OnesSource","ZerosSource"].includes(newComponent)) {
            setNodeCount(1)
        } else if (["AND","OR","NAND","NOR","XOR","XNOR"].includes(newComponent)) {
            setNodeCount(3)
        } else {
            setNodeCount(2)
        }
        setActiveComponent(newComponent);
    }

    return(
        <div id="mainContainer">
            <Components changeActiveComponent={changeActiveComponent}
            activeComponent={activeComponent}/>
            <Grid activeComponent={activeComponent}
            nodeCount={nodeCount}
            setClearPaper={props.setClearPaper}/>
        </div>
    )
}