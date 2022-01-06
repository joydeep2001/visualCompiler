const dataType = '((?:\\w+\\**\\s+\\**)+)(\\s*\\**)*';
const identifier = '(\\w+)'; 
const functionParameters = '\\((.*)\\)';
const functionBody = '\\{((\\n|.)*)\\}';
const optionalWhiteSpace = '\\s*\\t*\\n*';
const initialization = '';


const includeDetector = /#include.+/gm;
const macroDefinitionDetector = /#define\s(\w+)\s+(.+)/g;
const functionSignatureDetector = new RegExp(`${dataType}(${optionalWhiteSpace})${identifier}(${optionalWhiteSpace})${functionParameters}${optionalWhiteSpace}[^;]`, 'm');
const functionCallDetector = new RegExp(optionalWhiteSpace + identifier + functionParameters, 'gm');
const variableDefinitionDetector = new RegExp(`${dataType}(${optionalWhiteSpace})${identifier}${optionalWhiteSpace}[,=;\)][^\(]`, 'g');

console.log(variableDefinitionDetector);

module.exports = {
    includeDetector,
    macroDefinitionDetector,
    functionCallDetector,
    functionSignatureDetector,
    variableDefinitionDetector
}