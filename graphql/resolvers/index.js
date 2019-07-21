import authResolver from "./auth";
import bookingResolver from "./booking";
import eventsResolver from "./events";

const graphQlResolvers = {
    ...authResolver,
    ...bookingResolver,
    ...eventsResolver
};

export default graphQlResolvers;
