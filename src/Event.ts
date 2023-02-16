export type EventCallback<T> = (T) => void;

export class Event<T> {
  private subscribers: EventCallback<T>[] = [];

  public on(callback: EventCallback<T>): void {
    this.subscribers.push(callback);
  }

  public off(callback: EventCallback<T>): void {
    //this.subscribers.(callback);
  }

  public trigger(data: T) {
    for (const subscriber of this.subscribers) {
      subscriber(data);
    }
  }
}
