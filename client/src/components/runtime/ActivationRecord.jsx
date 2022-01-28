import "./runtime.css";

export default function ActivationRecord(props) {
  return (
    <div className="activationRecords">
      <div className="funcName">{props.functionName}</div>

      <div className="variable-cont">
        {props.data.map((el) => (
          <div key={el.name} className="variable">
            <div className="varName">{el.name}</div>
            <div className="varValue">{el.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
