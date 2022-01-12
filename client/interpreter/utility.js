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
        console.log(code[functionSignEndsAt]);
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
   
    this.indexVsLine = [0];
    this.mapIndexVsLine = () => {
        for(let i = 0;i < code.length;i++) {
            if(code[i] == '\n') {
                this.indexVsLine.push(i);
            }
        }
        let lastIndex = code.length - 1;
        if(code[lastIndex] != '\n') this.indexVsLine.push(lastIndex);
        //console.log(this.indexVsLine);

    }
    this.getLineColumn = (index) => {
        for(let i = 1;i < this.indexVsLine.length;i++) {
            if(index <= this.indexVsLine[i]) {
                console.log(i, index - this.indexVsLine[i - 1] + 1);
                return {
                    line: i,
                    column: index - this.indexVsLine[i - 1] + 1
                }
                
            }
        }
        console.log("invalid index");
    }

    this.createFunctionMap = () => {
        while(func = functionSignatureDetector.exec(code)) {
            // console.log('starts at ', func.index);
            console.log('ends at', functionSignatureDetector.lastIndex - 1);
            //console.log(func[0][func[0].length - 1]);
            extractBody(functionSignatureDetector.lastIndex - 1);
        }

    }

    
}

let inpr = new CLikeInterpreterUtilities(code); 
//inpr.getMacroMap();
inpr.mapIndexVsLine();

inpr.createFunctionMap();