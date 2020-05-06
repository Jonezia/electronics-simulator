import './footer.css'
import React from 'react'

export default function Footer(props) {
    return(
        <div id="footerContainer">
            <div id="footerContainerLeft">
                <p className="footerText"><a target="_blank" href="https://icons8.com"
                rel="noopener noreferrer" title="Icons8.com">Icons by Icons8</a></p>
            </div>
            <div id="footerContainerRight">
                <p className="footerText"><a href="https://github.com/Jonezia/electronics-simulator"
                rel="noopener noreferrer" title="github repo" target="_blank">Adam Jones 2020</a></p>
            </div>
        </div>
    )
}