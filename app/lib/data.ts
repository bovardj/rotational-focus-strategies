import postgres from 'postgres';
import {
  UserStrategies,
  LatestAssignedStrategy,
  AssignedStrategies,
} from './definitions';
import { formatCurrency } from './utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchUserStrategies() {
  try {
    const userId = process.env.USER_ID;
    if (!userId) {
      throw new Error('USER_ID is not defined in the environment variables.');
    }

    const data = await sql<UserStrategies[]>`
      SELECT strategies.strategies
      FROM strategies
      WHERE strategies.user_id = ${userId}
    `;

    // const data = await sql<UserStrategies[]>`SELECT * FROM strategies`;

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user strategy data.');
  }
}

export async function fetchLatestAssignedStrategy() {
  try {
    const userId = process.env.USER_ID;
    if (!userId) {
      throw new Error('USER_ID is not defined in the environment variables.');
    }

    const data = await sql<LatestAssignedStrategy[]>`
      SELECT assigned_strategies.strategy, assigned_strategies.date
      FROM assigned_strategies
      WHERE assigned_strategies.user_id = ${userId}
      ORDER BY assigned_strategies.date DESC
      LIMIT 1`;

      return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest assigned strategy.');
  }
}

export async function fetchAssignedStrategies() {
  try {
    const userId = process.env.USER_ID;
    if (!userId) {
      throw new Error('USER_ID is not defined in the environment variables.');
    }

    const data = await sql<AssignedStrategies[]>`
      SELECT assigned_strategies.strategy, assigned_strategies.date
      FROM assigned_strategies
      WHERE assigned_strategies.user_id = ${userId}
      ORDER BY assigned_strategies.date DESC`;

      return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the assigned strategies.');
  }
}
