import React from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";

import "../customStyle.css";

import { Controlled as ControlledEditor } from "react-codemirror2";
import "codemirror/mode/clike/clike";
import "codemirror/mode/javascript/javascript";

const codewrapper = {
  height: "300px",
};

export default class CodeEditor extends React.Component {
  handleChange = (editor, data, value) => {
    this.props.onChange(value, editor);
  };

  render() {
    return (
      <div style={codewrapper}>
        <ControlledEditor
          key={"mainEditor"}
          onBeforeChange={this.handleChange}
          value={this.props.value}
          className=""
          options={{
            lineWrapping: true,
            lint: true,
            mode: this.props.language,
            lineNumbers: true,
            theme: "material",
          }}

          // selection={{
          //     ranges: [{
          //       anchor: {ch: 1, line: 1},
          //       head: {ch: 3, line: 3}
          //     }],
          //     focus: true // defaults false if not specified
          //   }}
          //onSelection={(editor, data) => {this.highlightLines(editor, 1, 1)}}
        />
      </div>
    );
  }
}
