import React from "react";
import Menu from "./Menu";
import CodeEditor from "./CodeEditor";
import OutputBox from "./OutputBox";
import ToolBar from "./ToolBar";
import Runtime from "./runtime/Runtime";
import ExecutionBoard from "./ExecutionBoard";
import Interpreter from "../interpreter/interpreter";
const containStyle = {
  width: "100vw",
  height: "100vh",
  display: "flex",
};
const divider = {
  height: "30px",
  width: "100%",
  display: "flex",
  alignItems: "center",
  padding: "5px",
  fontWeight: "bold",
};

const codeEditorWrapper = {
  flex: "2",
  flexBasis: "0",
  display: "flex",
  flexDirection: "column",
};

const visualsWrap = {
  flex: "3",
  flexBasis: "0",
  display: "flex",
  flexDirection: "column",
};
const visuals = {
  position: "relative",
  height: "100%",
  width: "100%",
  top: "0",
  left: "0",
};

export default class Body extends React.Component {
  state = {
    code: "",
    language: "clike",
    ExeBoard: false,
    output: "",

    top: -1,
    programCounter: 0,
  };

  constructor(props) {
    super(props);
    Interpreter.init(this);
  }
  handleChange = (val, editor) => {
    Interpreter.editor = editor;
    this.setState(state => {
      return (state.code = val);
    });
    // console.log(this.state.value);
  };
  handleOutputChange = val => {
    this.setState({ output: val });
  };
  handleSelect = language => {
    this.setState({ language });
    console.log(this.state.language);
  };
  handleExeBoardToggle = () => {
    this.setState(() => ({ ExeBoard: !this.state.ExeBoard }));
  };
  handleRunCode = async () => {
    this.setState({ output: "Compiling..." });
    const response = await fetch("http://3.109.203.3:5000/api/compile", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        code: this.state.code,
        language: this.state.language,
      }),
    });
    let res = await response.json();
    if (res.err) {
      console.log(res.err);
      this.setState({ output: res.err });
      return;
    }
    console.log("code compiled");
    this.setState({ output: "code compiled" });
    //initializing stack frame
    Interpreter.tokenizeCode(this.state.code);
    Interpreter.initCallStack();
  };
  handleNext = () => {
    console.log("next");
    Interpreter.readToken();
  };

  render() {
    const { toggleState, toggleMenuStatus } = this.props;
    const items = [1, 2, 3];
    return (
      <>
        <ToolBar
          onSelect={this.handleSelect}
          onMaximize={this.handleExeBoardToggle}
          onRun={this.handleRunCode}
          onNext={this.handleNext}
        />
        <div className="body" key={"body"}>
          <div key={"contains"} style={containStyle}>
            <div key={"codeEditorWrapper"} style={codeEditorWrapper}>
              <CodeEditor
                key={"editor"}
                value={this.state.code}
                onChange={this.handleChange}
                language={this.state.language}
              />
              <div key={"divider"} style={divider}>
                Output
              </div>
              <OutputBox
                value={this.state.output}
                onChange={this.handleOutputChange}
              />
            </div>

            <div key={"visualsWrap"} style={visualsWrap}>
              <div key={"visual"} style={visuals}>
                <Runtime virtualCallStack={Interpreter.virtualCallStack} />
                {/* { this.state.ExeBoard ?  <ExecutionBoard onMinimize={this.handleExeBoardToggle} /> : <></>} */}
              </div>
            </div>
          </div>

          {toggleState ? (
            <Menu items toggleMenuStatus={toggleMenuStatus} />
          ) : (
            <></>
          )}
        </div>
      </>
    );
  }
}
