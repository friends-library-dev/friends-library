

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
  return db.changeColumn('downloads', 'referrer', {
    type: type.STRING,
    length: 255,
    notNull: true,
  });
};

exports.down = (db) => {
  return db.changeColumn('downloads', 'referrer', {
    type: type.STRING,
    length: 100,
    notNull: true,
  });
};

// eslint-disable-next-line no-underscore-dangle
exports._meta = {
  version: 1,
};
