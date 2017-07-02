import EventSourceObservable from "../utils/EventSourceObservable";

export default function (action$) {
    return EventSourceObservable
        .create("/events")
        .do(console.log)
        .retryWhen(errors => errors.delay(1000));
};
