import {
  DataIntegrityError,
} from '../errors';
import {
  type InternalQueryMethod,
} from '../types';
import {
  createQueryId,
} from '../utilities';
import {
  query,
} from './query';

/**
 * Makes a query and expects exactly one result.
 *
 * @throws DataIntegrityError If query returns multiple rows.
 */
export const maybeOne: InternalQueryMethod = async (log, connection, clientConfiguration, slonikSql, inheritedQueryId) => {
  const queryId = inheritedQueryId ?? createQueryId();

  const {
    rows,
  } = await query(log, connection, clientConfiguration, slonikSql, queryId);

  if (rows.length === 0) {
    return null;
  }

  if (rows.length > 1) {
    log.error({
      queryId,
    }, 'DataIntegrityError');

    throw new DataIntegrityError();
  }

  return rows[0];
};
