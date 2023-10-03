import { describe, test } from 'bun:test';

describe('Create item', () => {
  test.todo('with no auth - 401');
  test.todo('with no data - 400');
  test.todo('with success - 201');
});

describe('Get all items', () => {
  test.todo('with store not open - 200');
  test.todo('with store closed - 403');
  test.todo('with success - 200');
});

describe('Get all archived items', () => {
  test.todo('with no auth - 200');
  test.todo('with success - 200');
});

describe('Get item', () => {
  test.todo('with store not open - 200');
  test.todo('with store closed - 403');
  test.todo('with success - 200');
});

describe('Get archived item', () => {
  test.todo('with no auth - 404');
  test.todo('with success - 200');
});

describe('Update item', () => {
  test.todo('with no auth - 401');
  test.todo('with no data - 400');
  test.todo('success - 200');
});

describe('Delete item', () => {
  test.todo('with no auth - 401');
  test.todo('success - 200');
});
