import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql';

const heyType = new GraphQLObjectType({
  name: 'heyType',
  fields() {
    return {
      hey: {
        type: GraphQLString,
        resolve(hey) {
          return hey;
        }
      }
    };
  }
});

const fileType = new GraphQLObjectType({
  name: 'fileType',
  fields() {
    return {
      fieldname: {
        type: GraphQLString,
        resolve(file) {
          return file.fieldname;
        }
      },
      filename: {
        type: GraphQLString,
        resolve(file) {
          return file.filename;
        }
      },
      mimeType: {
        type: GraphQLString,
        resolve(file) {
          return file.mimeType;
        }
      }
    };
  }
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: 'Functions to query',
    fields: {
      say: {
        type: heyType,
        args: {
          hey: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'input hey word'
          }
        },
        async resolve(parentValue, args) {
          return args.hey;
        }
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    description: 'Functions to operation',
    fields: {
      upload: {
        type: new GraphQLList(fileType),
        async resolve(parentValue, args, ctx) {
          return ctx.files;
        }
      }
    }
  })
});

export default schema;
