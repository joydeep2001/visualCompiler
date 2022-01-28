import ActivationRecord from "./ActivationRecord";
import "./runtime.css";
import React from "react";

export default class Runtime extends React.Component {
  // state = {
  //     virtualCallStack: new Array(),
  //     virtualHeap: new Array(),

  //     virtualDataSegment: new Array(),
  //     virtualBSS: new Array()
  // }

  render() {
    return (
      <div className="visualWrapper" key={"visualWrapper"}>
        <div className="callStack-wrapper">
          <h5>Call Stack</h5>
          <div className="callStack" key={"callstack"}>
            {/* <ActivationRecord /> */}
            {this.props.virtualCallStack
              .map((frame, index) => (
                <ActivationRecord
                  key={frame.name + index}
                  functionName={frame.name}
                  data={frame.data}
                />
              ))
              .reverse()}
          </div>
        </div>
        <div className="heap" key={"heap"}>
          <h5>Heap</h5>
        </div>
        <div className="data" key={"data"}>
          <h5>Data</h5>
        </div>
        <div className="bss" key={"bss"}>
          <h5>bss</h5>
        </div>
      </div>
    );
  }
}
