class Printf {
  outputString;
  argList = [""];
  formattedString;
  args;
  constructor(args) {
    this.args = args;
    this.outputString = "";
  }
  print() {
    this.separateArguments();
    //console.log(this.argList);
    //this.argList.forEach(arg => console.log(arg));
    this.formattedString = this.argList[0];
    for (let i = 0, index = 1; i < this.formattedString.length; i++) {
      if (this.formattedString[i] === "%") {
        this.fillPlaceHolder(this.formattedString[++i], this.argList[index++]);
        continue;
      }
      this.outputString += this.formattedString[i];
    }
    console.log("outputString", this.outputString);
  }
  separateArguments() {
    let isString = false;
    this.argList;
    let index = 0;

    for (let i = 0; i < this.args.length; i++) {
      let charData = this.args[i];
      if (charData != `\\`) {
        if (charData === '"') {
          isString = !isString;
          continue;
        }
        if (isString) {
          this.argList[index] += charData;
          continue;
        }
        if (charData === ",") {
          index++;
          this.argList[index] = "";
          continue;
        }
      }
      this.argList[index] += this.args[i++];
      this.argList[index] += this.args[i];
    }
  }
  isConstant(arg) {
    arg = arg.trim();
    console.log(Number(arg[0]));
    if (arg[0] === "'" || arg[0] === '"' || !isNaN(arg)) return true;
    console.log("returning false");
    return false;
  }

  fillPlaceHolder(placeHolder, data) {
    if (placeHolder === "s") {
      if (this.isConstant(data)) {
        this.outputString += data.replaceAll(`"`, "");
        return;
      }
    } else if (placeHolder === "c") {
      if (this.isConstant(data)) {
        if (Number(data) !== NaN) {
          this.outputString += String.fromCharCode(data);
          return;
        }
        this.outputString += data;
        return;
      }
    } else {
      if (this.isConstant(data)) {
        if (Number(data) !== NaN) {
          this.outputString += data;
          return;
        }
        this.outputString += data.charCodeAt(0);
        return;
      }
    }
    this.outputString += `activeStackFrame[${data.trim()}]`;
  }
}

let testCases = [
  String.raw`"%s\",", "hello world"`,
  String.raw`"%d", 5`,
  String.raw`"hello world"`,
  String.raw`"hello world %d %d", a, b`,
];
let skip = {};
function testPrintf() {
  testCases.forEach((testInput, index) => {
    if (index in skip) return;
    let printf = new Printf(testInput);
    printf.print();
  });
}

testPrintf();
