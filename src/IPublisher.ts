import {PublishEventArgs} from "./PublishEventArgs";

export interface IPublisher<T> {
    publish(data: T);
}