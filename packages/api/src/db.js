// @flow
/* istanbul ignore file */
import mysql from 'promise-mysql';

const { env: {
  API_DB_HOST,
  API_DB_USER,
  API_DB_PASS,
  API_DB_NAME,
} } = process;

export function select(sql: string, params: Array<mixed> = []) {
  return query(sql, params);
}

export function insert(table: string, row: Object) {
  return query(`INSERT INTO \`${table}\` SET ?`, row);
}

export async function query(sql: string, data: mixed = []) {
  const connection = await getConnection();
  const result = await connection.query(sql, data);
  connection.end();
  return result;
}

function getConnection() {
  return mysql.createConnection({
    host: API_DB_HOST,
    user: API_DB_USER,
    password: API_DB_PASS,
    database: API_DB_NAME,
  });
}
