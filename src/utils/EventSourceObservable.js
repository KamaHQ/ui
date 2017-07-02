import Rx from "rxjs";

export default class EventSourceObservable {
    static create(url) {
        return Rx.Observable
        .create(observer => {
            const source = new EventSource(url);
            source.onmessage = it => {
                if (it.type === "message") {
                    observer.next(JSON.parse(it.data));
                }
            };
            source.onerror = e => e.eventPhase === 2 ? observer.complete() : observer.error(e);

            return () => source.close();
        })
    }
}
