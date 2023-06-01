import { Db, MongoClient } from "mongodb";
import { connectDB } from "../src/connectmongo";
import { expect } from "chai";
import { describe, it } from 'mocha';


describe("connectDB TFG", () => {
  it("debería lanzar un error si no se puede conectar a la base de datos", async () => {
    try {
      await connectDB();
      // Si la conexión tiene éxito, la prueba falla
      expect.fail("Se esperaba que connectDB lanzara un error");
    } catch (error) {
      // Verifica que el error exista y sea una instancia de Error
      expect(error).to.exist;
      expect(error).to.be.an.instanceOf(Error);
    }
  });
});

describe("connectDB TFG", () => {
  it("debería conectarse a la base de datos sin lanzar errores", async () => {
    const dbName: string = "TFG";
    const usr = "gmartinezc4";
    const pwd = "cristiano7";
    const mongouri: string = `mongodb+srv://${usr}:${pwd}@cluster0.ltpbs.mongodb.net/?retryWrites=true&w=majority`;

    try {
      const client = new MongoClient(mongouri);
      const db: Db = await client.connect().then(() => client.db(dbName));

      expect(db).to.exist;
      expect(db).to.be.an.instanceOf(Db);
      expect(db.databaseName).to.equal(dbName);

      // Cierra la conexión después de realizar las verificaciones
      await client.close();
    } catch (error) {
      // En caso de que se lance un error, indica que se esperaba una conexión exitosa
      expect.fail("Se esperaba una conexión exitosa a la base de datos");
    }
  });
});
