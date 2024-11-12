import { Client } from 'pg';

const connectionString = process.env.CONNECTION_STRING;

export const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false, 
  },
});

