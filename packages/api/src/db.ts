import mysql from 'promise-mysql';
import { requireEnv } from '@friends-library/types';

const { API_DB_HOST, API_DB_USER, API_DB_PASS, API_DB_NAME } = requireEnv(
  'API_DB_HOST',
  'API_DB_USER',
  'API_DB_PASS',
  'API_DB_NAME',
);

export function select(sql: string, params: any[] = []) {
  return query(sql, params);
}

export function insert(table: string, row: { [key: string]: any }) {
  return query(`INSERT INTO \`${table}\` SET ?`, row);
}

export async function query(sql: string, data: any = []) {
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
