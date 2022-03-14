import OutputBox from "../components/OutputBox";
import { CLikeInterpreterUtilities } from "./utility";
//import token from "./token2.sample";
import Printf from "./c_lib_functions/printf";
import scanf from "./c_lib_functions/scanf";

export default class Interpreter {
  static virtualCallStack = [];
  static returnValueOfFunction = null;
  static editor = null;
  static lastMark = null;
  static tempReturnAddress = null;
  static currentCall = "main";
  static accumulator = 0;
  static inputMode;

  static init = (self, code) => {
    this.self = self;
  };
  static initCallStack = () => {
    this.virtualCallStack = [];
    this.currentCall = "main";
    this.accumulator = 0;
    this.tempReturnAddress = null;
    this.lastMark = null;
    this.returnValueOfFunction = null;
    this.inputMode = false;
    const func = {
      name: "main",
      data: {},
    };
    console.log("self", this.self);
    this.virtualCallStack.push(func);
    this.self.setState({ top: 0 });
  };
  static tokenizeCode = code => {
    let tokenizer = new CLikeInterpreterUtilities(code);
    tokenizer.mapIndexVsLine();
    this.token = tokenizer.createFunctionMap();
  };
  static readToken = () => {
    let lastIndex = this.self.inputBuffer.length - 1;
    if (this.self.inputBuffer[lastIndex] !== "\n" && this.inputMode) {
      alert("please input the values");
      return;
    }
    console.log(this.self.state.programCounter);
    if (
      this.self.state.programCounter >=
      this.token[this.currentCall]["body"].length
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
      this.token[this.currentCall]["body"][this.self.state.programCounter];

    console.log(this.currInstruction);
    if (this.currInstruction.type === "variable") {
      this.processVariable(this.currInstruction);
    } else if (this.currInstruction.type === "expression") {
      this.processExpression(this.currInstruction.value);
    } else if (this.currInstruction.type === "function_call") {
      this.processFunctionCall();
      return;
    } else if (this.currInstruction.type === "lib_function_call") {
      this.processLibFuncCall();
    } else if (this.currInstruction.type === "return") {
      this.processReturn();
      return;
    } else if (this.currInstruction.type === "condition") {
      this.processCondition();
      return;
    }
    this.updateMark();
    //this line will update UI
    if (this.currInstruction.type === "jump") {
      this.self.setState(prevState => ({
        programCounter: this.currInstruction.instruction,
      }));
      return;
    }
    this.self.setState(prevState => ({
      programCounter: prevState.programCounter + 1,
    }));
  };
  static processLibFuncCall() {
    let top = this.virtualCallStack.length - 1;
    let activeStackFrame = this.virtualCallStack[top].data;
    //let inputBuffer = this.self.inputBuffer;
    if (this.currInstruction.name === "printf") {
      let printf = new Printf(this.currInstruction.args, activeStackFrame);
      let stdout = printf.print();
      console.log(stdout);
      this.self.setState(prevState => ({
        output: prevState.output + stdout,
      }));
    } else if (this.currInstruction.name === "scanf") {
      this.inputMode = true;
      scanf(
        this.currInstruction.args,
        this.self,
        activeStackFrame,
        this.exitInputMode
      );
    }
  }
  static exitInputMode = () => {
    this.inputMode = false;
    this.self.inputBuffer = "";
  };
  static processCondition = () => {
    this.processExpression(this.currInstruction.value);
    if (this.accumulator) {
      this.updateMark();
      this.self.setState(prevState => ({
        programCounter: prevState.programCounter + 1,
      }));

      return;
    }
    this.updateMark();
    this.self.setState({ programCounter: this.currInstruction.nextIfFalse });
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
    let operandDetails = null;
    let modifiedExpression = "";
    let start = 0;
    while ((operandDetails = operandExp.exec(expression))) {
      for (let i = start; i < operandDetails.index; i++)
        modifiedExpression += operandDetails.input[i];
      let operand = operandDetails[0];
      if (operand == "$") {
        modifiedExpression += "this.returnValueOfFunction";
      } else if (operand.match(/\d+/)) {
        modifiedExpression += operand;
      } else {
        modifiedExpression += operand.replace(
          operand,
          `activeStackFrame['${operand}'].value`
        );
      }
      start = operandExp.lastIndex;
      console.debug(start);
      console.log(modifiedExpression);
    }
    console.log("modifiedExpression", modifiedExpression);
    this.accumulator = eval(modifiedExpression);
    console.log(this.accumulator);
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
    const { parameters } = this.token[this.currentCall];
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
  static adjustFromTo = () => {
    let lineAdjustment = -1;
    let colAdjustment = -2;
    let from = {},
      to = {};
    from.line = this.currInstruction.from.line + lineAdjustment;
    to.line = this.currInstruction.to.line + lineAdjustment;
    from.ch = this.currInstruction.from.ch + colAdjustment;
    to.ch = this.currInstruction.to.ch + colAdjustment;
    return {
      from,
      to,
    };
  };
  static updateMark = () => {
    if (!this.currInstruction.from || !this.currInstruction.from) return;
    let { from, to } = this.adjustFromTo();
    console.log(this.editor);
    if (this.self.lastMark) this.self.lastMark.clear();
    this.self.lastMark = this.editor.markText(from, to, {
      className: "codemirror-highlighted",
    });
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
