export default function scanf(args, Body, activeStackFrame, exitInputMode) {
  let intervalId = setInterval(() => {
    let argList = args.split(",");
    let inputList = Body.inputBuffer.split(/,|\s/);
    //console.log("input", inputList);
    let lastInputChar = Body.inputBuffer[Body.inputBuffer.length - 1];
    console.log(
      argList.length - 1 === inputList.length && lastInputChar === "\n"
    );

    //console.log("arglen", argList.length);
    //console.log("inputlen", inputList.length);
    if (argList.length === inputList.length && lastInputChar === "\n") {
      for (let i = 1, j = 0; i < argList.length; i++, j++) {
        let variableName = argList[i].replace("&", "").trim();
        //console.log(variableName);
        activeStackFrame[variableName].value = inputList[j];
      }
      exitInputMode();
      clearInterval(intervalId);
    }
  }, 100);
}

//
//test
// let testCases = [
//   { testArg: String.raw`"%d", &a`, testInput: String.raw`23` },
//   { testArg: String.raw`"%d%f", &in, &fl`, testInput: String.raw`23 25.26` },
// ];
// let skip = {};
// function testscanf() {
//   testCases.forEach(({ testArg, testInput }, index) => {
//     if (index in skip) return;
//     scanf(testArg, testInput);
//   });
// }

// testscanf();
