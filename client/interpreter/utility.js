let code = 
`#include<stdio.h>
#include<conio.h>
#define X 10
#define Y 20
#include<stdlib.h>
    void print (int a);
    void print (int a, float* d)
{
   printf("%d", a);
   printf("%d", X);

}
long int x (){
    int y;
}

int main()
{
   int *a = 7;
   print(a);
}
double * fun(){
 int z;

}`;




const keywards = {
    datatypes: ['int', 'float', 'double', 'char'],
    datatypeExtender: ['short', 'unsigned', 'long', 'long long'],
    
    userDefinedDatatype: /'struct (.+) {'/
}

//Preprocessor Directives
    //Detect
    //Transpile
    

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

    //console.log(code);
    // console.log(whiteSpaceExpression + identifier + functionParameters);
    // console.log(code = code.replace(includeDetector, ''));
    // console.log(code.match(macroDefinitionDetector));
    // console.log(code = code.replace(functionDefinationDetector, 'function $1$2'));
    // console.log(code = code.replace(functionDeclarationDetector, ''));
    // console.log(code.match(functionCallDetector));


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
        let lineCount = 1;
        let functionMap = new Map();
        for(let i = 0;i < code.length;i++) {
            temp += code[i];
            if(func = temp.match(functionDefinationDetector)) {
                console.log(`Function name ${func[1]}\n Parameter ${func[2]}\n Body ${func[3]}`);
                temp = '';
                console.log(lineCount);
                
            }
            if(code[i] == '\n') lineCount++;          
        }
        if(temp != '') lineCount++;

        console.log(lineCount);
    }

    
}

let inpr = new CLikeInterpreterUtilities(code); 
//inpr.getMacroMap();
inpr.createFunctionMap();