export enum TimeboxChangeEventType {
  INCREASE_UNIT,
  DECREASE_UNIT,
}

export default interface TimeboxChangeEvent {
  type: TimeboxChangeEventType;
  unit: number;
  nudge?: boolean;
}
