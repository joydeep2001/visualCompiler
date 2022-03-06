import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";

const toolbarStyle = {
  height: "60px",
  display: "flex",
  // background: '#000'
};
const left = {
  display: "flex",
  flex: "2",
  padding: "5px",
  // background: 'grey',
  flexDirection: "column",
};

const selectStyle = {
  width: "150px",
  height: "30px",
  outline: "none",
  borderRadius: "5%",
};
const codeHeader = {
  marginLeft: "2px",
  fontSize: "15px",
  height: "50%",
  display: "flex",
  fontWeight: "bold",
  alignItems: "center",
};
const right = {
  display: "flex",
  flex: "3",
  padding: "5px",
  position: "relative",
};
const minExeBoard = {
  height: "35px",
  width: "100px",
  background: "#d43a1c99",
  display: "flex",
  justifyContent: "right",
  position: "absolute",
  top: "25px",
  left: "500px",
};
export default function ToolBar(props) {
  const { onSelect, onMaximize, onRun, onNext } = props;
  function handleChange(e) {
    onSelect(e.target.value);
  }
  function handleMaximize() {
    onMaximize();
  }
  function handleRun() {
    onRun();
  }
  function handleNext() {
    onNext();
  }

  return (
    <div key={"toolbar"} style={toolbarStyle}>
      <div key={"left"} style={left}>
        <select style={selectStyle} onChange={handleChange}>
          <option value="lang">Languages</option>
          <option value="clike">C</option>
          <option value="clike">C++</option>
          <option value="javascript">JavaScript</option>
        </select>
        <div key={"codeHeader"} style={codeHeader}>
          <p>Code</p>
          <PlayArrowIcon
            color="success"
            fontSize="large"
            style={{ margin: "2px", cursor: "pointer" }}
            onClick={handleRun}
          />
          <SkipNextIcon
            fontSize="large"
            style={{ margin: "2px", cursor: "pointer" }}
            onClick={handleNext}
          />
          {/* <button style={{ margin: "2px" }}>Pause</button> */}
        </div>
      </div>
      <div key={"right"} style={right}>
        {/* <div style={minExeBoard} id="minExeBoard" key={"minExeBoard"}>
          <button id="maximize" onClick={handleMaximize}>
            Max
          </button>
        </div> */}
      </div>
    </div>
  );
}
