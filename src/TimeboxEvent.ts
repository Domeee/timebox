export enum TimeboxEventType {
  INCREASE_UNIT,
  DECREASE_UNIT,
}

export default interface TimeboxEvent {
  type: TimeboxEventType;
  unit: number;
};
