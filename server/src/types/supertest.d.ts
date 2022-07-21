import supertest from 'supertest';

declare global {
  namespace NodeJS {
    interface Global {
      agent: supertest.SuperTest<supertest.Test>;
    }
  }
}

// declare namespace NodeJS {
//   interface Global {
//     agent: supertest.SuperTest<supertest.Test>;
//   }
// }
