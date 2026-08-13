import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
dotenv.config();

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

export async function testConnection() {
  const session = driver.session();
  try {
    await session.run('RETURN 1');
    console.log('✅ CognoDB connected');
  } catch (err) {
    console.error('❌ CognoDB connection failed:', err.message);
  } finally {
    await session.close();
  }
}

export function getSession() {
  return driver.session();
}

export default driver;