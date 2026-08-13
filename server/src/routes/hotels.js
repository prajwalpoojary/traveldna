import express from 'express';
import { getSession } from '../db.js';

const router = express.Router();

// GET all hotels
router.get('/', async (req, res) => {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (h:Hotel)-[:LOCATED_IN]->(d:Destination)
       RETURN h, d
       ORDER BY h.name`
    );
    const hotels = result.records.map(r => ({
      ...r.get('h').properties,
      destination: r.get('d').properties,
    }));
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});

// GET hotel detail with all connections
router.get('/:id', async (req, res) => {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (h:Hotel {id: $id})-[:LOCATED_IN]->(d:Destination)
       OPTIONAL MATCH (h)-[:OFFERS]->(e:Experience)
       OPTIONAL MATCH (h)-[:OFFERS]->(f:Facility)
       OPTIONAL MATCH (t:Traveler)-[:STAYED_AT]->(h)
       RETURN h, d,
         collect(DISTINCT e) as experiences,
         collect(DISTINCT f) as facilities,
         collect(DISTINCT t) as guests`,
      { id: req.params.id }
    );

    if (result.records.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const record = result.records[0];
    res.json({
      ...record.get('h').properties,
      destination: record.get('d').properties,
      experiences: record.get('experiences').map(e => e.properties),
      facilities: record.get('facilities').map(f => f.properties),
      guests: record.get('guests').map(t => t.properties),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});

export default router;