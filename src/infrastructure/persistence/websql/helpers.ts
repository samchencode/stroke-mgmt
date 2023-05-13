import type { WebsqlDatabase } from '@/infrastructure/persistence/websql/WebsqlDatabase';

type Query = {
  sql: string;
  args: (number | string)[];
};

const makeQuery = (sql: string, args: (number | string)[]) => ({ sql, args });

const sqlStr = (sql: ReadonlyArray<string>, ...interp: (number | string)[]) =>
  makeQuery(sql.join('?'), interp);

const makeTransaction = (db: WebsqlDatabase) =>
  new Promise<SQLTransaction>((s, f) => {
    db.transaction(s, f);
  });

const executeSqlInTransaction = (tx: SQLTransaction, q: Query) =>
  new Promise<SQLResultSet>((s, f) => {
    tx.executeSql(
      q.sql,
      q.args,
      (_tx, res) => s(res),
      (_tx, e) => {
        f(e);
        return true;
      }
    );
  });

async function executeSql(
  db: WebsqlDatabase,
  queries: Query[]
): Promise<SQLResultSet[]> {
  const tx = await makeTransaction(db);
  const promises = queries.map((q) => executeSqlInTransaction(tx, q));
  return Promise.all(promises);
}

function resultSetToArray<T>(result: SQLResultSet) {
  const { length } = result.rows;
  return new Array(length)
    .fill(undefined)
    .map((_, i) => result.rows.item(i) as T);
}

export { sqlStr, executeSql, resultSetToArray };
