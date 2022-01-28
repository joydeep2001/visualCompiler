import token from "./token2.sample";

export default class Interpreter {
  static virtualCallStack = new Array();
  static editor = null;
  static lastMark = null;
  static currentCall = "main";
  static init = self => {
    this.self = self;
  };
  static initCallStack = () => {
    const func = {
      name: "main",
      data: {},
    };
    console.log("self", this.self);
    this.virtualCallStack.push(func);
    this.self.setState({ top: 0 });
  };
  static readToken = () => {
    console.log(this.self.state.programCounter);
    this.currInstruction =
      token[this.currentCall]["body"][this.self.state.programCounter];

    console.log(this.currInstruction);
    if (this.currInstruction.type == "variable") {
      this.processVariable(
        this.currInstruction.name,
        this.currInstruction.initialValue,
        this.currInstruction.datatype
      );
    } else if (this.currInstruction.type == "expression") {
      this.processExpression(this.currInstruction.value);
    }
    this.updateMark();
    //this line will update UI
    this.self.setState(prevState => ({
      programCounter: prevState.programCounter + 1,
    }));
  };
  static processVariable = (name, value, datatype) => {
    // this.virtualCallStack[0].data[name] = { value, datatype };
    this.virtualCallStack[this.self.state.top].data[name] = { value, datatype };
    console.log("vs", this.virtualCallStack);
  };
  static processExpression = expression => {
    console.log("expression");
    let activeStackFrame = this.virtualCallStack[this.self.state.top].data;
    let operandExp = /\w+/g;
    let operand;
    let modifiedExpression = "";
    let start = 0;
    while ((operand = operandExp.exec(expression))) {
      for (let i = start; i < operand.index; i++)
        modifiedExpression += operand.input[i];
      let variableName = operand[0];

      modifiedExpression += variableName.replace(
        operand[0],
        `activeStackFrame['${operand[0]}'].value`
      );
      start = operandExp.lastIndex;
      console.debug(start);
      console.log(modifiedExpression);
    }
    console.log(modifiedExpression);

    console.log(eval(modifiedExpression));
  };

  static updateMark = () => {
    console.log(this.editor);
    if (this.self.lastMark) this.self.lastMark.clear();
    this.self.lastMark = this.editor.markText(
      this.currInstruction.from,
      this.currInstruction.to,
      { className: "codemirror-highlighted" }
    );
  };
}
//test area
// setTimeout(() => {
//   console.log(Interpreter.self);
// Interpreter.processExpression("a = b * c + k");
//   Interpreter.initCallStack();
//   Interpreter.processVariable("a", 5, "int");
//   Interpreter.processVariable("b", 7, "float");
// }, 1000);
