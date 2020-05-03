import './footer.css'
import React from 'react'

export default function Footer() {
    return(
        <div id="footerContainer">
            <div id="footerContainerLeft">
                <p class="footerText"><a target="_blank" href="https://icons8.com"
                title="Icons8.com">Icons by Icons8</a></p>
            </div>
            <div id="footerContainerRight">
                <p class="footerText"><a href="https://github.com/Jonezia/electronics-simulator"
                title="github repo" target="_blank">Adam Jones 2020</a></p>
            </div>
        </div>
    )
}