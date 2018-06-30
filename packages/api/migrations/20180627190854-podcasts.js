'use strict';

var async = require('async');
var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  const { STRING, SMALL_INTEGER } = type;
  async.series([
    db.addColumn.bind(db, 'downloads', 'context', {
      type: STRING,
      length: 7, // web|podcast @TODO would be nice if this was an ENUM
      notNull: true,
    }),
    db.addColumn.bind(db, 'downloads', 'quality', {
      type: STRING,
      length: 2, // hi|lo @TODO would be nice if this was an ENUM
      notNull: false,
    }),
    db.addColumn.bind(db, 'downloads', 'part', {
      type: SMALL_INTEGER,
      notNull: false,
    }),
  ], callback);
};

exports.down = function(db, callback) {
  async.series([
    db.removeColumn.bind(db, 'downloads', 'context'),
    db.removeColumn.bind(db, 'downloads', 'quality'),
    db.removeColumn.bind(db, 'downloads', 'part'),
  ], callback);
};

exports._meta = {
  "version": 1
};
