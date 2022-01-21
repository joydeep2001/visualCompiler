const dataType = '((?:\\w+\\**\\s+\\**)+)(\\s*\\**)*';
const identifier = '(\\w+)'; 
const parameters = '\\((.*\\n*.*)\\)';
const optionalWhiteSpace = '\\s*\\t*\\n*';



const includeDetector = /#include.+/gm;
const macroDefinitionDetector = /#define\s(\w+)\s+(.+)/g;
const functionSignatureDetector = new RegExp(`${dataType}(${optionalWhiteSpace})${identifier}(${optionalWhiteSpace})${parameters}${optionalWhiteSpace}\\{`, 'gm');
const functionCallDetector = new RegExp(optionalWhiteSpace + identifier + parameters, 'gm');
const parameterDefinitionDetector = new RegExp(`${dataType}(${optionalWhiteSpace})${identifier}${optionalWhiteSpace}[,\\)][^\\(]`, 'gm');
// const multiVariableDefinationDetector = new RegExp(`(int)\*?\s((\w+(\[(\d+|\w+)\])?(\s*?=\s*(\d+|'.+|".+"|\w+|\{.\}))?\s*[,;]\s*)+)`);
const whileloopDetector = new RegExp(`while${optionalWhiteSpace}${parameters}`);
const forloopDetector = new RegExp(`for${optionalWhiteSpace}${parameters}`);
const ifDetector = new RegExp(`if${optionalWhiteSpace}${parameters}`);
const elseIfDetector = new RegExp(`else if${optionalWhiteSpace}${parameters}`);
const elseDetector = new RegExp(`else if${optionalWhiteSpace}${parameters}`);

console.log('functionSignatureDetector', functionSignatureDetector);
console.log('functionCallDetector', functionCallDetector);
console.log('parameterDefinitionDetector', parameterDefinitionDetector);
console.log('whileloopDetector', whileloopDetector);
console.log('forloopDetector', forloopDetector);
console.log('if detector', ifDetector);
console.log('else if detector', elseIfDetector);
console.log('else detector', elseDetector);


module.exports = {
    includeDetector,
    macroDefinitionDetector,
    functionCallDetector,
    functionSignatureDetector,
    parameterDefinitionDetector,
    whileloopDetector
}