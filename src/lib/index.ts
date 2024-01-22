import {
  type SMTCMD,
  serializeCommand,
  deserializeCommand,
} from "./commands.js";

const appBasePath =
  import.meta.url.substring(0, import.meta.url.lastIndexOf("/")) + "/../../";

export class SMTEntry {
  name: string;
  description: string;
  icon: string;
  command: SMTCMD;
}

export class SMTData {
  entries: SMTEntry[] = [];

  serialize(): string {
    return encodeURIComponent(
      this.entries
        .map((entry) => {
          return btoa(
            `${entry.name};${entry.description};${
              entry.icon
            };${serializeCommand(entry.command)}`
          );
        })
        .join(";")
    );
  }

  constructor(entries: SMTEntry[] = []) {
    this.entries = entries;
  }

  static deserialize(serializedData: string): SMTData {
    return new SMTData(
      decodeURIComponent(serializedData)
        .split(";")
        .map((entry) => {
          const [name, description, icon, command] = atob(entry).split(";");
          return {
            name,
            description,
            icon,
            command:
              typeof command !== "undefined"
                ? deserializeCommand(command)
                : null,
          } as SMTEntry;
        })
    );
  }
}

export class SMTApp extends App {
  icon = appBasePath + "anura-smt.png";

  name = "Anura SMT";

  description = "Anura System Management Toolkit";

  wininfo: WindowInformation = {
    title: "Anura System Management Toolkit",
    width: "1000px",
    height: "500px",
    minwidth: 40,
    minheight: 40,
    allowMultipleInstance: true,
    resizable: true,
  } as WindowInformation;

  data: SMTData;

  /**
   * The app is hidden by default, because this is a
   * management tool and should be opened from the
   * console.
   */
  hidden = true;

  async open(): Promise<WMWindow> {
    const win = anura.wm.create(this, this.wininfo);

    const iframe = document.createElement("iframe");
    iframe.setAttribute(
      "style",
      "top:0; left:0; bottom:0; right:0; width:100%; height:100%; border: none; margin: 0; padding: 0; background-color: #202124;"
    );
    iframe.setAttribute(
      "src",
      `${appBasePath}/app/index.html?smtdata=${this.data.serialize()}`
    );
    win.content.appendChild(iframe);

    (iframe.contentWindow as any).anura = anura;
    (iframe.contentWindow as any).AliceWM = AliceWM;

    return win;
  }

  constructor(data: SMTData) {
    super();
    this.data = data;
  }
}

// Re-export everything from commands.ts as this is the main entry point
export { serializeCommand, deserializeCommand };

// Re-export command types
export type {
  SMTCMD,
  PrintCMD,
  AnuraCMD,
  EvalCMD,
  AliceWMCMD,
} from "./commands.js";
