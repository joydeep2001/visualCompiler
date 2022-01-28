import token from "./token2.sample";

export default class Interpreter {
  static currentCall = "main";
  static init = self => {
    this.self = self;
  };
  static readToken = () => {
    console.log(this.self.state.programCounter);
    this.currInstruction =
      token[this.currentCall]["body"][this.self.state.programCounter];

    console.log(this.currInstruction);
    if (this.currInstruction.type == "variable") {
      this.processVariable();
    } else if (this.currInstruction.type == "expression") {
      this.processExpression(this.currInstruction.value);
    }
    this.updateMark();
    //this line will update UI
    this.self.setState(prevState => ({
      programCounter: prevState.programCounter + 1,
    }));
  };
  static processVariable = () => {
    this.self.virtualCallStack[this.self.state.top].data.push({
      name: this.currInstruction.name,
      value: this.currInstruction.initialValue,
    });
  };
  static processExpression = expression => {
    console.log("expression");
    //let activeStackFrame = this.self.virtualCallStack.data[this.self.state.top];
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
    console.log(this.self.editor);
    if (this.self.lastMark) this.self.lastMark.clear();
    this.self.lastMark = this.self.editor.markText(
      this.currInstruction.from,
      this.currInstruction.to,
      { className: "codemirror-highlighted" }
    );
  };
}
//test area
setTimeout(() => {
  Interpreter.processExpression("a = b * c + k");
}, 1);
