

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
  const { STRING, TIMESTAMP, BOOLEAN } = type;
  return db.createTable('downloads', {
    id: {
      type: STRING,
      length: 36,
      primaryKey: true,
      notNull: true,
      unique: true,
    },
    lang: {
      type: STRING,
      length: 2,
      notNull: true,
    },
    friend: {
      type: STRING,
      length: 255,
      notNull: true,
    },
    document: {
      type: STRING,
      length: 255,
      notNull: true,
    },
    edition: {
      type: STRING,
      length: 16,
      notNull: true,
    },
    format: {
      type: STRING,
      length: 16,
      notNull: true,
    },
    is_mobile: {
      type: BOOLEAN,
    },
    browser: {
      type: STRING,
      length: 100,
    },
    os: {
      type: STRING,
      length: 100,
    },
    platform: {
      type: STRING,
      length: 100,
    },
    user_agent: {
      type: STRING,
      length: 255,
      notNull: true,
    },
    ip_address: {
      type: STRING,
      length: 100,
      notNull: true,
    },
    created_at: {
      type: TIMESTAMP,
      notNull: true,
      defaultVal: String('current_timestamp()'),
    },
  });
};

exports.down = (db) => {
  return db.dropTable('downloads');
};

// eslint-disable-next-line no-underscore-dangle
exports._meta = {
  version: 1,
};
