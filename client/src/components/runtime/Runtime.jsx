import ActivationRecord from "./ActivationRecord";
import './runtime.css';
import React from "react";

export default class Runtime extends React.Component{
    // state = {
    //     virtualCallStack: new Array(),
    //     virtualHeap: new Array(),
        
    //     virtualDataSegment: new Array(),
    //     virtualBSS: new Array()
    // }
    macroMap = new Map();
    render() {
        return (
            <div className="visualWrapper" key={'visualWrapper'}>
                <div key={'callstack'}>
                    {/* <ActivationRecord /> */}
                </div>
                <div className="heap" key={'heap'}></div>
                <div className="data" key={'data'}></div>
                <div className="bss" key={'bss'}></div>
            </div>
        );
    }
    
}