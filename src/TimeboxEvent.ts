export enum TimeboxEventType {
  INCREASE_SECONDS,
  DECREASE_SECONDS
}

export default interface TimeboxEvent {
  type: TimeboxEventType;
};
