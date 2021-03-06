export function buildUserUpdateByIDQuery<E>(
  table: string,
  id: number,
  dataToUpdate: E
): string {
  const columnsToUpdate: string[] = Object.entries(dataToUpdate).map(
    ([key, value]) => `${key} = '${value}'`
  );
  let query = `UPDATE "${table}" SET `;
  let i = 0;
  for (; i < columnsToUpdate.length - 1; i++) {
    query += columnsToUpdate[i] + ", ";
  }
  query += columnsToUpdate[i];
  query += ` WHERE u_id = ${id}`;
  return query;
}

export function buildUpdateByIDQuery<E>(
  table: string,
  t_id: string,
  id: number,
  dataToUpdate: E
): string {
  const columnsToUpdate: string[] = Object.entries(dataToUpdate).map(
    ([key, value]) => `${key} = '${value}'`
  );
  let query = `UPDATE ${table} SET `;
  let i = 0;
  for (; i < columnsToUpdate.length - 1; i++) {
    query += columnsToUpdate[i] + ", ";
  }
  query += columnsToUpdate[i];
  query += ` WHERE ${t_id} = ${id}`;
  return query;
}
