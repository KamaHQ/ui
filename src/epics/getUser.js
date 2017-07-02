import ReactiveGraphQLClient from "../utils/ReactiveGraphQLClient";

export default function (action$) {
    return ReactiveGraphQLClient
        .query("/graphql", `{
            me {
                authorities
            }
        }`)
        .retryWhen(it$ => it$.doOnNext(e => console.error(e)).delay(1000))
        .map(({ me }) => ({ type: "userReceived", user: me }));
};
