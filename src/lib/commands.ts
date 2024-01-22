// Opcode 0, string
// string will be printed to the console
export type PrintCMD = [0, string];

// OpCode 1, string
// string is the path on the anura object to the function
// the rest of the array is the arguments
export type AnuraCMD = [1, string, any[]];

// OpCode 2, string
// string is js code to be evaluated
export type EvalCMD = [2, string];

// OpCode 3, string
// string is the path on the AliceWM object
// the rest of the array is the arguments
export type AliceWMCMD = [3, string, any[]];

// Command type
export type SMTCMD = PrintCMD | AnuraCMD | EvalCMD | AliceWMCMD;

export function serializeCommand(cmd: SMTCMD): string {
  return JSON.stringify(cmd);
}

export function deserializeCommand(serializedCmd: string): SMTCMD {
  return JSON.parse(serializedCmd);
}
