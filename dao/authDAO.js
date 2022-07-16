import { ObjectId } from "mongodb";

let users;

export default class AuthDAO {
  static async injectDB(conn) {
    if (users) {
      return;
    }
    try {
      users = await conn.db(process.env.RESTREVIEWS_NS).collection("users");
    } catch (e) {
      console.error(`Unable to establish a collection handle in authDAO: ${e}`);
    }
  }

  static async findUser(email) {
    try {
      const user = {
        email: email,
      };
      return await users.findOne(user);
    } catch (e) {
      console.error(`Unable to post review: ${e}`);
      return { error: e };
    }
  }

  static async findUserById(id) {
    try {
      const user = {
        _id: new ObjectId(id),
      };
      return await users.findOne(user);
    } catch (e) {
      console.error(`Unable to post review: ${e}`);
      return { error: e };
    }
  }

  static async createUser(user) {
    try {
      return await users.insertOne(user);
    } catch (e) {
      console.error(`Unable to post review: ${e}`);
      return { error: e };
    }
  }
}
