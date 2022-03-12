//const express = require("express");
const {
  functionCallDetector,
  functionParamsDetector,
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

function Tokenizer(statements, self, functionName) {
  this.lastTokenStack = [];
  this.statementDetails = null;
  this.from = null;
  this.to = null;
  this.flowGraph = [];
  this.unspecifiedJumps = [];
  this.currentPos = 0;
  this.tokenizeBody = (startOfBody, firstStatementIndex) => {
    this.currentPos = startOfBody;

    console.log("In function " + functionName);
    for (let i = firstStatementIndex; i < statements.length; i++) {
      let statement = statements[i];
      if ((this.statementDetails = statement.match("}"))) {
        console.log("end of previous body detected: ");
        // statements[i] = statements[i].slice(this.statementDetails[0].length);
        statements[i] = statements[i].replace("}", " ");

        console.log(">>>", statement[0].length);
        //this.flowGraph.forEach((el, index) => console.log(index, el));
        return i;
      }
      if (statement.match(partialForLoopDetector)) {
        console.log("for loop detected: ");
        i = this.tokenizeForLoop(i);
      } else if ((this.statementDetails = statement.match(whileloopDetector))) {
        console.log("while loop detected: ");
        i = this.tokenizeWhileLoop(i);
      } else if ((this.statementDetails = statement.match(ifDetector))) {
        i = this.tokenizeIfElseLadder(i);
      } else if (
        (this.statementDetails = statement.match(returnStatementDetector))
      ) {
        this.tokenizeReturnStatement();
      } else if (
        (this.statementDetails = statement.match(functionCallDetector))
      ) {
        this.tokenizeFunctionCall();
      } else if (
        (this.statementDetails = statement.match(expressionDetector))
      ) {
        this.tokenizeExpression();
      } else if ((this.statementDetails = statement.match(variableDetector))) {
        this.tokenizeVariable();
      } else if (statement.match("break")) {
        console.log("break");
      } else if (statement.match("continue")) {
        console.log("continue");
      } else {
        console.log("cant detected it: ");
        console.log(statement);
      }

      //console.log(statement);
    }
    console.log("flow graph");
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
    //let args = this.statementDetails[2].split(",").map(arg => arg.trim());
    //todo => add separate arguments functions here..
    let rawArg = this.statementDetails[2];
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
          args: rawArg, //raw args should be replaced with args after adding the proper split function for args
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
    while ((params = functionParamsDetector.exec(func[0]))) {
      //console.log(params);
      paramsList.push({
        name: params[4],
        datatype: params[1] + (params[2] ? params[2] : ""),
        from: self.getLineColumn(params.index + column),
        to: self.getLineColumn(functionParamsDetector.lastIndex + column),
      });
    }
    console.log(paramsList);
    return paramsList;
  };
  this.tokenizeForLoopInitialization = statement => {
    this.statementDetails = statement.match(/\(.+/);
    this.setFromTo();
    this.currentPos++; //for counting the semicolon
    this.flowGraph.push(
      new ExpressionWrapper(
        this.statementDetails[0].slice(1),
        this.from,
        this.to
      )
    );
  };
  this.tokenizeCondition = condition => {
    this.from = self.getLineColumn(this.currentPos);
    this.currentPos += condition.length;
    this.to = self.getLineColumn(this.currentPos);
    this.currentPos++; //for semicolon
    this.flowGraph.push(new ConditionWrapper(condition, this.from, this.to));
    return this.flowGraph.length - 1;
  };
  this.tokenizeForLoopIncrementDecrement = (statement, pendingTaskArr) => {
    this.statementDetails = statement.match(/.+\)/);
    let incrementDecrement = this.statementDetails[0].slice(0, -1);
    this.setFromTo();
    this.currentPos++; //for closing bracket
    pendingTaskArr.push(
      new ExpressionWrapper(incrementDecrement, this.from, this.to)
    );
    let firstStatementOfForLoopBody = statement.slice(
      incrementDecrement.length + 1
    );
    return firstStatementOfForLoopBody;
  };
  this.tokenizeForLoop = i => {
    let pendingTaskArr = [];
    this.tokenizeForLoopInitialization(statements[i]);
    let conditionIndexInFlowGraph = this.tokenizeCondition(statements[++i]);
    let firstStatementOfForLoopBody = this.tokenizeForLoopIncrementDecrement(
      statements[++i],
      pendingTaskArr
    );
    statements[i] = firstStatementOfForLoopBody;
    if (!statements[i].match("{")) {
      statements[i + 1] = "}".concat(statements[i + 1]);
      this.currentPos--; //to uncount the explicitly added '}'
    }

    let bodyEndsAtIndex = this.tokenizeBody(this.currentPos, i) - 1;

    pendingTaskArr.forEach(token => this.flowGraph.push(token));
    this.flowGraph.push({
      type: "jump",
      /*because i is currently holding the index of increment-decrement token, 
      so i - 1 will be the index of condition token*/
      instruction: i - 1,
    });
    this.flowGraph[conditionIndexInFlowGraph].nextIfFalse =
      this.flowGraph.length;

    return bodyEndsAtIndex;
  };
  this.tokenizeWhileLoop = i => {
    let conditionStartsAtIndex = statements[i].match(/\(/).index;
    this.currentPos += conditionStartsAtIndex;
    let conditionIndexInFlowGraph = this.tokenizeCondition(
      this.statementDetails[1]
    );
    if (!statements[i].match("{")) {
      statements[i + 1] = "}".concat(statements[i + 1]);
      this.currentPos--; //to uncount the explicitly added '}'
    }
    let bodyStartsAt = statements[i].match(/\)/);
    console.log(bodyStartsAt);
    statements[i] = statements[i].slice(bodyStartsAt.index + 1);
    console.log(">>>", statements[i]);
    let bodyEndsAtIndex = this.tokenizeBody(this.currentPos, i) - 1;
    this.flowGraph.push({
      type: "jump",
      /*because i is currently holding the index condition token*/
      instruction: i,
    });

    this.flowGraph[conditionIndexInFlowGraph].nextIfFalse =
      this.flowGraph.length;

    return bodyEndsAtIndex;
  };
  this.addEndOfCurlyBraceAtBegining = i => {
    statements[i] = "}".concat(statements[i]);
    this.currentPos--; //to uncount the explicitly added '}'
  };
  this.tokenizeIfElseLadder = i => {
    let conditionStartsAtIndex = statements[i].match(/\(/).index;
    this.currentPos += conditionStartsAtIndex;

    let conditionIndexInFlowGraph = this.tokenizeCondition(
      this.statementDetails[1]
    );
    if (!statements[i].match("{")) {
      this.addEndOfCurlyBraceAtBegining(i + 1);
    }
    let bodyStartsAt = statements[i].match(/\)/);
    statements[i] = statements[i].slice(bodyStartsAt.index + 1);
    console.log("if body", statements[i]);
    let bodyEndsAtIndex = this.tokenizeBody(this.currentPos, i) - 1;
    i = bodyEndsAtIndex + 1;

    this.flowGraph.push({
      type: "jump",
      instruction: null,
    });
    let prevUnspecifiedJump = this.flowGraph.length - 1;
    this.flowGraph[conditionIndexInFlowGraph].nextIfFalse =
      this.flowGraph.length + 1;

    this.unspecifiedJumps.push(bodyEndsAtIndex);
    if ((this.statementDetails = statements[i].match(elseIfDetector))) {
      i = this.tokenizeIfElseLadder(i);
    } else if ((this.statementDetails = statements[i].match(elseDetector))) {
      if (!statements[i].match("{")) {
        this.addEndOfCurlyBraceAtBegining(i + 1);
      }
      i = this.tokenizeBody(this.currentPos, i);
      this.flowGraph.push({
        type: "jump",
        instruction: null,
      });
      this.flowGraph[this.flowGraph.length - 1].instruction =
        this.flowGraph.length;
    }
    this.flowGraph[prevUnspecifiedJump].instruction = this.flowGraph.length;
    //console.log(this.flowGraph);
    return i;
  };
}

module.exports = {
  Tokenizer,
};
