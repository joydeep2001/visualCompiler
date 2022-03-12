function scanf(args, inputs) {
  let argList = args.split(",");
  let inputList = inputs.split(/,|\s/);
  let outuputString = "";
  for (let i = 1, j = 0; i < argList.length; i++, j++) {
    outuputString += `activeStackFrame[${argList[i]
      .replace("&", "")
      .trim()}] = ${inputList[j].trim()}  `;
  }
  console.log(outuputString);
  return outuputString;
}

//
//test
let testCases = [
  { testArg: String.raw`"%d", &a`, testInput: String.raw`23` },
  { testArg: String.raw`"%d%f", &in, &fl`, testInput: String.raw`23 25.26` },
];
let skip = {};
function testscanf() {
  testCases.forEach(({ testArg, testInput }, index) => {
    if (index in skip) return;
    scanf(testArg, testInput);
  });
}

testscanf();
