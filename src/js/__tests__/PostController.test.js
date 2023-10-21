import { validateCoordsStr } from '../validator';

test('coordsOk1', () => {
  const coords = '51.50851, -0.12572';
  const result = validateCoordsStr(coords);
  expect(result).toBe(true);
});

test('coordsOk2', () => {
  const coords = '51.50851,-0.12572';
  const result = validateCoordsStr(coords);
  expect(result).toBe(true);
});

test('coordsOk3', () => {
  const coords = '[51.50851, -0.12572]';
  const result = validateCoordsStr(coords);
  expect(result).toBe(true);
});

test('coordsNotOk', () => {
  const coords = '51.50851 -0.12572';
  const result = validateCoordsStr(coords);
  expect(result).toBe(false);
});
