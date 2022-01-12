const dataType = '((?:\\w+\\**\\s+\\**)+)(\\s*\\**)*';
const identifier = '(\\w+)'; 
const functionParameters = '\\((.*)\\)';
const optionalWhiteSpace = '\\s*\\t*\\n*';



const includeDetector = /#include.+/gm;
const macroDefinitionDetector = /#define\s(\w+)\s+(.+)/g;
const functionSignatureDetector = new RegExp(`${dataType}(${optionalWhiteSpace})${identifier}(${optionalWhiteSpace})${functionParameters}${optionalWhiteSpace}[^;]`, 'm');
const functionCallDetector = new RegExp(optionalWhiteSpace + identifier + functionParameters, 'gm');
const variableDefinitionDetector = new RegExp(`${dataType}(${optionalWhiteSpace})${identifier}${optionalWhiteSpace}[,=;\)][^\(]`, 'g');
// const multiVariableDefinationDetector = new RegExp(`(int)\*?\s((\w+(\[(\d+|\w+)\])?(\s*?=\s*(\d+|'.+|".+"|\w+|\{.\}))?\s*[,;]\s*)+)`);
const loopDetector = new RegExp('while|for|do');

console.log(variableDefinitionDetector);

module.exports = {
    includeDetector,
    macroDefinitionDetector,
    functionCallDetector,
    functionSignatureDetector,
    variableDefinitionDetector,
    loopDetector
}