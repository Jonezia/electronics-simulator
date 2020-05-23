import './grid.css'
import React,{useEffect} from 'react'
import Snap from 'snapsvg-cjs'

let paper;
let lineout = false;
let activepath;
let activejunction;

function XOR(a,b) {
    return ((a && !b) || (!a && b))
}

Snap.plugin(function (Snap, Element, Paper, global, Fragment) {

    // Define global element methods

    Element.prototype.getCoordinates = function() {
        let bb = this.node.getBoundingClientRect()
        return [(bb.left+bb.right)/2,(bb.top+bb.bottom)/2-76];
    }

    // Define methods for component snap class

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

    function updateNodePaths(node) {
        let fromCoords;
        let toCoords;
        for (let key in node.paths) {
            fromCoords = node.circle.getCoordinates();
            toCoords = node.paths[key][0].circle.getCoordinates();
            node.paths[key][1].attr({"path":
                pathStringify(fromCoords[0],fromCoords[1],toCoords[0],toCoords[1])
            });
        }
    }

    function updatePaths() {
        if (this.nodeCount === 2) {
            updateNodePaths(this.inNode);
        } else if (this.nodeCount === 3) {
            updateNodePaths(this.aNode);
            updateNodePaths(this.bNode);
        }
        updateNodePaths(this.outNode);
    }

    function updateValues() {
        if (this.nodeCount === 2 && this.inNode.value) {
            if (this.name === "Repeater") {
                this.outNode.updateValue(this.inNode.value);
            } else if (this.name === "NOT") {
                this.outNode.updateValue((!this.inNode.value) ? 1:0);
            }
        } else if (this.nodeCount === 3 && this.aNode.value !== null && this.bNode.value !== null) {
            if (this.name === "AND") {
                this.outNode.updateValue((this.aNode.value && this.bNode.value) ? 1:0);
            } else if (this.name === "OR") {
                this.outNode.updateValue((this.aNode.value || this.bNode.value) ? 1:0);
            } else if (this.name === "NAND") {
                this.outNode.updateValue((this.aNode.value && this.bNode.value) ? 0:1);
            } else if (this.name === "NOR") {
                this.outNode.updateValue((this.aNode.value || this.bNode.value) ? 0:1);
            } else if (this.name === "XOR") {
                this.outNode.updatetValue((XOR(this.aNode.value,this.bNode.value)) ? 1:0);
            } else if (this.name === "XNOR") {
                this.outNode.updateValue((XOR(this.aNode.value,this.bNode.value)) ? 0:1);
            }
        }
    }

    function propagate() {
        this.updateValues();
        if (this.outNode.value !== null) {
            this.outNode.propagateOut();
            for (let i in this.outNode.paths) {
                this.outNode.paths[i][0].parent.propagate();
            }
        }
    }
          
    function getPathString(obj,directionFrom,directionTo) {
        let p1 = this[directionFrom + "Node"].circle.getCoordinates();
        let p2 = obj[directionTo + "Node"].circle.getCoordinates();
        return pathStringify(p1[0],p1[1],p2[0],p2[1])
    }

    function addPath(obj,directionFrom,directionTo) {
        let fromNode = this[directionFrom + "Node"];
        let toNode = obj[directionTo + "Node"];
        // prevent connection to same component
        if (fromNode.parent === toNode.parent) {
            return
        }
        // check if path already exists, if so then remove
        if (!(fromNode.removePath(toNode) && toNode.removePath(fromNode))) {
            // add path if doesn't already exist
            let path = this.paper.path(this.getPathString(obj,directionFrom,directionTo))
            .attr({fill:'none', stroke:'black', strokeWidth:1});
            path.prependTo(this.paper);
            fromNode.paths.push([toNode,path]);
            toNode.paths.push([fromNode,path]);
            if (fromNode.direction === "out") {
                this.propagate();
            } else if (toNode.direction === "out") {
                obj.propagate();
            }
        }
    }

    // component class

    Paper.prototype.component = function (x, y, component, nodeCount) {
        let g;
        let body = this.use(`${component}Template`).transform("T"+x+","+y);
        let bb = body.node.getBoundingClientRect();
        let h = bb.bottom - bb.top;
        let w = bb.right - bb.left;

        let outNode = paper.junction("out",w,h/2).transform("T"+x+","+y);
        if (nodeCount === 2) {
            let inNode = paper.junction("in",0,h/2).transform("T"+x+","+y);
            g = this.g(body,inNode,outNode);
            inNode.parent = g;
            g.inNode = inNode;
        } else if (nodeCount === 3) {
            let aNode = paper.junction("a",0,h*0.35).transform("T"+x+","+y);
            let bNode = paper.junction("b",0,h*0.65).transform("T"+x+","+y);
            g = this.g(body,aNode,bNode,outNode);
            aNode.parent = g;
            g.aNode = aNode;
            bNode.parent = g;
            g.bNode = bNode;
        } else {  // nodeCount === 1
            if (component === "OnesSource") {
                outNode.updateValue(1)
            } else if (component === "ZerosSource") {
                outNode.updateValue(0)
            }
            g = this.g(body,outNode);
        }
        outNode.parent = g;
        g.outNode = outNode;

        g.nodeCount = nodeCount;
        g.name = component;
        g.attr({fill: "white", stroke: "black", strokeWidth: 1});

        // functions
        g.drag(dragMove, dragStart, dragEnd);
        g.updatePaths = updatePaths;
        g.getPathString = getPathString;
        g.addPath = addPath;
        g.removePath = removePath;
        g.updateValues = updateValues;
        g.propagate = propagate;

        return g;
    };

    // Define methods for junction

    function onClick(obj) {
        if (lineout) {
            // make connection
            this.parent.addPath(activejunction.parent,this.direction,activejunction.direction)
            // remove activepath
            activepath.remove();
            lineout = false;
        }
        else {
            let coords = this.circle.getCoordinates();
            activejunction = this;
            activepath = this.paper.path(pathStringify(coords[0],coords[1],coords[0],coords[1]));
            activepath.attr({fill:'none', stroke:'black', strokeWidth:1});
            activepath.prependTo(paper);
            lineout = true;
        }
    }

    function removePath(obj) {
        for (let i in this.paths) {
            if (this.paths[i][0] === obj) {
                this.paths[i][1].remove();
                this.paths.splice(i,1);
                return true
            }
        }
    }

    function propagateOut() {
        for (let i in this.paths) {
            if (this.paths[i][0].direction !== "out") {
                this.paths[i][0].updateValue(this.value);
            }
        }
    }

    function updateValue(value) {
        this.value = value;
        this.text.attr({text: value.toString()});
    }

    // junction class

    Paper.prototype.junction = function (direction,x,y) {
        let circle = this.circle(x,y,5);
        let text = this.text(x-3,y-8);
        text.attr({"font-size": 10, "cursor": "default", "pointer-events": "none"})
        let junction = this.g(circle,text);
        junction.text = text;
        junction.circle = circle;
        junction.direction = direction;
        junction.value = null;
        junction.click(onClick);
        junction.paths = [];
        // functions
        junction.removePath = removePath;
        junction.updateValue = updateValue;
        junction.propagateOut = propagateOut;
        return junction
    }

});

// Snap "global" functions

function onMouseMove(e,x,y) {
    // update activepath
    if (lineout) {
        let from = activejunction.circle.getCoordinates()
        activepath.attr({"path": pathStringify(from[0],from[1],x,y-76)})
    }
}

function pathStringify(startx,starty,endx,endy) {
    return "M"+startx+","+starty+"L"+endx+","+endy;
}

export default function Grid(props) {

    useEffect(() => {
        paper = Snap("#fullGrid");
        paper.mousemove(onMouseMove)
    },[]);

    const newComponent = (e) => {
        if(e.target.id === "fullGrid") {
            if (lineout) {
                activepath.remove()
                lineout = false
            }
            let rect = paper.component(e.clientX-50,e.clientY-126,
                props.activeComponent,props.nodeCount);
        }
    }

    const clearPaper = () => {
        paper.clear()
    }
    props.setClearPaper(clearPaper)

    return(
        <div id="gridContainer">
            <svg id="fullGrid" onClick={newComponent}>
            </svg>
            <svg>
            <defs>
                <g id="OnesSourceTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <circle cx="60" cy="50" r="20"></circle>
                    <text x="55" y="55" fill="black" style={{cursor: "default"}}>1</text>
                    <path d="M 80 50 L 100 50"></path>
                </g>
                <g id="ZerosSourceTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <circle cx="60" cy="50" r="20"></circle>
                    <text x="55" y="55" fill="black" style={{cursor: "default"}}>0</text>
                    <path d="M 80 50 L 100 50"></path>
                </g>
                <g id="ANDTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <path d="M 0 35 L 20 35"></path>
                    <path d="M 0 65 L 20 65"></path>
                    <path d="M 20 25 h 30 q 30 0, 30 25 q 0 25, -30 25 h -30 Z"></path>
                    <path d="M 80 50 L 100 50"></path>
                </g>
                <g id="NANDTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <path d="M 0 35 L 16 35"></path>
                    <path d="M 0 65 L 16 65"></path>
                    <path d="M 16 25 h 30 q 30 0, 30 25 q 0 25, -30 25 h -30 Z"></path>
                    <circle cx="80" cy="50" r="4"></circle>
                    <path d="M 84 50 L 100 50"></path>
                </g>
                <g id="ORTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <path d="M 0 35 L 30 35"></path>
                    <path d="M 0 65 L 30 65"></path>
                    <path d="M 20 25 q 60 10, 60 25 q 0 15, -60 25 q 25 -25, 0 -50 Z"></path>
                    <path d="M 80 50 L 100 50"></path>
                </g>
                <g id="NORTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <path d="M 0 35 L 26 35"></path>
                    <path d="M 0 65 L 26 65"></path>
                    <path d="M 16 25 q 60 10, 60 25 q 0 15, -60 25 q 25 -25, 0 -50 Z"></path>
                    <circle cx="80" cy="50" r="4"></circle>
                    <path d="M 84 50 L 100 50"></path>
                </g>
                <g id="XORTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <path d="M 0 35 L 33 35"></path>
                    <path d="M 0 65 L 33 65"></path>
                    <path d="M 23 25 q 60 10, 60 25 q 0 15, -60 25 q 25 -25, 0 -50 Z"></path>
                    <path d="M 17 25 q 25 25, 0 50" fill="none"></path>
                    <path d="M 83 50 L 100 50"></path>
                </g>
                <g id="XNORTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <path d="M 0 35 L 29 35"></path>
                    <path d="M 0 65 L 29 65"></path>
                    <path d="M 19 25 q 60 10, 60 25 q 0 15, -60 25 q 25 -25, 0 -50 Z"></path>
                    <path d="M 13 25 q 25 25, 0 50" fill="none"></path>
                    <circle cx="83" cy="50" r="4"></circle>
                    <path d="M 87 50 L 100 50"></path>
                </g>
                <g id="NOTTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <path d="M 0 50 L 28 50"></path>
                    <path d="M 28 30 l 36 20 l -36 20 Z"></path>
                    <circle cx="68" cy="50" r="4"></circle>
                    <path d="M 72 50 L 100 50"></path>
                </g>
                <g id="RepeaterTemplate">
                    <rect x="0" y="0" width="100" height="100" visibility="hidden"></rect>
                    <path d="M 0 50 L 32 50"></path>
                    <path d="M 32 30 l 36 20 l -36 20 Z"></path>
                    <path d="M 68 50 L 100 50"></path>
                </g>
            </defs>
            </svg>
        </div>
    )
}