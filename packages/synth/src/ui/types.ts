import { Point } from "@waw/svg";
import { Note } from "../engine/midi/types";
export { Note } from "../engine/midi/types";

export type GraphNote = {
  position: number;
  length: number;
  i: number;
};

export type SelectZone = readonly [Point, Point];

type BaseNote = Note & {
  position: number;
  i: number;
  index?: number;
};

export type NotePoint = BaseNote & {
  old?: Pick<BaseNote, "i" | "position" | "length">;
};

export type EditActionType = "select" | "draw";
