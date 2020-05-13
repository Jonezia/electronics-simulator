import './grid.css'
import React,{useEffect} from 'react'
import Snap from 'snapsvg-cjs'

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

    function getCoordinates(direction) {
        if (direction === "left") {
            let bbl = this.select("circle:nth-child(2)").node.getBoundingClientRect()
            return [(bbl.left+bbl.right)/2,(bbl.top+bbl.bottom)/2-76];
        }
        else if (direction === "right") {
            let bbr = this.select("circle:nth-child(3)").node.getBoundingClientRect()
            return [(bbr.left+bbr.right)/2,(bbr.top+bbr.bottom)/2-76];
        }
        else {
            let bb = this.getBBox();
            return [bb.cx,bb.cy];
        }
    }
          
    function getPathString(obj,directionFrom,directionTo) {
        var p1 = this.getCoordinates(directionFrom);
        var p2 = obj.getCoordinates(directionTo);
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
        let h = bb.bottom - bb.top
        let w = bb.right - bb.left
        let leftNode = this.circle(0,h/2,5).transform("T"+x+","+y);
        let rightNode = this.circle(w,h/2,5).transform("T"+x+","+y);
        body.attr({fill: "white", stroke: "black", strokeWidth: 1})
        let g = this.g(body,leftNode,rightNode);
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
        let rect1 = paper.draggableRect(500,200,"Battery")
        let rect2 = paper.draggableRect(300,400,"Resistor")
        let rect3 = paper.draggableRect(700,400,"Bulb")
        rect1.addPath(rect2,"left","right")
        rect1.addPath(rect3,"right","left")
    },[]);

    const newComponent = (e) => {
        //let rect = paper.draggableRect(e.clientX-50,e.clientY-126,100,100,props.activeComponent);
    }

    const clearPaper = () => {
        paper.clear()
    }
    props.setClearPaper(clearPaper)

    return(
        <div id="gridContainer">
            <svg id="fullGrid" onClick={newComponent}>
            <defs>
                <g id="BatteryTemplate">
                    <rect x="0" y="0" width="100" height="100" fill="red"></rect>
                    <text x="0" y="50" fontFamily="Verdana" fontSize="25" fill="blue">Battery</text>
                </g>
                <g id="BulbTemplate">
                    <rect x="0" y="0" width="100" height="100" fill="red"></rect>
                    <text x="0" y="50" fontFamily="Verdana" fontSize="25" fill="blue">Bulb</text>
                </g>
                <g id="ResistorTemplate">
                    <rect x="0" y="0" width="100" height="100" fill="red"></rect>
                    <text x="0" y="50" fontFamily="Verdana" fontSize="25" fill="blue">Resistor</text>
                </g>
            </defs>
            </svg>
        </div>
    )
}