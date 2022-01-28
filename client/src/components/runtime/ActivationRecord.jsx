import "./runtime.css";
function formatData(data) {
  let formattedData = [];
  for (let key in data) {
    formattedData.push({
      name: key,
      value: data[key].value,
    });
  }
  console.log(formattedData);
  return formattedData;
}
export default function ActivationRecord(props) {
  return (
    <div className="activationRecords">
      <div className="funcName">{props.functionName}</div>

      <div className="variable-cont">
        {formatData(props.data).map(el => (
          <div key={el.name} className="variable">
            <div className="varName">{el.name}</div>
            <div className="varValue">{el.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
