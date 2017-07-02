import _ from "lodash";

export default function (state = {}, action) {
    switch(action.type) {
        case "executionsReport":
            return _(action.tasks).groupBy(it => it.key).mapValues(it => it.map(it => it.number)).value();
        default:
            return state;
    }
}
