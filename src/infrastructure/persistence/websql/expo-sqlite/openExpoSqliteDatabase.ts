import { openDatabase } from 'expo-sqlite';

export function openExpoSqliteDatabase() {
  return openDatabase('database-v1.db', '1.0', '', 1000);
}
