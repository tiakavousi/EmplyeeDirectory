import cors from 'cors';
import express from 'express';

import badgesRoutes from './route-methods/badges';
import employeesRoutes from './route-methods/employees';

const app = express();

// CORS for react app, assuming port 3000
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

/* ********* middlewares ********* */
// use middleware to serve static images
app.use(express.static('public'));

/* *********** routes ********* */

// get all badges
app.get('/badges', badgesRoutes.get);

// search employees by filter term
app.get('/employees', employeesRoutes.getFiltered);

// get employee by ID
app.get('/employees/:id', employeesRoutes.getById);

// add badge to employee
app.patch('/employees/:employeeId/badges', employeesRoutes.addBadge);

/* *********** END: routes ********* */

export const startUp = async (): Promise<void> => {
  app.listen(3030, () =>
    // eslint-disable-next-line no-console
    console.log('Employee server listening on port 3030!'),
  );
};

export default app;
