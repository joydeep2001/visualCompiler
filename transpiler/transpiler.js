const keywards = {
    datatypes: ['int', 'float', 'double', 'char'],
    datatypeExtender: ['short', 'unsigned', 'long', 'long long'],
    
    userDefinedDatatype: /'struct (.+) {'/
}

//Preprocessor Directives
    //Detect
    //Transpile
    

    const dataTypeExpression = '(?:\\w+\\**\\s+\\**)+(?:\\s*\\**\\s*)*';
    const identifierExpression = '(\\w+)\\s*'; 
    const functionParametersExpression = '(\\(.*\\))';
    const whiteSpaceExpression = '^\\s*\\t*';
    //const initializationExpression = ;


    const includeDetector = /#include.+/gm;
    const macroDefinitionDetector = /#define\s(\w+)\s+(.+)/;
    const functionDefinationDetector = new RegExp(whiteSpaceExpression + dataTypeExpression + identifierExpression + functionParametersExpression + '[^;?]', 'gm');
    const functionDeclarationDetector = new RegExp(whiteSpaceExpression + dataTypeExpression + identifierExpression + functionParametersExpression + ';', 'gm');
    const functionCallDetector = new RegExp(whiteSpaceExpression + identifierExpression + functionParametersExpression, 'gm');
    //const variableDefinitionDetector1 = new RegExp(whiteSpaceExpression + identifierExpression);
    //const variableDefinitionDetector2 = new RegExp(whiteSpaceExpression + identifierExpression + initializationExpression);
    let code = 
    `#include<stdio.h>
    #include<conio.h>
    #define X 10
    #include<stdlib.h>
        void print (int a);
        void print (int a, float* d)
    {
       printf("%d", a);
       printf("%d", X);
    
    }
    long int x (){
    
    }
    long long x(){

    }
    int main()
    {
       int *a = 7;
       print(a);
    }
    double * fun(){
    somecode
    
    }`;
    //console.log(code);
    console.log(whiteSpaceExpression + identifierExpression + functionParametersExpression);
    console.log(code = code.replace(includeDetector, ''));
    console.log(code.match(macroDefinitionDetector));
    console.log(code = code.replace(functionDefinationDetector, 'function $1$2'));
    console.log(code = code.replace(functionDeclarationDetector, ''));
    console.log(code.match(functionCallDetector));
//Function Defination
    //Detect
    //Transpile


//Function Declaration
    //Detect
    //transpile
//Variable
    //Detect 
    //Transpile


//