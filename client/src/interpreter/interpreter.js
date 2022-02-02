import OutputBox from "../components/OutputBox";
import token from "./token2.sample";

export default class Interpreter {
  static virtualCallStack = new Array();
  static returnValueOfFunction = null;
  static editor = null;
  static lastMark = null;
  static tempReturnAddress = null;
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
    if (
      this.self.state.programCounter >= token[this.currentCall]["body"].length
    ) {
      this.virtualCallStack.pop();
      if (this.virtualCallStack.length === 0) {
        console.log("execution complete");
        this.self.setState(prevState => ({
          output: prevState.output + "\nExecution completed!!",
        }));
        return;
      }
    }
    this.currInstruction =
      token[this.currentCall]["body"][this.self.state.programCounter];

    console.log(this.currInstruction);
    if (this.currInstruction.type === "variable") {
      this.processVariable(this.currInstruction);
    } else if (this.currInstruction.type === "expression") {
      this.processExpression(this.currInstruction.value);
    } else if (this.currInstruction.type === "function_call") {
      this.processFunctionCall();
      return;
    } else if (this.currInstruction.type === "lib_function_call") {
    } else if (this.currInstruction.type === "return") {
      this.processReturn();
      return;
    }
    this.updateMark();
    //this line will update UI
    this.self.setState(prevState => ({
      programCounter: prevState.programCounter + 1,
    }));
  };
  static processVariable = ({ name, initialValue, datatype }) => {
    let top = this.virtualCallStack.length - 1;
    this.virtualCallStack[top].data[name] = {
      value: initialValue,
      datatype,
    };
    console.log("vs", this.virtualCallStack);
  };
  static processExpression = expression => {
    console.log("expression");
    let top = this.virtualCallStack.length - 1;
    let activeStackFrame = this.virtualCallStack[top].data;
    let operandExp = /\$|\w+/g;
    let operand;
    let modifiedExpression = "";
    let start = 0;
    while ((operand = operandExp.exec(expression))) {
      for (let i = start; i < operand.index; i++)
        modifiedExpression += operand.input[i];
      let variableName = operand[0];
      if (operand[0] == "$") {
        modifiedExpression += "this.returnValueOfFunction";
      } else {
        modifiedExpression += variableName.replace(
          operand[0],
          `activeStackFrame['${operand[0]}'].value`
        );
      }
      start = operandExp.lastIndex;
      console.debug(start);
      console.log(modifiedExpression);
    }
    console.log(modifiedExpression);

    console.log(eval(modifiedExpression));
  };
  static processFunctionCall = () => {
    let argQueue = [];
    this.currInstruction.args.forEach(arg => {
      argQueue.push(this.virtualCallStack[this.self.state.top].data[arg].value);
    });
    console.log(argQueue);
    this.currentCall = this.currInstruction.name;
    const func = {
      name: this.currentCall,
      data: {},
      returnAddress: this.self.state.programCounter + 1,
    };
    this.virtualCallStack.push(func);
    this.self.setState(prevState => ({ top: prevState.top + 1 }));
    const { parameters } = token[this.currentCall];
    if (parameters.length > 0) {
      parameters.forEach((param, index) => {
        let details = {
          name: param.name,
          initialValue: argQueue[index],
          datatype: param.datatype,
        };
        console.log(this.self.state.top);
        this.processVariable(details);
      });
    }
    this.self.setState({ programCounter: 0 });
  };
  static processReturn = () => {
    let top = this.virtualCallStack.length - 1;
    this.tempReturnAddress = this.virtualCallStack[top].returnAddress;
    this.currentCall = this.virtualCallStack[top - 1].name;
    console.log(this.tempReturnAddress);
    if (this.currInstruction.returnType !== "void") {
      this.processExpression(this.currInstruction.value);
      this.virtualCallStack.pop();
    }
    this.self.setState({ programCounter: this.tempReturnAddress });
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
