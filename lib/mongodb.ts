import { MongoClient } from 'mongodb'
import config from '../config';

if (!config.mongodb_uri || config.mongodb_uri == "REPLACE-DO-NOT-COMMIT") {
  throw new Error('Invalid/Missing config variable: "mongodb_uri"')
}

let clientPromise: Promise<MongoClient>
let client = new MongoClient(config.mongodb_uri, {})
clientPromise = client.connect()

export default clientPromise