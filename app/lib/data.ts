import postgres from 'postgres';
import {
  UserStrategies,
  LatestAssignedStrategy,
  AssignedStrategies,
} from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchUserStrategies(userId: string) {
  try {
    const data = await sql<UserStrategies[]>`
      SELECT user_strategies.strategies
      FROM user_strategies
      WHERE user_strategies.user_id = ${userId}
    `;

    const strategiesArray = data.map((item) => item.strategies);

    return strategiesArray;
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

export async function fetchAssignedStrategies(userId: string) {
  try {
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
