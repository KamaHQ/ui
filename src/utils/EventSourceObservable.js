import Rx from "rxjs";

export default class EventSourceObservable {
    static create(url) {
        return Rx.Observable
        .create(observer => {
            const source = new EventSource(url);
            source.onmessage = it => {
                if (it.type === "message") {
                    let data = it.data;

                    // FIXME wtf?
                    if (data.startsWith("data:")) {
                        data = data.substring("data:".length)
                    }

                    observer.next(JSON.parse(data));
                }
            };
            source.onerror = e => e.eventPhase === 2 ? observer.complete() : observer.error(e);

            return () => source.close();
        })
    }
}
