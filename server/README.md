# Employee Directory Server

### A REST API server for the "Employee Directory" app

## Installing

Run `npm install`

## Starting the server

Run `npm start`. The server will be found at [http://localhost:3030]

## Server routes

### GET `/badges`

Get information for all badges.

**URL params**: none
**Query params**: none
**Returns**: JSON array of all badges. See `/src/types/index.ts` for properties of `Badge` type.

### GET `/employees?q=`

Get information for employees whose name and/or job title match the filter string, case insensitive

**URL params**: none
**Query params**: `q`, the term for which to filter employees
**Returns**: JSON array of employees (without badge details), filtered by the `q` term. See `/src/types/index.ts` for properties of `Employee` type.

#### Example: `/employees?q=ann`

### GET `/employees/:employeeId`

Get information for an employee by ID.

**URL params**: `:employeeId`, ID of the employee for whom to get information
**Query params**: none
**Returns**: JSON Employee object with badge details. See `/src/types/index.ts` for properties of `EmployeeWithBadgeDetails` type.

#### Example: `/employees/123`

### PATCH `/employees/:employeeId/badges?badgeId=`

Add a badge for an employee (if the employee doesn't already have the badge).

**URL params**: `:employeeId`, ID of the employee for whom to get information
**Query params**: none
**Returns**: JSON Employee object with badge details. See `/src/types/index.ts` for properties of `EmployeeWithBadgeDetails` type.

#### Example: `/employees/123/badges?badgeId=456`
