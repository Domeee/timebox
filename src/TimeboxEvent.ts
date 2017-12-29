export enum TimeboxEventType {
  INCREASE_SECONDS,
  INCREASE_MINUTES,
  DECREASE_SECONDS,
  DECREASE_MINUTES,
}

export default interface TimeboxEvent {
  type: TimeboxEventType;
};
