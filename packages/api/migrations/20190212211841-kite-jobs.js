

let dbm;
let type;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = (options) => {
  dbm = options.dbmigrate;
  type = dbm.dataType;
};


exports.up = (db) => {
  const { STRING, TIMESTAMP, SMALL_INTEGER, TEXT } = type;
  return db.createTable('kite_jobs', {
    id: {
      type: STRING,
      length: 36,
      primaryKey: true,
      notNull: true,
      unique: true,
    },
    status: { // queued | in_progress | awaiting_retry | failed | succeeded
      type: STRING,
      length: 16,
      notNull: true,
      defaultVal: 'queued',
    },
    attempts: {
      type: SMALL_INTEGER,
      notNull: true,
      defaultVal: 0,
    },
    notify: {
      type: TEXT,
    },
    job: {
      type: TEXT,
    },
    created_at: {
      type: TIMESTAMP,
      notNull: true,
      defaultVal: String('current_timestamp()'),
    },
    updated_at: {
      type: TIMESTAMP,
      notNull: true,
      defaultVal: String('current_timestamp()'),
    },
  });
};

exports.down = (db) => {
  return db.dropTable('kite_jobs');
};

// eslint-disable-next-line no-underscore-dangle
exports._meta = {
  version: 1,
};
