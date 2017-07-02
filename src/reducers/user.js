export default function (state = {}, action) {
    switch(action.type) {
        case "userReceived":
            const { user } = action;
            return user;
        default:
            return state;
    }
}
