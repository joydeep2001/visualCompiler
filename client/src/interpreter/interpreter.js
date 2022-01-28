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
    //this.self.setState({ top: 0 });
  };
  static readToken = () => {
    console.log(this.self.state.programCounter);
    this.currInstruction =
      token[this.currentCall]["body"][this.self.state.programCounter];

    console.log(this.currInstruction);
    if (this.currInstruction.type == "variable") {
      this.processVariable(
        this.currInstruction.name,
        this.currInstruction.initialValue
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
  static processVariable = (name, value) => {
    //this.virtualCallStack[this.self.state.top].data[name] = value;
    console.log("vs", this.virtualCallStack);
  };
  static processExpression = expression => {
    console.log("expression");
    //let activeStackFrame = this.virtualCallStack.data[this.self.state.top];
    let activeStackFrame = {
      a: 10,
      b: 20,
      c: 35,
      k: 15,
    };
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
        `activeStackFrame['${operand[0]}']`
      );
      start = operandExp.lastIndex;
      console.debug(start);
      console.log(modifiedExpression);
    }
    console.log(modifiedExpression);
    eval(modifiedExpression);
    console.log(activeStackFrame.a);
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
setTimeout(() => {
  console.log(Interpreter.self);
  Interpreter.processExpression("a = b * c + k");
  Interpreter.initCallStack();
  Interpreter.processVariable("a", 5);
  Interpreter.processExpression("b", 7);
}, 1000);
