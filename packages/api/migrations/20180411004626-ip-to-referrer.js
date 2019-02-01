

exports.setup = () => {};

exports.up = (db) => {
  return db.renameColumn('downloads', 'ip_address', 'referrer');
};

exports.down = (db) => {
  return db.renameColumn('downloads', 'referrer', 'ip_address');
};

// eslint-disable-next-line no-underscore-dangle
exports._meta = {
  version: 1,
};
