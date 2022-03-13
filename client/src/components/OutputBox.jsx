import react from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";

import { Controlled as ControlledEditor } from "react-codemirror2";

const outputwrapper = {
  height: "200px",
};

export default function OutputBox(props) {
  const { value, onChange } = props;
  function handleChange(editor, data, value) {
    onChange(value);
  }
  return (
    <div key={"outputwrapper"} style={outputwrapper}>
      <ControlledEditor
        key={"outputbox"}
        onBeforeChange={handleChange}
        value={value}
        className=""
        options={{
          lineWrapping: true,
          theme: "material",
          mode: "",
        }}
      />
    </div>
  );
}
