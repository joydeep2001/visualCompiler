import ActivationRecord from "./ActivationRecord";
import './runtime.css';
import React from "react";

export default class Runtime {
    state = {
        virtualCallStack: Array(),
        virtualHeap: Array(),
        
        virtualDataSegment: Array(),
        virtualBSS: Array()
    }
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