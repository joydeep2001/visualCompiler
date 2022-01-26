const {    
    functionCallDetector,
    parameterDefinitionDetector,
    partialForLoopDetector,
    forloopDetector,
    whileloopDetector,
    ifDetector,
    elseDetector,
    elseIfDetector,
    variableDetector,
    expressionDetector
    
} = require('./regularExpression');


function Tokenizer(statements, self) {

    this.pendingTaskStack = [];
    this.lastTokenStack = [];
    this.tokenizeBody = (startOfBody, functionName)=> {
        
        let currentPos = startOfBody;
        console.log("In function " + functionName);
        for(let i = 0;i < statements.length;i++) {
            let statement = statements[i];
            if(statement.match(partialForLoopDetector)) {
                console.log('for loop detected: ');
                let forLoopCondition = statements[i + 1];
                let temp = statements[i + 2].match(/.+\)/);
                
                //console.log(temp.split(','));
                
            }
            else if(statement.match(whileloopDetector)) {
                console.log('while loop detected: ');
            }
            else if(statement.match(elseIfDetector)) {
                console.log('else if detected: ');
            }
            else if(statement.match(ifDetector)) {
                console.log('if detected: ');
            }
            else if(statement.match(elseDetector)) {
                console.log('else detected: ');
            }
            else if(statement.match(functionCallDetector)) {
                console.log('function detected: ');
            }
            else if(statement.match(variableDetector)) {
                console.log('variable detected: ');
            }
            else if(statement.match(expressionDetector)) {
                console.log('expression detected: ');
            }
            else if(statement.match('break')) {
                console.log('break');
            }
            else if(statement.match('continue')) {
                console.log('continue');
            }
            else if(statement.match('return')) {
                console.log('return');
            }
            else if(statement.match('}')) {
                console.log('end of previous body detected: ');
            }
            else {
                console.log('cant detected it: ');
            }
            console.log(statement);
            currentPos += statement.length + 1; //adding one to count the semicolon
        }
    }
    this.tokenizeParameters = (column, func)=> {
    //console.log('line number', lineCount);
    // console.log('start column', column);
    //console.log(`Function name ${func[4]}\n Parameter ${func[6]}`);
    //console.log(func);
    let params;
    let paramsList = [];
    while(params = parameterDefinitionDetector.exec(func[0])) {
        //console.log(params);
        paramsList.push({
            name: params[4],
            datatype: params[1] + (params[2] ? params[2] : ''),
            startPosition: self.getLineColumn(params.index + column),
            endPosition: self.getLineColumn(parameterDefinitionDetector.lastIndex + column)

        });
    }
    console.log(paramsList);
    return paramsList;

    }
}

module.exports = {
    Tokenizer
}