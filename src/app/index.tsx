import {
  AliceWMCMD,
  AnuraCMD,
  EvalCMD,
  PrintCMD,
  SMTEntry,
  SMTData,
  SMTApp,
  SMTCMD,
  serializeCommand,
  deserializeCommand,
} from "../lib/index";

type SMTModule = {
  SMTEntry: typeof SMTEntry;
  SMTData: typeof SMTData;
  SMTApp: typeof SMTApp;
  serializeCommand: typeof serializeCommand;
  deserializeCommand: typeof deserializeCommand;
};

function entryDisplay(entry: SMTEntry) {
  return (
    <div>
      <div>{entry.name}</div>
      <div>{entry.description}</div>
    </div>
  );
}

function App(props: { data: SMTData }) {
  this.state ??= stateful({
    entries: props.data.entries,
  });

  return <div for={use(this.state.entries)} do={entryDisplay.bind(this)}></div>;
}

window.addEventListener("load", () => {
  anura.import("anura.smt").then((smt: SMTModule) => {
    const url = new URL(window.location.href);
    const serializedData = url.searchParams.get("smtdata");
    console.log(serializedData);
    const data = serializedData
      ? smt.SMTData.deserialize(serializedData)
      : new smt.SMTData();
    console.log(data);
    document.body.appendChild(<App data={data} />);
  });
});
