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

//temporary array
const libFunctions = ["printf", "scanf"];

function ExpressionWrapper(expression, from, to) {
  this.type = "expression";
  this.value = expression;
  this.from = from;
  this.to = to;
}
function ConditionWrapper(condition, from, to) {
  this.type = "condition";
  this.value = condition;
  this.nextIfFalse = null;
  this.from = from;
  this.to = to;
}

function VariableWrapper(variableDetails, from, to) {
  this.name = variableDetails[3];
  this.datatype =
    variableDetails[1] + (variableDetails[2] ? variableDetails[2] : "");
  this.from = from;
  this.to = to;
}

function ReturnWrapper(returnDetails, from, to) {
  this.type = "return";
  this.value = `$=${returnDetails.value}`;
  this.returnType = returnDetails.returnType;
  this.from = from;
  this.to = to;
}

function Tokenizer(statements, self) {
  this.pendingTaskStack = [];
  this.lastTokenStack = [];

  this.flowGraph = [];
  this.tokenizeBody = (startOfBody, functionName) => {
    let currentPos = startOfBody;

    console.log("In function " + functionName);
    for (let i = 0; i < statements.length; i++) {
      let statement = statements[i];
      let statementDetails;
      let from, to;
      if ((statementDetails = statement.match(partialForLoopDetector))) {
        console.log("for loop detected: ");

        //tokenize inititalization of for loop
        let initialization = statement.match(/\(.+/);
        currentPos += initialization.index;
        console.log(currentPos);
        from = self.getLineColumn(currentPos);
        currentPos += initialization[0].length;
        to = self.getLineColumn(currentPos);
        currentPos++; //for counting the semicolon
        this.flowGraph.push(
          new ExpressionWrapper(initialization[0].slice(1), from, to)
        );
        console.log(currentPos);

        //tokenize condition of for loop
        let condition = statements[i + 1];
        from = self.getLineColumn(currentPos);
        currentPos += condition.length;
        to = self.getLineColumn(currentPos);
        currentPos++;
        this.flowGraph.push(new ConditionWrapper(condition, from, to));
        this.lastTokenStack.push(i + 1); //pushing the index of condition of the loop

        //tokenize increment decrement
        let incrementDecrementDetails = statements[i + 2].match(/.+\)/);
        let incrementDecrement = incrementDecrementDetails[0].slice(0, -1);
        from = self.getLineColumn(currentPos);
        currentPos += incrementDecrement.length;
        to = self.getLineColumn(currentPos);
        currentPos++; //for closing bracket

        this.pendingTaskStack.push(
          new ExpressionWrapper(incrementDecrement, from, to)
        );
        console.log(this.pendingTaskStack);

        console.log(this.flowGraph);
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
        (statementDetails = statement.match(returnStatementDetector))
      ) {
        console.log(statementDetails);

        currentPos += statementDetails.index;
        console.log(currentPos);
        from = self.getLineColumn(currentPos);
        currentPos += statementDetails[0].length;
        to = self.getLineColumn(currentPos);
        currentPos++; //for counting the semicolon
        this.flowGraph.push(
          new ReturnWrapper(
            {
              value: statementDetails[1],
              returnType: "int", //explicitly setting for temporary purpose
            },
            from,
            to
          )
        );
        console.log(this.flowGraph);
      } else if ((statementDetails = statement.match(functionCallDetector))) {
        console.log("function detected: ");
        console.log(statementDetails);
      } else if ((statementDetails = statement.match(variableDetector))) {
        console.log("variable detected: ");
        currentPos += statementDetails.index;
        from = self.getLineColumn(currentPos);
        currentPos += statement.length - statementDetails.index;
        to = self.getLineColumn(currentPos);
        currentPos++;
        console.log(statementDetails);
        this.flowGraph.push(new VariableWrapper(statementDetails, from, to));
      } else if (statement.match(expressionDetector)) {
        console.log("expression detected: ");
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
      //currentPos += statement.length + 1; //adding one to count the semicolon
    }
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
