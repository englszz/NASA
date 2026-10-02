import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { summarizeClimate } from './climate.js';

test('counts matching calendar days, excludes missing values, and includes threshold equality', () => {
  const data = { header: { fill_value: -999 }, properties: { parameter: {
    PRECTOTCORR: { 20050101: 20, 20060101: 0, 20070101: -999, 20050102: 99 },
  } } };
  const [rain] = summarizeClimate(data, '2026-01-01', { rain: 20, heat: 35, wind: 10 });
  assert.equal(rain.count, 2);
  assert.equal(rain.probability, 50);
  assert.equal(rain.average, 10);
  assert.equal(summarizeClimate(data, '', {}).length, 0);
  assert.equal(summarizeClimate(data, '2026-02-29', {})[0].count, 0);
});

test('every map province has a valid original dataset and actual samples', () => {
  const files = JSON.parse(readFileSync(new URL('./climate-files.json', import.meta.url)));
  const geo = JSON.parse(readFileSync(new URL('../../public/data/provincias.geojson', import.meta.url)));
  assert.equal(Object.keys(files).length, 32);
  for (const feature of geo.features) {
    const filename = files[feature.properties.name];
    assert.ok(filename, feature.properties.name);
    const data = JSON.parse(readFileSync(new URL(`../../public/data/clima/${filename}`, import.meta.url)));
    for (const metric of summarizeClimate(data, '2026-10-02', { rain: 20, heat: 35, wind: 10 })) {
      assert.ok(metric.count > 0, `${filename}: ${metric.key}`);
      assert.ok(Number.isFinite(metric.average));
    }
  }
});
