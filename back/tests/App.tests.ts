import { expect } from "chai";
import { ApolloServer } from "apollo-server";
import { connectDB } from "../src/connectmongo"
import { typeDefs } from "../src/schema"
import { Query } from "../src/resolvers/query"
import { Mutation } from "../src/resolvers/mutation"
import { after, before, describe, it } from 'mocha';


describe("Clase app.ts", () => {
  let server: ApolloServer;

  before(async () => {
    const db = await connectDB();

    server = new ApolloServer({
      typeDefs,
      resolvers: { Query, Mutation },
      context: async ({ req }) => {
        const token = req.headers.authorization || "";
        const user = await db.collection("Usuarios").findOne({ token });

        return {
          db,
          user,
        };
      },
    });
  });

  it("debería inicializar el servidor sin lanzar errores", () => {
    expect(() => {
      server.listen(4000);
    }).to.not.throw();
  });

  after(async () => {
    // Cierra el servidor después de los tests
    await server.stop();
  });
});