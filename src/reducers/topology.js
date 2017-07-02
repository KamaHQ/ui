export default function (state = { servers: undefined, clients: undefined }, action) {
    switch(action.type) {
        case "topologyChanged":
            const { topology } = action;
            return {
            servers: topology && topology.filter(it => !it.client).length,
            clients: topology && topology.filter(it => it.client).length
        };
        default:
            return state;
    }
}