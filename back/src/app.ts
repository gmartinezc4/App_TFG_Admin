import { ApolloServer, gql } from "apollo-server"
import { connectDB } from "./connectmongo"
import { connectDB_Admin } from "./connectmongoAdmin"
import { typeDefs } from "./schema"
import { Query } from "./resolvers/query"
import { Mutation } from "./resolvers/mutation"

const resolvers = {
   Query,
   Mutation
}

const run = async () => {
  const db = await connectDB();
  const db_admin = await connectDB_Admin();
  
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      const userAdmin = await db_admin.collection("Usuarios_admins").findOne({ token });
      
      return { 
        db, 
        db_admin,
        userAdmin 
      }
    },
  });

  server.listen(4001).then(() => {
    console.log(`Server ready on 4001 `);
  });
}

try {
  run()
} catch (e) {
  console.error(e);
}
