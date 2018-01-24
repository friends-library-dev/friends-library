'use strict';

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

exports.up = function(db) {
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
      defaultVal: new String('current_timestamp()')
    }
  });
};

exports.down = function(db) {
  return db.dropTable('downloads');
};

exports._meta = {
  "version": 1
};
