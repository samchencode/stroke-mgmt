// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: @types/websql isn't a module.
// eslint-disable-next-line import/no-extraneous-dependencies
import openDatabaseWebSql from 'websql';

const openDatabase: WindowDatabase['openDatabase'] = openDatabaseWebSql;

export { openDatabase };
