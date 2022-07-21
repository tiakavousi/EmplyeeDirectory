import { promises as fs } from 'fs';
import path from 'path';
import request from 'supertest';

import app from '../server';

if (!process.env.DB_PATH)
  throw new Error('DB_PATH must be defined as an environment variable');
const { DB_PATH } = process.env;

const resetDB = async () => {
  await fs.copyFile(
    path.join(DB_PATH, 'templates', 'employees.json'),
    path.join(DB_PATH, 'employees.json'),
  );
  await fs.copyFile(
    path.join(DB_PATH, 'templates', 'badges.json'),
    path.join(DB_PATH, 'badges.json'),
  );
};

describe('test server', () => {
  let server;
  beforeEach(async () => {
    await resetDB();
    server = await app.listen(4000);
    global.agent = request.agent(server);
  });

  afterEach(async () => {
    await server.close();
  });

  describe('badges', () => {
    test('responds with status 200 the GET method', () => {
      return request(server)
        .get('/badges')
        .then((response) => {
          expect(response.statusCode).toBe(200);
        });
    });
    test('response has expected number of badges, and each is of the Badge type', () => {
      return request(server)
        .get('/badges')
        .then((response) => {
          expect(response.body.length).toBe(30);
          response.body.forEach((badge) => {
            expect(typeof badge.name).toBe('string');
            expect(typeof badge.imageFilePath).toBe('string');
          });
        });
    });
  });

  // describe.each fails with error
  //       A "describe" callback must not return a value.
  // Could not resolve via googling error or trying different variations of describe.each
  describe('filtered employees', () => {
    const filterArray = [
      { q: '', expectedResultsCount: 10 },
      { q: 'ann', expectedResultsCount: 5 },
      { q: 'engineer', expectedResultsCount: 6 },
    ];
    test.each(filterArray)(
      'responds with status 200 the GET method for filter "$q"',
      ({ q }) => {
        const endpoint = `/employees?q=${q}`;
        return request(server)
          .get(endpoint)
          .then((response) => {
            expect(response.statusCode).toBe(200);
          });
      },
    );
    test.each(filterArray)(
      'response has expected number of employees for filter "$q", and each is of the Employee type',
      ({ q, expectedResultsCount }) => {
        const endpoint = `/employees?q=${q}`;
        return request(server)
          .get(endpoint)
          .then((response) => {
            expect(response.body.length).toBe(expectedResultsCount);
            response.body.forEach((employee) => {
              expect(typeof employee.id).toBe('number');
              expect(typeof employee.firstName).toBe('string');
              expect(typeof employee.lastName).toBe('string');
              expect(typeof employee.teamName).toBe('string');
              expect(typeof employee.jobTitle).toBe('string');
              expect(typeof employee.imageFilePath).toBe('string');
              employee.badgeIds.forEach((badgeId) =>
                expect(typeof badgeId).toBe('number'),
              );
            });
          });
      },
    );
    test.each(filterArray)(
      'response for filter "$q" has employees sorted by first name and then last name',
      ({ q }) => {
        const endpoint = `/employees?q=${q}`;
        return request(server)
          .get(endpoint)
          .then((response) => {
            const names = response.body.map(
              (employee) => `${employee.firstName} ${employee.lastName}`,
            );
            expect([...names].sort()).toEqual(names);
          });
      },
    );
  });

  describe('get employee by id', () => {
    test('responds with status 200 the GET method for known employee', () => {
      return request(server)
        .get('/employees/1')
        .then((response) => {
          expect(response.statusCode).toBe(200);
        });
    });
    test('nonexistent employee id generates 404 response', () => {
      return request(server)
        .get(`/employees/123456789`)
        .then((response) => {
          expect(response.statusCode).toBe(404);
        });
    });
    test('returns employee information for employee with three badges', () => {
      return request(server)
        .get('/employees/1')
        .then((response) => {
          const employee = response.body;
          expect(employee).toEqual({
            id: 1,
            firstName: 'Yuki',
            lastName: 'Shiroki',
            imageFilePath: 'images/employees/n-2.png',
            teamName: 'Engineering',
            jobTitle: 'Product Manager',
            badgeIds: [18, 7, 20],
            badgeDetails: [
              {
                id: 7,
                name: 'Ninja',
                imageFilePath: 'images/badges/ninja.png',
              },
              {
                id: 18,
                name: 'Rubber Duck Award',
                imageFilePath: 'images/badges/rubber-duck.png',
              },
              {
                id: 20,
                name: 'Teapot',
                imageFilePath: 'images/badges/teapot.png',
              },
            ],
          });
        });
    });
    test('returns employee information for employee with zero badges', () => {
      return request(server)
        .get('/employees/49')
        .then((response) => {
          const employee = response.body;
          expect(employee).toEqual({
            id: 49,
            firstName: 'Ventura',
            lastName: 'Canning',
            imageFilePath: 'images/employees/n-13.png',
            teamName: 'People',
            jobTitle: 'Employee Relations',
            badgeIds: [],
            badgeDetails: [],
          });
        });
    });
  });

  describe('add badge', () => {
    test('add badge to employee with badges already', async () => {
      const patchResponse = await request(server).patch(
        '/employees/1/badges?badgeId=22',
      );
      expect(patchResponse.status).toBe(200);

      // check updated employee info
      const employeeResponse = await request(server).get('/employees/1');
      const employee = employeeResponse.body;
      expect(employee.badgeIds).toEqual([18, 7, 20, 22]);
      expect(employee.badgeDetails).toEqual([
        {
          id: 22,
          name: 'Minister of Morale',
          imageFilePath: 'images/badges/minister-of-morale.png',
        },
        {
          id: 7,
          name: 'Ninja',
          imageFilePath: 'images/badges/ninja.png',
        },
        {
          id: 18,
          name: 'Rubber Duck Award',
          imageFilePath: 'images/badges/rubber-duck.png',
        },
        {
          id: 20,
          name: 'Teapot',
          imageFilePath: 'images/badges/teapot.png',
        },
      ]);
    });
    test('add badge to employee with no badges', async () => {
      const patchResponse = await request(server).patch(
        '/employees/49/badges?badgeId=22',
      );
      expect(patchResponse.status).toBe(200);

      // check updated employee info
      const employeeResponse = await request(server).get('/employees/49');
      const employee = employeeResponse.body;
      expect(employee.badgeIds).toEqual([22]);
      expect(employee.badgeDetails).toEqual([
        {
          id: 22,
          name: 'Minister of Morale',
          imageFilePath: 'images/badges/minister-of-morale.png',
        },
      ]);
    });
    test('add badge to employee that already has that badge id', async () => {
      const patchResponse = await request(server).patch(
        '/employees/42/badges?badgeId=21',
      );
      expect(patchResponse.status).toBe(200);

      // check updated employee info
      const employeeResponse = await request(server).get('/employees/42');
      const employee = employeeResponse.body;
      expect(employee.badgeIds).toEqual([6, 21]);
      expect(employee.badgeDetails).toEqual([
        {
          id: 21,
          name: 'Baker Extraordinaire',
          imageFilePath: 'images/badges/baker-extraordinaire.png',
        },
        {
          id: 6,
          name: 'Comic Relief',
          imageFilePath: 'images/badges/comic-relief.png',
        },
      ]);
    });
  });
});
