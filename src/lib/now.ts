import { nowSnapshots } from "../../content/now/snapshots";

export type NowSnapshot = {
  date: string;
  learning: string;
  doing: string;
  realization: string;
  paused: string;
  signal: string;
  next: string;
  focus: {
    label: string;
    detail: string;
    progress: number;
    tone: "primary" | "teal" | "amber";
  }[];
};

export function getNowSnapshots() {
  return [...nowSnapshots].sort((a, b) => b.date.localeCompare(a.date));
}
