const dataType = '(?:\\w+\\**\\s+\\**)+(?:\\s*\\**\\s*)*';
const identifier = '(\\w+)\\s*'; 
const functionParameters = '\\((.*)\\)';
const functionBody = '\\{((\\n|.)*)\\}';
const whiteSpace = '\\s*\\t*\\n*';
const initialization = '';


const includeDetector = /#include.+/gm;
const macroDefinitionDetector = /#define\s(\w+)\s+(.+)/g;
const functionDefinationDetector = new RegExp(`${dataType}${identifier}${functionParameters}${whiteSpace}${functionBody}`, 'm');
const functionDeclarationDetector = new RegExp(whiteSpace + dataType + identifier + functionParameters + ';', 'gm');
const functionCallDetector = new RegExp(whiteSpace + identifier + functionParameters, 'gm');
//const variableDefinitionDetector1 = new RegExp(whiteSpaceExpression + identifierExpression);
//const variableDefinitionDetector2 = new RegExp(whiteSpaceExpression + identifierExpression + initializationExpression);
module.exports = {
    includeDetector,
    macroDefinitionDetector,
    functionDefinationDetector,
    functionDeclarationDetector,
    functionCallDetector
}