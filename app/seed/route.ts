import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { users, selected_strategies, assigned_strategies } from '../lib/seed-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      phone VARCHAR(20)
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password, phone)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.phone})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedStrategies() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS strategies (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL,
      strategies TEXT[] NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  const insertedStrategies = await Promise.all(
    selected_strategies.map(
      (strategies) => sql`
        INSERT INTO strategies (user_id, strategies)
        VALUES (${strategies.user_id}, ${strategies.strategies})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedStrategies;
}

async function seedAssignedStrategies() {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await sql`
      CREATE TABLE IF NOT EXISTS assigned_strategies (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID NOT NULL,
        strategy TEXT NOT NULL,
        date DATE NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;
    const insertedAssignedStrategies = await Promise.all(
        assigned_strategies.map(
            (assigned_strategy) => sql`
            INSERT INTO assigned_strategies (user_id, strategy, date)
            VALUES (${assigned_strategy.user_id}, ${assigned_strategy.strategy}, ${assigned_strategy.date})
            ON CONFLICT (user_id) DO NOTHING;
            `,
        ),
        );
    console.log('Inserted Assigned Strategies:', insertedAssignedStrategies);
    return insertedAssignedStrategies;
}

export async function GET() {
  try {
    const result = await sql.begin((sql) => [
      seedUsers(),
      seedStrategies(),
      seedAssignedStrategies(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}