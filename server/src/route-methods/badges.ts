import { Request, Response } from 'express';

import { getBadges } from '../db-func';

export async function get(req: Request, res: Response): Promise<Response> {
  try {
    const badges = await getBadges();
    return res.status(200).json(badges);
  } catch (e) {
    return res.status(500).json({ message: `could not get badges: ${e}` });
  }
}

export default {
  get,
};
