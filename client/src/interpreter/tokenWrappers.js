function ExpressionWrapper(expression, from, to) {
  this.type = "expression";
  this.value = expression;
  this.from = from;
  this.to = to;
}
function ConditionWrapper(condition, from, to) {
  this.type = "condition";
  this.value = condition;
  this.nextIfFalse = null;
  this.from = from;
  this.to = to;
}

function VariableWrapper(variableDetails, from, to) {
  this.type = "variable";
  this.name = variableDetails[3];
  this.datatype =
    variableDetails[1] + (variableDetails[2] ? variableDetails[2] : "");
  this.from = from;
  this.to = to;
}

function ReturnWrapper(returnDetails, from, to) {
  this.type = "return";
  if (returnDetails.value) this.value = `$=${returnDetails.value}`;
  this.returnType = returnDetails.returnType;
  this.from = from;
  this.to = to;
}
function FunctionWrapper(functionDetails, from, to) {
  this.type = functionDetails.type;
  this.name = functionDetails.functionName;
  this.args = functionDetails.args;
  this.from = from;
  this.to = to;
}
function LibFunctionWrapper(functionDetails, from, to) {
  this.type = "lib_function_call";
  this.name = functionDetails.functionName;
  this.args = functionDetails.args;
  this.from = from;
  this.to = to;
}

module.exports = {
  ExpressionWrapper,
  ConditionWrapper,
  VariableWrapper,
  ReturnWrapper,
  FunctionWrapper,
  LibFunctionWrapper,
};
