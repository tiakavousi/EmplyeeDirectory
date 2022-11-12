// NOTE: in production this would connect to a database,
// not JSON files. However, I didn't want to make folks install
// a particular database in order to use this server.
//
// This "database" is horribly inefficient and will be a problem
// when SongRiver scales to hundreds of thousands of employees.
import { promises as fs } from 'fs';
import path from 'path';

import { Badge, Employee, EmployeeWithBadgeDetails } from '../types';

if (!process.env.DB_PATH)
  throw new Error('DB_PATH must be defined as an environment variable');
const dbPath = process.env.DB_PATH;

enum filenames {
  badges = 'badges.json',
  employees = 'employees.json',
}

type FileDataType = Badge | Employee;

/* ****** Read from file ***** */
async function getJSONfromFile<DataType>(
  filename: filenames,
): Promise<DataType> {
  const filePath = path.join(dbPath, filename);
  const data = await fs.readFile(filePath);
  return JSON.parse(data.toString());
}

/* ****** Write to file ***** */
async function writeJSONToFile(
  filename: filenames,
  data: Array<FileDataType>,
): Promise<void> {
  const filePath = path.join(dbPath, filename);
  const jsonData = JSON.stringify(data);
  await fs.writeFile(filePath, jsonData, { flag: 'w' });
}

/* ****** Badges ***** */
export async function getBadges(): Promise<Array<Badge>> {
  return getJSONfromFile(filenames.badges);
}

async function getBadgeById(badgeId: number): Promise<Badge> {
  const badges = await getBadges();
  const badgeMatches = badges.filter((badge) => badge.id === badgeId);
  if (badgeMatches.length !== 1)
    throw new Error(`Error finding badge id ${badgeId}`);
  return badgeMatches[0];
}

async function addEmployeeBadgeDetails(
  employee: Employee,
): Promise<EmployeeWithBadgeDetails> {
  const badgeDetails = await Promise.all(
    employee.badgeIds.map((badgeId: number) => getBadgeById(badgeId)),
  );
  const sortedBadgeDetails = badgeDetails.sort((a, b) =>
    b.name > a.name ? -1 : 1,
  );
  return { ...employee, badgeDetails: sortedBadgeDetails };
}

async function addBadgeDetailsToEmployees(
  employees: Array<Employee>,
): Promise<Array<EmployeeWithBadgeDetails>> {
  return Promise.all(employees.map(addEmployeeBadgeDetails));
}

/* ****** Employees ***** */

export async function getSortedEmployees(): Promise<Array<Employee>> {
  const employees: Array<Employee> = await getJSONfromFile(filenames.employees);
  return employees.sort((a, b) => {
    if (b.firstName === a.firstName) return b.lastName > a.lastName ? -1 : 1;
    return b.firstName > a.firstName ? -1 : 1;
  });
}

export async function getSortedEmployeesWithBadgeDetails(): Promise<
  Array<EmployeeWithBadgeDetails>
> {
  const employees = await getSortedEmployees();
  return addBadgeDetailsToEmployees(employees);
}

export async function getFilteredEmployees(
  q: string,
): Promise<Array<Employee>> {
  const employees = await getSortedEmployees();
  const lowerq = q.toLowerCase();
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(lowerq) ||
      employee.lastName.toLowerCase().includes(lowerq),
  );
  return filteredEmployees;
}

async function getEmployeeById(employeeId: number): Promise<Employee> {
  const employees = await getSortedEmployees();
  const employeeMatches = employees.filter(
    (employee) => employee.id === employeeId,
  );
  if (employeeMatches.length === 0)
    throw new Error(`No employee exists with id ${employeeId}`);
  return employeeMatches[0];
}

export async function getEmployeeByIdWithBadgeDetails(
  employeeId: number,
): Promise<EmployeeWithBadgeDetails> {
  const employee = await getEmployeeById(employeeId);
  return addEmployeeBadgeDetails(employee);
}

export async function addEmployeeBadge(
  employeeId: number,
  badgeId: number,
): Promise<void> {
  const employee = await getEmployeeById(employeeId);
  if (!employee.badgeIds.includes(badgeId)) {
    employee.badgeIds.push(badgeId);
  }
  const employees = await getSortedEmployees();
  const newEmployees = employees.filter((e) => e.id !== employeeId);
  newEmployees.push(employee);
  await writeJSONToFile(filenames.employees, newEmployees);
}
