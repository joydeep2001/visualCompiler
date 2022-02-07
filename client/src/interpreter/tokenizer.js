const express = require("express");
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
  expressionDetector,
  returnStatementDetector,
} = require("./regularExpression");

const {
  ExpressionWrapper,
  ConditionWrapper,
  VariableWrapper,
  ReturnWrapper,
  FunctionWrapper,
  LibFunctionWrapper,
} = require("./tokenWrappers");

//debugging

//temporary array
const libFunctions = ["printf", "scanf"];

function Tokenizer(statements, self) {
  pendingTaskStack = [];
  lastTokenStack = [];
  this.statementDetails;
  this.from, this.to;
  this.flowGraph = [];
  this.currentPos;
  this.tokenizeBody = (startOfBody, functionName) => {
    this.currentPos = startOfBody;

    console.log("In function " + functionName);
    for (let i = 0; i < statements.length; i++) {
      let statement = statements[i];
      if ((this.statementDetails = statement.match(partialForLoopDetector))) {
        console.log("for loop detected: ");

        //tokenize inititalization of for loop
        let initialization = statement.match(/\(.+/);
        this.currentPos += initialization.index;
        console.log(this.currentPos);
        this.from = self.getLineColumn(this.currentPos);
        this.currentPos += initialization[0].length;
        this.to = self.getLineColumn(this.currentPos);
        this.currentPos++; //for counting the semicolon
        this.flowGraph.push(
          new ExpressionWrapper(initialization[0].slice(1), this.from, to)
        );
        console.log(this.currentPos);

        //tokenize condition of for loop
        let condition = statements[i + 1];
        this.from = self.getLineColumn(this.currentPos);
        this.currentPos += condition.length;
        this.to = self.getLineColumn(this.currentPos);
        this.currentPos++;
        this.flowGraph.push(new ConditionWrapper(condition, this.from, to));
        this.lastTokenStack.push(i + 1); //pushing the index of condition of the loop

        //tokenize increment decrement
        let incrementDecrementDetails = statements[i + 2].match(/.+\)/);
        let incrementDecrement = incrementDecrementDetails[0].slice(0, -1);
        this.from = self.getLineColumn(this.currentPos);
        this.currentPos += incrementDecrement.length;
        this.to = self.getLineColumn(this.currentPos);
        this.currentPos++; //for closing bracket

        this.pendingTaskStack.push(
          new ExpressionWrapper(incrementDecrement, this.from, to)
        );
        console.log(this.pendingTaskStack);

        //console.log(this.flowGraph);
        if (incrementDecrement) {
          let firstBodyToken = statements[i + 2].slice(
            incrementDecrement.length - 1
          );
          if (firstBodyToken.match("{")) console.log("multiline body");
          else console.log("single lined body");
          console.log(firstBodyToken);
        }

        i += 2;
        //console.log(temp.split(','));
      } else if (statement.match(whileloopDetector)) {
        console.log("while loop detected: ");
      } else if (statement.match(elseIfDetector)) {
        console.log("else if detected: ");
      } else if (statement.match(ifDetector)) {
        console.log("if detected: ");
      } else if (statement.match(elseDetector)) {
        console.log("else detected: ");
      } else if (
        (this.statementDetails = statement.match(returnStatementDetector))
      ) {
        this.tokenizeReturnStatement();
      } else if (
        (this.statementDetails = statement.match(functionCallDetector))
      ) {
        this.tokenizeFunctionCall();
      } else if ((this.statementDetails = statement.match(variableDetector))) {
        this.tokenizeVariable();
      } else if (
        (this.statementDetails = statement.match(expressionDetector))
      ) {
        this.tokenizeExpression();
      } else if (statement.match("break")) {
        console.log("break");
      } else if (statement.match("continue")) {
        console.log("continue");
      } else if (statement.match("}")) {
        console.log("end of previous body detected: ");
      } else {
        console.log("cant detected it: ");
      }
      console.log(statement);
    }
    console.log(this.flowGraph);
  };
  //sets the starting and the ending position of a token
  this.setFromTo = () => {
    this.currentPos += this.statementDetails.index;
    this.from = self.getLineColumn(this.currentPos);
    this.currentPos += this.statementDetails[0].length;
    this.to = self.getLineColumn(this.currentPos);
  };
  this.tokenizeFunctionCall = () => {
    console.log("function detected: ");
    console.log(this.statementDetails);
    let functionName = this.statementDetails[1].trim();
    let args = this.statementDetails[2].split(",").map(arg => arg.trim());
    this.setFromTo();
    this.currentPos++; //for semicolon
    let type = "function_call";
    if (libFunctions.find(name => name == functionName)) {
      type = "lib_function_call";
    }
    this.flowGraph.push(
      new FunctionWrapper(
        {
          type,
          functionName,
          args,
        },
        this.from,
        this.to
      )
    );
  };
  this.tokenizeVariable = () => {
    console.log("variable detected: ");
    this.setFromTo();
    this.currentPos++; //for semicolon
    console.log(this.statementDetails);
    this.flowGraph.push(
      new VariableWrapper(this.statementDetails, this.from, this.to)
    );
  };
  this.tokenizeExpression = () => {
    console.log("expression detected: ");
    console.log(this.statementDetails);
    let expression = this.statementDetails[0].trim();
    this.setFromTo();
    this.currentPos++; //for semicolon
    this.flowGraph.push(new ExpressionWrapper(expression, this.from, this.to));
  };
  this.tokenizeReturnStatement = () => {
    console.log(this.statementDetails);
    this.setFromTo();
    this.currentPos++; //for counting the semicolon
    this.flowGraph.push(
      new ReturnWrapper(
        {
          value: this.statementDetails[1],
          returnType: "int", //explicitly setting for temporary purpose
        },
        this.from,
        this.to
      )
    );
  };
  this.tokenizeParameters = (column, func) => {
    //console.log('line number', lineCount);
    // console.log('start column', column);
    //console.log(`Function name ${func[4]}\n Parameter ${func[6]}`);
    //console.log(func);
    let params;
    let paramsList = [];
    while ((params = parameterDefinitionDetector.exec(func[0]))) {
      //console.log(params);
      paramsList.push({
        name: params[4],
        datatype: params[1] + (params[2] ? params[2] : ""),
        from: self.getLineColumn(params.index + column),
        to: self.getLineColumn(parameterDefinitionDetector.lastIndex + column),
      });
    }
    console.log(paramsList);
    return paramsList;
  };
}

module.exports = {
  Tokenizer,
};
