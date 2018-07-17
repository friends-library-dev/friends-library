/* eslint-disable global-require */
require('babel-register');
const { default: friendFromJS } = require('./map');
const { default: Friend } = require('./Friend');
const { default: Format } = require('./Format');
const { default: Edition } = require('./Edition');
const { default: Document } = require('./Document');
const { default: Chapter } = require('./Chapter');
const { default: Audio } = require('./Audio');
const { default: AudioPart } = require('./AudioPart');
const { getFriend, getAllFriends, query } = require('./query');

module.exports = {
  friendFromJS,
  Friend,
  Format,
  Edition,
  Document,
  Chapter,
  Audio,
  AudioPart,
  getFriend,
  getAllFriends,
  query,
};
