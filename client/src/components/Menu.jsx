import React from "react";




export default function Menu({items, toggleMenuStatus}) {
    const style = {
        height: '100vh',
        width: '30vw',
        background: '#00fff0',
        position: 'absolute',
        top: '0',
        left: '-10',
        zIndex: '4'
    }; 
    const overlay = {
        height: '100vh',
        width: '100vw',
        background: '#000000AA',
        position: 'absolute',
        top: '0',
        left: '0'
    }
    return (
        <>
            {/* overlay */}
            <div style={overlay} onClick={toggleMenuStatus}>

            </div>
            {/*Menu*/}
            <div style={style}>

            </div>
            
        </>
    );
}