import './grid.css'
import React,{useEffect} from 'react'
import Snap from 'snapsvg-cjs'

const svgns = "http://www.w3.org/2000/svg";
const xlinkns = "http://www.w3.org/1999/xlink";

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
        var key;
        for(key in this.paths) {
            this.paths[key][0].attr({"path" : this.getPathString(this.paths[key][1])});
            this.paths[key][0].prependTo(this.paper);
        }
    }

    function getCoordinates() {
        let bb = this.getBBox();
        return [bb.cx,bb.cy];
    }
          
    function getPathString(obj) {
        var p1 = this.getCoordinates();
        var p2 = obj.getCoordinates();
        return "M"+p1[0]+","+p1[1]+"L"+p2[0]+","+p2[1];
    }

    function addPath(obj) {
        var id = obj.id;
        var path = this.paper.path(this.getPathString(obj)).attr({fill:'none', stroke:'blue', strokeWidth:1});
        path.prependTo(this.paper);
        this.paths[id] = [path, obj];
        obj.paths[this.id] = [path, this];            
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

    Paper.prototype.draggableRect = function (x, y, w, h, text) {
        let rect = this.rect(0,0,w,h).transform("T"+x+","+y);
        let textElem = this.text(w/2,h/2,text).transform("T"+x+","+y);
        rect.attr({fill: "yellow"})
        textElem.attr({fontSize: "30px", fill: "black"})
        let g = this.g(rect,textElem)
        g.paths = {};
        g.drag(dragMove, dragStart, dragEnd);
        g.updatePaths = updatePaths;
        g.getCoordinates = getCoordinates;
        g.getPathString = getPathString;
        g.addPath = addPath;
        g.removePath = removePath;
        
        return g;
    };
});

let paper;

export default function Grid(props) {

    useEffect(() => {
        paper = Snap("#fullGrid");
        let rect1 = paper.draggableRect(200,200,100,100,"test1")
        let rect2 = paper.draggableRect(400,200,100,100,"test2")
        let rect3 = paper.draggableRect(200,400,100,100,"test3")
        rect1.addPath(rect2)
        rect1.addPath(rect3)
    }); 

    const newComponent = (e) => {
        let rect = paper.draggableRect(e.clientX-50,e.clientY-126,100,100,props.activeComponent)
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