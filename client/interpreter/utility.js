const {code} = require('./code.sample.js');
const {
    includeDetector,
    macroDefinitionDetector,
    functionCallDetector,
    functionSignatureDetector,
    variableDefinitionDetector,
    loopDetector
} = require('./regularExpression');

console.log(functionSignatureDetector);

function CLikeInterpreterUtilities(code) {
    this.getMacroMap = () => {
        let matcheMap = new Map();
        let matches;
        while(matches = macroDefinitionDetector.exec(code)) {
            matcheMap.set(matches[1], matches[2]);
        }
        return matcheMap;
    }
    function getEndIndex(params) {
        let length = 0;
        for(let i = 1;i < 4;i++) {
            
            if(params[i]) {
                length += params[i].length;
            } 
        }
        return length;
    } 
    
    function tokenizeParameters(lineCount, column, func) {
        //console.log('line number', lineCount);
        // console.log('start column', column);
        //console.log(`Function name ${func[4]}\n Parameter ${func[6]}`);
        //console.log(func);
        let params;
        let paramsList = [];
        while(params = variableDefinitionDetector.exec(func[0])) {
            //console.log(params);
            paramsList.push({
                name: params[4],
                datatype: params[1] + (params[2] ? params[2] : ''),
                line: lineCount,
                startColumn: params.index + column,
                endColumn: getEndIndex(params)

            });
        }
        //console.log(paramsList);
        return paramsList;
        
    }
    function extractBody(functionSignEndsAt) {
        
        let startOfBody = functionSignEndsAt;
        for(;code[startOfBody] != '{';startOfBody++);

        let braceBalance = 1;
        let endOfBody = startOfBody + 1
        for(;braceBalance !== 0;endOfBody++) {
            if(code[endOfBody] == '{') braceBalance++;
            else if(code[endOfBody] == '}') braceBalance--;
        }
        console.log(startOfBody, endOfBody);
        return {
            startOfBody,
            endOfBody
        }

    }
    function tokenizeBody(startOfBody, endOfBody, functionName) {
        let functionBody = '';
        for(let i = startOfBody;i < endOfBody;i++) {
            functionBody += code[i];
        }
        let statements = functionBody.split(';');
        let currentPos = startOfBody;
        console.log("In function " + functionName);
        statements.forEach(statement => {
            if(statement.match(loopDetector)) {
                console.log('loop at ' + currentPos);
            }
            else if(statement.match(functionCallDetector)) {
                console.log('function call at' + currentPos);
            }
            else if(statement.match(variableDefinitionDetector)) {
                console.log("variable at " + currentPos);
            }
            else {
                console.log(statement);
            }
            currentPos += statement.length + 1; //adding one to count the semicolon
        });
    }
    this.createFunctionMap = () => {
        let temp = '';
        let lastFunctionEndIndex = 0;
        let lineCount = 1;
        let lastLineEndIndex = 1;
        let column = 1;
        let startIndexOfFunction;
        let functionMap = new Map();
        for(let i = 0;i < code.length;i++) {
            temp += code[i];
            column++;
            if(func = temp.match(functionSignatureDetector)) {
                startIndexOfFunction = lastFunctionEndIndex + func.index + 1;
                let startColumn = startIndexOfFunction - lastLineEndIndex;
                temp = '';
                lastFunctionEndIndex = i + 1;
                tokenizeParameters(lineCount, startColumn, func);
                const {
                    startOfBody,
                    endOfBody
                } = extractBody(i);
                let funcName = func[4];
                tokenizeBody(startOfBody, endOfBody, funcName);
            }
            if(code[i] == '\n') {
                lineCount++;
                column = 1; 
                lastLineEndIndex = i + 1;
            }         
        }
        if(temp != '') lineCount++;

        //console.log(lineCount);
    }

    
}

let inpr = new CLikeInterpreterUtilities(code); 
//inpr.getMacroMap();
inpr.createFunctionMap();