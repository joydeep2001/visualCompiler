const {code} = require('./code.sample.js');
const {
    includeDetector,
    macroDefinitionDetector,
    functionDefinationDetector,
    functionDeclarationDetector,
    functionCallDetector
} = require('./regularExpression');

console.log(functionDefinationDetector);

function CLikeInterpreterUtilities(code) {
    this.getMacroMap = () => {
        let matcheMap = new Map();
        let matches;
        while(matches = macroDefinitionDetector.exec(code)) {
            matcheMap.set(matches[1], matches[2]);
        }
        return matcheMap;
    }
    
    this.createFunctionMap = () => {
        let temp = '';
        let lastIndex = 1;
        let lineCount = 1;
        let lastLineEndIndex = 0;
        let column = 1;
        let functionMap = new Map();
        for(let i = 0;i < code.length;i++) {
            temp += code[i];
            column++;
            if(func = temp.match(functionDefinationDetector)) {
                console.log('start index ', lastIndex + func.index);
                console.log(`Function name ${func[1]}\n Parameter ${func[2]}\n Body ${func[3]}`);
                temp = '';
                console.log(lineCount);
                lastIndex = i;
            }
            if(code[i] == '\n') {
                lineCount++;
                column = 1; 
                lastLineEndIndex = i;
            }         
        }
        if(temp != '') lineCount++;

        console.log(lineCount);
    }

    
}

let inpr = new CLikeInterpreterUtilities(code); 
//inpr.getMacroMap();
inpr.createFunctionMap();