export enum TimeboxEventType {
  INCREASE_SECONDS,
  INCREASE_MINUTES,
  INCREASE_MINUTES_BIGTIME,
  DECREASE_SECONDS,
  DECREASE_MINUTES,
}

export default interface TimeboxEvent {
  type: TimeboxEventType;
};
