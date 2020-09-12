const graphql = require('graphql');
const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphql;

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: {
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
    }
})

const UserType = new GraphQLObjectType({
    name: 'User', // note: by convention, capitalize named type
    fields: { // tells GraphQL all the properties a user has and their types
        id: {type: GraphQLString},
        firstName: {type: GraphQLString},
        age: {type: GraphQLInt},
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then(res => res.data);
            }
        }
    }
})

// the RootQuery will allow GraphQL to 'jump and land'
//  on a very specific node in the graph of all of our data
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},
            // the resolve function is where we go in to the db
            //  and find/return data we are looking for
            resolve(parentValue, args) {
                // graphql handles waiting for an async promise to resolve
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    // gotcha with axios {data: <actual response>}
                    .then(resp => resp.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})