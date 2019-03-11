import glob from 'glob';
import path from 'path';
import * as lineRules from '../line-rules';
import * as blockRules from '../block-rules';

describe('line-rules export', () => {
  test('line-rules/index.js exports all rules', () => {
    const files = glob.sync(path.resolve(__dirname, '../line-rules/*.js'))
      .filter(file => !file.match(/index\.js$/));
    expect(Object.values(lineRules)).toHaveLength(files.length);
  });
});

test('rule functions have slug property', () => {
  const slugs = new Set();
  const allRules = [lineRules, blockRules];
  allRules.forEach(rules => {
    Object.values(rules).forEach(rule => {
      expect(typeof rule.slug).toBe('string');
      if (slugs.has(rule.slug)) {
        throw new Error(`Duplicate rule slug: ${rule.slug}`);
      }
      slugs.add(rule.slug);
    });
  });
});

describe('block-rules export', () => {
  test('block-rules/index.js exports all rules', () => {
    const files = glob.sync(path.resolve(__dirname, '../block-rules/*.js'))
      .filter(file => !file.match(/index\.js$/));
    expect(Object.values(blockRules)).toHaveLength(files.length);
  });
});
