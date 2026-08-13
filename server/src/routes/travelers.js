import express from 'express';
import { getSession } from '../db.js';

const router = express.Router();

// GET all travelers
router.get('/', async (req, res) => {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (t:Traveler)
       RETURN t
       ORDER BY t.name`
    );
    const travelers = result.records.map(r => r.get('t').properties);
    res.json(travelers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});

// GET single traveler with their full profile
router.get('/:id', async (req, res) => {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (t:Traveler {id: $id})
       OPTIONAL MATCH (t)-[:VISITED]->(d:Destination)
       OPTIONAL MATCH (t)-[:STAYED_AT]->(h:Hotel)
       OPTIONAL MATCH (t)-[:PREFERS]->(e:Experience)
       OPTIONAL MATCH (t)-[:AVOIDS]->(f:Facility)
       RETURN t,
         collect(DISTINCT d) as visited,
         collect(DISTINCT h) as stayed,
         collect(DISTINCT e) as prefers,
         collect(DISTINCT f) as avoids`,
      { id: req.params.id }
    );
    if (result.records.length === 0) {
      return res.status(404).json({ error: 'Traveler not found' });
    }
    const record = result.records[0];
    res.json({
      ...record.get('t').properties,
      visited: record.get('visited').map(d => d.properties),
      stayed: record.get('stayed').map(h => h.properties),
      prefers: record.get('prefers').map(e => e.properties),
      avoids: record.get('avoids').map(f => f.properties),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});

// POST create new traveler
router.post('/', async (req, res) => {
  const session = getSession();
  const { name, budget_band, travel_style, prefers = [], avoids = [] } = req.body;
  const id = `t${Date.now()}`;

  try {
    await session.run(
      `CREATE (t:Traveler {id: $id, name: $name, budget_band: $budget_band, travel_style: $travel_style})`,
      { id, name, budget_band, travel_style }
    );

    for (const eId of prefers) {
      await session.run(
        `MATCH (t:Traveler {id: $id}), (e:Experience {id: $eId})
         CREATE (t)-[:PREFERS]->(e)`,
        { id, eId }
      );
    }

    for (const fId of avoids) {
      await session.run(
        `MATCH (t:Traveler {id: $id}), (f:Facility {id: $fId})
         CREATE (t)-[:AVOIDS]->(f)`,
        { id, fId }
      );
    }

    res.json({ id, name, budget_band, travel_style });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});

export default router;