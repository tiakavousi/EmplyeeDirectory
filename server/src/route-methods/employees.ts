import { Request, Response } from 'express';

import {
  addEmployeeBadge,
  getEmployeeByIdWithBadgeDetails,
  getFilteredEmployees,
  getSortedEmployees,
} from '../db-func';

export async function getFiltered(
  req: Request,
  res: Response,
): Promise<Response> {
  const { q } = req.query;

  try {
    if (!q) {
      const employees = await getSortedEmployees();
      return res.status(200).json(employees);
    }
    const filteredEmployes = await getFilteredEmployees(q.toString());
    return res.status(200).json(filteredEmployes);
  } catch (e) {
    return res.status(500).json({
      message: `could not get employees: ${e}`,
    });
  }
}

export async function addBadge(req: Request, res: Response): Promise<Response> {
  const { employeeId } = req.params;
  const { badgeId } = req.query;
  if (!badgeId || Number(badgeId) !== parseInt(badgeId, 10)) {
    return res
      .status(400)
      .json({ message: 'badgeId is required to get add badge' });
  }
  try {
    await addEmployeeBadge(Number(employeeId), Number(badgeId));
    return res.status(200).end();
  } catch (e) {
    return res.status(500).json({
      message: `could not add badge id ${badgeId} for employee id ${employeeId}: ${e}`,
    });
  }
}

export async function getById(req: Request, res: Response): Promise<Response> {
  const { id } = req.params;
  try {
    const employee = await getEmployeeByIdWithBadgeDetails(Number(id));
    return res.status(200).json(employee);
  } catch (e) {
    return res.status(404).json({
      message: `Could not find employee id ${id}: ${e}`,
    });
  }
}

export default {
  getFiltered,
  addBadge,
  getById,
};
