import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing config variable: "mongodb_uri"');
}

let clientPromise: Promise<MongoClient>;
let client = new MongoClient(process.env.MONGODB_URI, {});
clientPromise = client.connect();

export default clientPromise;
