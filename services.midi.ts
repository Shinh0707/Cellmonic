// Minimal type definitions for Web MIDI API to avoid external dependency issues
export interface MIDIOutput {
  id: string;
  name?: string;
  manufacturer?: string;
  type: "output";
  version?: string;
  state: "disconnected" | "connected";
  connection: "open" | "closed" | "pending";
  send(data: number[] | Uint8Array, timestamp?: number): void;
  clear(): void;
}

export interface MIDIAccess {
  inputs: Map<string, any>;
  outputs: Map<string, MIDIOutput>;
}

export class MidiService {
  private access: MIDIAccess | null = null;
  private output: MIDIOutput | null = null;

  async initialize(): Promise<void> {
    // Cast navigator to any to avoid "Property 'requestMIDIAccess' does not exist" error
    const nav = navigator as any;
    if (!nav.requestMIDIAccess) {
      console.warn("Web MIDI API not supported in this browser.");
      return;
    }
    try {
      this.access = await nav.requestMIDIAccess();
    } catch (err) {
      console.error("Failed to access MIDI devices", err);
    }
  }

  getOutputs(): MIDIOutput[] {
    if (!this.access) return [];
    const outputs: MIDIOutput[] = [];
    this.access.outputs.forEach((output) => outputs.push(output));
    return outputs;
  }

  setOutput(id: string) {
    if (!this.access) return;
    this.output = this.access.outputs.get(id) || null;
  }

  noteOn(note: number, velocity: number = 100, channel: number = 0) {
    if (!this.output) return;
    // status byte 0x90 + channel (0-15)
    this.output.send([0x90 + channel, note, velocity]);
  }

  noteOff(note: number, channel: number = 0) {
    if (!this.output) return;
    // status byte 0x80 + channel
    this.output.send([0x80 + channel, note, 0]);
  }

  allNotesOff(channel: number = 0) {
    if (!this.output) return;
    // CC 123 All Notes Off
    this.output.send([0xB0 + channel, 123, 0]);
  }
}

export const midiService = new MidiService();