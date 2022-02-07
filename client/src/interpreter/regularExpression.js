const dataType = "((?:\\w+\\**\\s+\\**)+)(\\s*\\**)*";
const identifier = "(\\w+)";
const parameters = "\\((.*\\n*.*)\\)";
const optionalWhiteSpace = "\\s*\\t*\\n*";

const includeDetector = /#include.+/gm;
const macroDefinitionDetector = /#define\s(\w+)\s+(.+)/g;
const functionSignatureDetector = new RegExp(
  `${dataType}(${optionalWhiteSpace})${identifier}(${optionalWhiteSpace})${parameters}${optionalWhiteSpace}\\{`,
  "gm"
);
const functionCallDetector = new RegExp(
  `${identifier}${optionalWhiteSpace}${parameters}`,
  ""
);
const parameterDefinitionDetector = new RegExp(
  `${dataType}(${optionalWhiteSpace})${identifier}${optionalWhiteSpace}[,\\)][^\\(]`,
  "gm"
);
// const multiVariableDefinationDetector = new RegExp(`(int)\*?\s((\w+(\[(\d+|\w+)\])?(\s*?=\s*(\d+|'.+|".+"|\w+|\{.\}))?\s*[,;]\s*)+)`);
const whileloopDetector = new RegExp(`while${optionalWhiteSpace}${parameters}`);
const partialForLoopDetector = new RegExp(`for${optionalWhiteSpace}\\(.*`);
const forloopDetector = new RegExp(`for${optionalWhiteSpace}${parameters}`);
const ifDetector = new RegExp(`if${optionalWhiteSpace}${parameters}`);
const elseIfDetector = new RegExp(`else if${optionalWhiteSpace}${parameters}`);
const elseDetector = new RegExp(`else`);
const variableDetector = new RegExp(
  `${dataType}${optionalWhiteSpace}${identifier}`
);
const expressionDetector = new RegExp(
  `(\\d*\\w*${optionalWhiteSpace}[-/+*=<>]+${optionalWhiteSpace}\\d*\\w*)*`
);
const returnStatementDetector = new RegExp(
  `return\\s${optionalWhiteSpace}(.+${optionalWhiteSpace})*`
);
console.log("-------------debug--------------------");
console.log("functionSignatureDetector", functionSignatureDetector);
console.log("functionCallDetector", functionCallDetector);
console.log("parameterDefinitionDetector", parameterDefinitionDetector);
console.log("whileloopDetector", whileloopDetector);
console.log("forloopDetector", forloopDetector);
console.log("if detector", ifDetector);
console.log("else if detector", elseIfDetector);
console.log("else detector", elseDetector);
console.log("variable detector", variableDetector);
console.log("returnStatementDetector", returnStatementDetector);
console.log("-------------end--------------------");

module.exports = {
  includeDetector,
  macroDefinitionDetector,
  functionCallDetector,
  functionSignatureDetector,
  parameterDefinitionDetector,
  whileloopDetector,
  partialForLoopDetector,
  forloopDetector,
  ifDetector,
  elseIfDetector,
  elseDetector,
  variableDetector,
  expressionDetector,
  returnStatementDetector,
};
