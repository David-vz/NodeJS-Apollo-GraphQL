const graphql = require('graphql');
const _ = require('lodash');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphql;

const users = [
    {id: '23', firstName:'Bill', age: 20},
    {id: '47', firstName:'Samantha', age: 21},
]

const UserType = new GraphQLObjectType({
    name: 'User', // note: by convention, capitalize named type
    fields: { // tells GraphQL all the properties a user has and their types
        id: {type: GraphQLString},
        firstName: {type: GraphQLString},
        age: {type: GraphQLInt},
    }
})

// the RootQuery will allow GraphQL to 'jump and land' on a very specific
// node in the graph of all of our data
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},
            // the resolve function is where we go in to the db
            // and find/return data we are looking for
            resolve(parentValue, args){
                return _.find(users, {id:args.id});
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})