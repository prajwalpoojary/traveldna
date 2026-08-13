import express from 'express';
import { getSession } from '../db.js';

const router = express.Router();

// MAIN RECOMMENDATIONS ROUTE
router.get('/:id', async (req, res) => {
  const session = getSession();
  try {
    const destResult = await session.run(
      `MATCH (t:Traveler {id: $id})-[:STAYED_AT]->(stayed:Hotel)
      WITH t, collect(stayed.id) as stayedIds
      MATCH (t)-[:VISITED]->(d:Destination)-[:SIMILAR_TO]->(similar:Destination)<-[:LOCATED_IN]-(h:Hotel)
      WHERE NOT h.id IN stayedIds
      OPTIONAL MATCH (h)-[:OFFERS]->(e:Experience)<-[:PREFERS]-(t)
      RETURN h, similar, d.name as becauseYouVisited, collect(e.name) as matchingExperiences
      ORDER BY size(collect(e.name)) DESC
      LIMIT 6`,
      { id: req.params.id }
    );

    const similarResult = await session.run(
      `MATCH (t:Traveler {id: $id})-[:STAYED_AT]->(stayed:Hotel)
      WITH t, collect(stayed.id) as stayedIds
      MATCH (t)-[:PREFERS]->(e:Experience)<-[:PREFERS]-(similar:Traveler)-[:STAYED_AT]->(h:Hotel)
      WHERE NOT h.id IN stayedIds
      AND t.budget_band = similar.budget_band
      AND similar.id <> $id
      MATCH (h)-[:LOCATED_IN]->(d:Destination)
      RETURN h, d, COUNT(similar) as popularity
      ORDER BY popularity DESC
      LIMIT 4`,
      { id: req.params.id }
    );

    const destinationRecs = destResult.records.map(r => ({
      hotel: r.get('h').properties,
      similarTo: r.get('similar').properties,
      becauseYouVisited: r.get('becauseYouVisited'),
      matchingExperiences: r.get('matchingExperiences'),
      reason: 'destination_match',
    }));

    const socialRecs = similarResult.records.map(r => ({
      hotel: r.get('h').properties,
      destination: r.get('d').properties,
      popularity: r.get('popularity').toNumber(),
      reason: 'travelers_like_you',
    }));

    res.json({
      destinationBased: destinationRecs,
      socialBased: socialRecs,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});

export default router;