import './grid.css'
import React,{useEffect} from 'react'
import Snap from 'snapsvg-cjs'

let paper;
let lineout;

// Define global element methods

Snap.plugin(function (Snap, Element, Paper, global, Fragment) {
    Element.prototype.getCoordinates = function() {
        let bb = this.node.getBoundingClientRect()
        return [(bb.left+bb.right)/2,(bb.top+bb.bottom)/2-76];
    }
});

// Define methods for draggableRect snap class

Snap.plugin(function (Snap, Element, Paper, global, Fragment) {
    function dragStart(x, y, e) {
        this.current_transform = this.transform();
    }

    function dragMove(dx, dy, x, y, e) {
        this.transform(this.current_transform+'T'+dx+','+dy);
        this.updatePaths();
    }

    function dragEnd(e) {
        this.current_transform = this.transform();
    }

    function updatePaths() {
        let key;
        for(key in this.paths) {
            this.paths[key][0].attr({"path" : this.getPathString(this.paths[key][1],
                this.paths[key][2],this.paths[key][3])});
            this.paths[key][0].prependTo(this.paper);
        }
    }
          
    function getPathString(obj,directionFrom,directionTo) {
        let p1;
        let p2;
        if (directionFrom === "L") {
            p1 = this.leftNode.getCoordinates();
        } else {  // directionFrom === "R"
            p1 = this.rightNode.getCoordinates();
        } if (directionTo === "L") {
            p2 = obj.leftNode.getCoordinates();
        } else {  // directionTo === "R"
            p2 = obj.rightNode.getCoordinates();
        }
        return "M"+p1[0]+","+p1[1]+"L"+p2[0]+","+p2[1];
    }

    function addPath(obj,directionFrom,directionTo) {
        var id = obj.id;
        var path = this.paper.path(this.getPathString(obj,directionFrom,directionTo))
        .attr({fill:'none', stroke:'black', strokeWidth:1});
        path.prependTo(this.paper);
        this.paths[id] = [path, obj, directionFrom, directionTo];
        obj.paths[this.id] = [path, this, directionTo, directionFrom];  
    }
    
    function removePath(obj) {
    	var id = obj.id;
        if (this.paths[id] != null) {
        		this.paths[id][0].remove();
            this.paths[id][1] = null;
            delete this.paths[id];
            
            obj.paths[this.id][1] = null;
            delete obj.paths[this.id];
        }
    }

    Paper.prototype.draggableRect = function (x, y, component) {
        let body = this.use(`${component}Template`).transform("T"+x+","+y);
        let bb = body.node.getBoundingClientRect();
        let h = bb.bottom - bb.top;
        let w = bb.right - bb.left;
        let leftNode = paper.junction(this,0,h/2,5).transform("T"+x+","+y);
        let rightNode = paper.junction(this,w,h/2,5).transform("T"+x+","+y);
        let g = this.g(body,leftNode,rightNode);
        g.leftNode = leftNode;
        g.rightNode = rightNode;
        g.attr({fill: "white", stroke: "black", strokeWidth: 1});
        g.paths = {};
        g.drag(dragMove, dragStart, dragEnd);
        g.updatePaths = updatePaths;
        g.getPathString = getPathString;
        g.addPath = addPath;
        g.removePath = removePath;
        
        return g;
    };
});

// Define methods for junction

Snap.plugin(function (Snap, Element, Paper, global, Fragment) {
    function onClick(obj) {
        if (lineout) {
            // Check if valid connection and make connection

            lineout = false
        }
        else {

            lineout = true
        }
    }

    Paper.prototype.junction = function (parent,x,y,r) {
        let body = this.circle(x,y,r)
        body.parent = parent
        return body
    }
});

// Snap "global" functions

function onMouseMove(x,y) {
    console.log(x)
    console.log(y)
}

export default function Grid(props) {

    useEffect(() => {
        paper = Snap("#fullGrid");
        let rect1 = paper.draggableRect(500,200,"Cell")
        let rect2 = paper.draggableRect(300,400,"Resistor")
        let rect3 = paper.draggableRect(700,400,"Bulb")
        rect1.addPath(rect2,"L","R")
        rect1.addPath(rect3,"R","L")
        
        paper.mousemove(onMouseMove)

    },[]);

    const newComponent = (e) => {
        if(e.target.id === "fullGrid") {
            let rect = paper.draggableRect(e.clientX-50,e.clientY-126,props.activeComponent);
        }
    }

    const clearPaper = () => {
        paper.clear()
    }
    props.setClearPaper(clearPaper)

    return(
        <div id="gridContainer">
            <svg id="fullGrid" onClick={newComponent}>
            <defs>
                <g id="CellTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <path d="M 0 50 L 45 50"></path>
                    <path d="M 45 25 L 45 75"></path>
                    <path d="M 55 40 L 55 60"></path>
                    <path d="M 55 50 L 100 50"></path>
                </g>
                <g id="BatteryTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <path d="M 0 50 L 27 50"></path>
                    <path d="M 27 25 L 27 75"></path>
                    <path d="M 37 40 L 37 60"></path>
                    <path d="M 37 50 L 43 50"></path>
                    <path d="M 47 50 L 53 50"></path>
                    <path d="M 57 50 L 63 50"></path>
                    <path d="M 63 25 L 63 75"></path>
                    <path d="M 73 40 L 73 60"></path>
                    <path d="M 73 50 L 100 50"></path>
                </g>
                <g id="BulbTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <path d="M 0 50 L 100 50"></path>
                    <clipPath id="bulbMask"><circle cx="50" cy="50" r="20"></circle></clipPath>
                    <circle cx="50" cy="50" r="20"></circle>
                    <path d="M 30 30 L 70 70" clipPath="url(#bulbMask)"></path>
                    <path d="M 70 30 L 30 70" clipPath="url(#bulbMask)"></path>
                </g>
                <g id="ResistorTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <path d="M 0 50 L 100 50"></path>
                    <rect x="20" y="40" width="60" height="20"></rect>
                </g>
                <g id="FuseTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <rect x="20" y="40" width="60" height="20"></rect>
                    <path d="M 0 50 L 100 50"></path>
                </g>
                <g id="OpenSwitchTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <path d="M 0 50 L 15 50"></path>
                    <path d="M 85 50 L 100 50"></path>
                    <circle cx="15" cy="50" r="3"></circle>
                    <circle cx="85" cy="50" r="3"></circle>
                    <path d="M 15 47 L 85 30"></path>
                </g>
                <g id="ClosedSwitchTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <path d="M 0 50 L 15 50"></path>
                    <path d="M 85 50 L 100 50"></path>
                    <circle cx="15" cy="50" r="3"></circle>
                    <circle cx="85" cy="50" r="3"></circle>
                    <path d="M 15 47 L 85 47"></path>
                </g>
                <g id="ThermistorTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <path d="M 0 50 L 100 50"></path>
                    <rect x="20" y="40" width="60" height="20"></rect>
                    <path d="M 20 67 L 35 67"></path>
                    <path d="M 35 67 L 80 33"></path>
                </g>
                <g id="VariableResistorTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <path d="M 0 50 L 100 50"></path>
                    <rect x="20" y="40" width="60" height="20"></rect>
                    <path d="M 20 70 L 80 30"></path>
                    <path d="M 80 30 L 73 30"></path>
                    <path d="M 80 30 L 80 35"></path>
                </g>
                <g id="VoltmeterTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <path d="M 0 50 L 100 50"></path>
                    <circle cx="50" cy="50" r="20"></circle>
                    <path d="M 50 60 L 40 40"></path>
                    <path d="M 50 60 L 60 40"></path>
                </g>
                <g id="AmmeterTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <path d="M 0 50 L 100 50"></path>
                    <circle cx="50" cy="50" r="20"></circle>
                    <path d="M 50 40 L 40 60"></path>
                    <path d="M 50 40 L 60 60"></path>
                    <clipPath id="ammeterMask"><polygon points="50,40 40,60 60,60"></polygon></clipPath>
                    <path d="M 0 50 L 100 50" clipPath="url(#ammeterMask)"></path>
                </g>
                <g id="DiodeTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <path d="M 0 50 L 100 50"></path>
                    <polygon points="63,50 37,35 37,65"></polygon>
                    <path d="M 63 35 63 65"></path>
                </g>
                <g id="LEDTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <circle cx="50" cy="50" r="20"></circle>
                    <path d="M 0 50 L 100 50"></path>
                    <polygon points="56.5,50 43.5,42.5 43.5,57.5"></polygon>
                    <path d="M 56.5 42.5 56.5 57.5"></path>
                    <path d="M 67 28 L 75 20"></path>
                    <path d="M 75 20 L 72 20"></path>
                    <path d="M 75 20 L 75 23"></path>
                    <path d="M 72 33 L 80 25"></path>
                    <path d="M 80 25 L 77 25"></path>
                    <path d="M 80 25 L 80 28"></path>
                </g>
                <g id="LDRTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <circle cx="50" cy="50" r="20"></circle>
                    <path d="M 0 50 L 100 50"></path>
                    <rect x="35" y="45" width="30" height="10"></rect>
                    <path d="M 33 28 L 25 20"></path>
                    <path d="M 33 28 L 30 28"></path>
                    <path d="M 33 28 L 33 25"></path>
                    <path d="M 28 33 L 20 25"></path>
                    <path d="M 28 33 L 25 33"></path>
                    <path d="M 28 33 L 28 30"></path>
                </g>
                <g id="DCPowerTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <path d="M 0 50 L 30 50"></path>
                    <path d="M 70 50 L 100 50"></path>
                    <circle cx="30" cy="50" r="3"></circle>
                    <circle cx="70" cy="50" r="3"></circle>
                    <path d="M 30 44 L 30 38"></path>
                    <path d="M 27 41 L 33 41"></path>
                    <path d="M 67 41 L 73 41"></path>
                </g>
                <g id="ACPowerTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <path d="M 0 50 L 30 50"></path>
                    <path d="M 70 50 L 100 50"></path>
                    <circle cx="30" cy="50" r="3"></circle>
                    <circle cx="70" cy="50" r="3"></circle>
                    <path d="M 40 50 L 40 50 A 5 5 0 0 0 50 50 A 5 5 0 1 1 60 50" fill="none"></path>
                </g>
            </defs>
            </svg>
        </div>
    )
}