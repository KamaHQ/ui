import _ from "lodash";

import EventSourceObservable from "./EventSourceObservable";

export default class ReactiveGraphQLClient {
    static query(url, body) {
        return EventSourceObservable.create(url + "?query=" + encodeURIComponent(body))
            .scan((acc, change) => change.path.length == 0 ? change.data : _.set(acc, change.path, change.data), {});
    }
}
