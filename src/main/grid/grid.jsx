import './grid.css'
import React from 'react'

const svgns = "http://www.w3.org/2000/svg";
const xlinkns = "http://www.w3.org/1999/xlink";

export default function Grid(props) {

    const newComponent = (e) => {
        let use = document.createElementNS(svgns, "use");
        let templateId = "#" + props.activeComponent  + "Template"
        use.setAttributeNS(xlinkns, "href", templateId);
        use.setAttributeNS(null, "x", e.clientX);
        use.setAttributeNS(null, "y", e.clientY)
        document.getElementById("gridElements").appendChild(use);
    }

    return(
        <div id="gridContainer">
            <svg id="fullGrid" onClick={newComponent}>
                <defs>
                    <g id="BatteryTemplate">
                        <rect x="-50" y="-126" width="100" height="100" fill="red"></rect>
                        <text x="-50" y="-76" fontFamily="Verdana" fontSize="25" fill="blue">Battery</text>
                    </g>
                    <g id="WireTemplate">
                        <rect x="-50" y="-126" width="100" height="100" fill="red"></rect>
                        <text x="-50" y="-76" fontFamily="Verdana" fontSize="25" fill="blue">Wire</text>
                    </g>
                    <g id="ResistorTemplate">
                        <rect x="-50" y="-126" width="100" height="100" fill="red"></rect>
                        <text x="-50" y="-76" fontFamily="Verdana" fontSize="25" fill="blue">Resistor</text>
                    </g>
                </defs>
                <g id="gridElements">
                </g>
            </svg>
        </div>
    )
}