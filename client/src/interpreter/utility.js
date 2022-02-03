const {code} = require('./code2.sample.js');
const {Tokenizer} = require('./tokenizer');

const {
    includeDetector,
    macroDefinitionDetector,
    functionSignatureDetector,
    
} = require('./regularExpression');


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
    

    function extractBody(functionSignEndsAt) {
        
        let startOfBody = functionSignEndsAt;
        let braceBalance = 1;
        let endOfBody = startOfBody + 1
        for(;braceBalance !== 0;endOfBody++) {
            if(code[endOfBody] == '{') braceBalance++;
            else if(code[endOfBody] == '}') braceBalance--;
        }
        //console.log(startOfBody, endOfBody);
        let functionBody = '';
        for(let i = startOfBody;i < endOfBody;i++) {
            functionBody += code[i];
        }
        let statements = functionBody.split(';');
        return statements;
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
            //console.log('ends at', functionSignatureDetector.lastIndex - 1);
            //console.log(func[0][func[0].length - 1]);
            const startOfBody = functionSignatureDetector.lastIndex - 1;
            const statements = extractBody(startOfBody);
            //func[4] contains function name
            const {tokenizeBody, tokenizeParameters} = new Tokenizer(statements, this);
            tokenizeParameters(func.index, func);
            //tokenizeBody(startOfBody, statements, func[4]);
        }

    }

    
}

let inpr = new CLikeInterpreterUtilities(code); 
//inpr.getMacroMap();
inpr.mapIndexVsLine();

inpr.createFunctionMap();