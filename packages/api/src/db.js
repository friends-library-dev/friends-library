// @flow
import mysql from 'promise-mysql';

const { env: {
  API_DB_HOST,
  API_DB_USER,
  API_DB_PASS,
  API_DB_NAME,
} } = process;

export async function select(sql: string, params: Array<mixed> = []) {
  const connection = await getConnection();
  const results = await connection.query(sql, params);
  connection.end();
  return results;
}


export async function insert(table: string, row: Object) {
  return  await query(`INSERT INTO \`${table}\` SET ?`, row);
}

export async function query(sql: string, data: mixed = []) {
  const connection = await getConnection();
  const result = await connection.query(sql, data);
  connection.end();
  return result;
}

async function getConnection() {
  return await mysql.createConnection({
    host: API_DB_HOST,
    user: API_DB_USER,
    password: API_DB_PASS,
    database: API_DB_NAME,
  });
}
