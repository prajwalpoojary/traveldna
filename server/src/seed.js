import { getSession } from './db.js';
import dotenv from 'dotenv';
dotenv.config();

const destinations = [
  { id: 'd1', name: 'Varanasi', region: 'North India', type: 'spiritual' },
  { id: 'd2', name: 'Udaipur', region: 'Rajasthan', type: 'luxury' },
  { id: 'd3', name: 'Coorg', region: 'Karnataka', type: 'nature' },
  { id: 'd4', name: 'Hampi', region: 'Karnataka', type: 'heritage' },
  { id: 'd5', name: 'Pondicherry', region: 'South India', type: 'wellness' },
  { id: 'd6', name: 'Jaisalmer', region: 'Rajasthan', type: 'adventure' },
];

const hotels = [
  { id: 'h1', name: 'Brijrama Palace', city: 'Varanasi', stars: 5, price_band: 'luxury' },
  { id: 'h2', name: 'Assi Ghat Retreat', city: 'Varanasi', stars: 3, price_band: 'budget' },
  { id: 'h3', name: 'Taj Lake Palace', city: 'Udaipur', stars: 5, price_band: 'luxury' },
  { id: 'h4', name: 'Raas Devigarh', city: 'Udaipur', stars: 5, price_band: 'luxury' },
  { id: 'h5', name: 'Evolve Back Coorg', city: 'Coorg', stars: 5, price_band: 'luxury' },
  { id: 'h6', name: 'Coorg Wilderness', city: 'Coorg', stars: 3, price_band: 'mid' },
  { id: 'h7', name: 'Hampi Boulder Resort', city: 'Hampi', stars: 3, price_band: 'mid' },
  { id: 'h8', name: 'Kishkinda Heritage', city: 'Hampi', stars: 2, price_band: 'budget' },
  { id: 'h9', name: 'Le Pondy', city: 'Pondicherry', stars: 4, price_band: 'mid' },
  { id: 'h10', name: 'Palais de Mahe', city: 'Pondicherry', stars: 5, price_band: 'luxury' },
  { id: 'h11', name: 'Suryagarh Jaisalmer', city: 'Jaisalmer', stars: 5, price_band: 'luxury' },
  { id: 'h12', name: 'Desert Haveli', city: 'Jaisalmer', stars: 3, price_band: 'mid' },
];

const experiences = [
  { id: 'e1', name: 'Ganga Aarti', type: 'spiritual' },
  { id: 'e2', name: 'Temple Circuit', type: 'spiritual' },
  { id: 'e3', name: 'Meditation Retreat', type: 'wellness' },
  { id: 'e4', name: 'Heritage Walk', type: 'heritage' },
  { id: 'e5', name: 'Lake Boating', type: 'leisure' },
  { id: 'e6', name: 'Coffee Plantation Tour', type: 'nature' },
  { id: 'e7', name: 'Wildlife Safari', type: 'nature' },
  { id: 'e8', name: 'Ruins Exploration', type: 'heritage' },
  { id: 'e9', name: 'French Quarter Walk', type: 'leisure' },
  { id: 'e10', name: 'Ayurveda Spa', type: 'wellness' },
  { id: 'e11', name: 'Camel Safari', type: 'adventure' },
  { id: 'e12', name: 'Desert Camp', type: 'adventure' },
  { id: 'e13', name: 'Fine Dining', type: 'luxury' },
  { id: 'e14', name: 'Cooking Class', type: 'leisure' },
];

const facilities = [
  { id: 'f1', name: 'Infinity Pool' },
  { id: 'f2', name: 'Spa' },
  { id: 'f3', name: 'Airport Transfer' },
  { id: 'f4', name: 'River View' },
  { id: 'f5', name: 'Pet Friendly' },
  { id: 'f6', name: 'Vegan Menu' },
  { id: 'f7', name: 'Adventure Desk' },
  { id: 'f8', name: 'Yoga Studio' },
];

const travelers = [
  { id: 't1', name: 'Arjun Mehta', budget_band: 'luxury', travel_style: 'spiritual' },
  { id: 't2', name: 'Priya Sharma', budget_band: 'mid', travel_style: 'wellness' },
  { id: 't3', name: 'Rohit Das', budget_band: 'budget', travel_style: 'heritage' },
  { id: 't4', name: 'Sneha Iyer', budget_band: 'luxury', travel_style: 'luxury' },
  { id: 't5', name: 'Karthik Nair', budget_band: 'mid', travel_style: 'adventure' },
  { id: 't6', name: 'Meera Pillai', budget_band: 'mid', travel_style: 'spiritual' },
  { id: 't7', name: 'Vikram Singh', budget_band: 'luxury', travel_style: 'luxury' },
  { id: 't8', name: 'Divya Rao', budget_band: 'budget', travel_style: 'nature' },
  { id: 't9', name: 'Anil Kumar', budget_band: 'mid', travel_style: 'heritage' },
  { id: 't10', name: 'Pooja Nambiar', budget_band: 'luxury', travel_style: 'wellness' },
];

async function seed() {
  const session = getSession();

  try {
    // console.log('🌱 Clearing existing data...');
    // await session.run('MATCH (n) DETACH DELETE n');
    console.log('🗑️ Clearing existing data...');
    const clearResult = await session.run('MATCH (n) DETACH DELETE n RETURN count(n) as deleted');
    console.log('Cleared nodes:', clearResult.records[0]?.get('deleted')?.toNumber());

    console.log('📍 Creating Destinations...');
    for (const d of destinations) {
      await session.run(
        'CREATE (:Destination {id: $id, name: $name, region: $region, type: $type})',
        d
      );
    }

    console.log('🏨 Creating Hotels...');
    for (const h of hotels) {
      await session.run(
        'CREATE (:Hotel {id: $id, name: $name, city: $city, stars: $stars, price_band: $price_band})',
        h
      );
    }

    console.log('🎯 Creating Experiences...');
    for (const e of experiences) {
      await session.run(
        'CREATE (:Experience {id: $id, name: $name, type: $type})',
        e
      );
    }

    console.log('🏊 Creating Facilities...');
    for (const f of facilities) {
      await session.run(
        'CREATE (:Facility {id: $id, name: $name})',
        f
      );
    }

    console.log('👤 Creating Travelers...');
    for (const t of travelers) {
      await session.run(
        'CREATE (:Traveler {id: $id, name: $name, budget_band: $budget_band, travel_style: $travel_style})',
        t
      );
    }

    // ── Relationships ─────────────────────────────────────────

    console.log('🔗 Creating Hotel → Destination relationships...');
    const hotelDestinations = [
      ['h1', 'd1'], ['h2', 'd1'],
      ['h3', 'd2'], ['h4', 'd2'],
      ['h5', 'd3'], ['h6', 'd3'],
      ['h7', 'd4'], ['h8', 'd4'],
      ['h9', 'd5'], ['h10', 'd5'],
      ['h11', 'd6'], ['h12', 'd6'],
    ];
    for (const [hId, dId] of hotelDestinations) {
      await session.run(
        `MATCH (h:Hotel {id: $hId}), (d:Destination {id: $dId})
         CREATE (h)-[:LOCATED_IN]->(d)`,
        { hId, dId }
      );
    }

    console.log('🔗 Creating Hotel → Experience relationships...');
    const hotelExperiences = [
      ['h1', 'e1'], ['h1', 'e2'], ['h1', 'e13'],
      ['h2', 'e1'], ['h2', 'e2'], ['h2', 'e14'],
      ['h3', 'e5'], ['h3', 'e13'], ['h3', 'e10'],
      ['h4', 'e5'], ['h4', 'e4'], ['h4', 'e13'],
      ['h5', 'e6'], ['h5', 'e7'], ['h5', 'e10'],
      ['h6', 'e6'], ['h6', 'e7'], ['h6', 'e14'],
      ['h7', 'e8'], ['h7', 'e4'], ['h7', 'e14'],
      ['h8', 'e8'], ['h8', 'e4'],
      ['h9', 'e9'], ['h9', 'e10'], ['h9', 'e14'],
      ['h10', 'e9'], ['h10', 'e10'], ['h10', 'e13'],
      ['h11', 'e11'], ['h11', 'e12'], ['h11', 'e13'],
      ['h12', 'e11'], ['h12', 'e12'],
    ];
    for (const [hId, eId] of hotelExperiences) {
      await session.run(
        `MATCH (h:Hotel {id: $hId}), (e:Experience {id: $eId})
         CREATE (h)-[:OFFERS]->(e)`,
        { hId, eId }
      );
    }

    console.log('🔗 Creating Hotel → Facility relationships...');
    const hotelFacilities = [
      ['h1', 'f4'], ['h1', 'f2'], ['h1', 'f3'],
      ['h2', 'f4'], ['h2', 'f6'],
      ['h3', 'f1'], ['h3', 'f2'], ['h3', 'f3'],
      ['h4', 'f1'], ['h4', 'f2'], ['h4', 'f8'],
      ['h5', 'f1'], ['h5', 'f2'], ['h5', 'f5'],
      ['h6', 'f5'], ['h6', 'f6'], ['h6', 'f7'],
      ['h7', 'f7'], ['h7', 'f6'],
      ['h8', 'f6'],
      ['h9', 'f8'], ['h9', 'f6'], ['h9', 'f2'],
      ['h10', 'f1'], ['h10', 'f2'], ['h10', 'f8'],
      ['h11', 'f1'], ['h11', 'f2'], ['h11', 'f3'],
      ['h12', 'f7'], ['h12', 'f3'],
    ];
    for (const [hId, fId] of hotelFacilities) {
      await session.run(
        `MATCH (h:Hotel {id: $hId}), (f:Facility {id: $fId})
         CREATE (h)-[:OFFERS]->(f)`,
        { hId, fId }
      );
    }

    console.log('🔗 Creating Destination → Similar relationships...');
    const similarDestinations = [
      ['d1', 'd5'], // Varanasi ↔ Pondicherry (spiritual/wellness)
      ['d5', 'd1'],
      ['d2', 'd6'], // Udaipur ↔ Jaisalmer (Rajasthan luxury)
      ['d6', 'd2'],
      ['d3', 'd4'], // Coorg ↔ Hampi (Karnataka)
      ['d4', 'd3'],
    ];
    for (const [d1, d2] of similarDestinations) {
      await session.run(
        `MATCH (a:Destination {id: $d1}), (b:Destination {id: $d2})
         CREATE (a)-[:SIMILAR_TO]->(b)`,
        { d1, d2 }
      );
    }

    console.log('🔗 Creating Traveler relationships...');
    const travelerData = [
      // [travelerId, visited destinations, stayed hotels, preferred experiences, avoided facilities]
      { id: 't1', visited: ['d1', 'd2'], stayed: ['h5', 'h12'], prefers: ['e1', 'e2', 'e13'], avoids: [] },
      { id: 't2', visited: ['d5', 'd3'], stayed: ['h9', 'h5'], prefers: ['e10', 'e3', 'e6'], avoids: ['f7'] },
      { id: 't3', visited: ['d4', 'd1'], stayed: ['h8', 'h2'], prefers: ['e8', 'e4', 'e2'], avoids: ['f1'] },
      { id: 't4', visited: ['d2', 'd6'], stayed: ['h5', 'h9'], prefers: ['e13', 'e5', 'e11'], avoids: [] },
      { id: 't5', visited: ['d6', 'd3'], stayed: ['h12', 'h6'], prefers: ['e11', 'e12', 'e7'], avoids: ['f2'] },
      { id: 't6', visited: ['d1', 'd5'], stayed: ['h3', 'h6'], prefers: ['e1', 'e3', 'e9'], avoids: [] },
      { id: 't7', visited: ['d2', 'd5'], stayed: ['h6', 'h7'], prefers: ['e13', 'e10', 'e5'], avoids: [] },
      { id: 't8', visited: ['d3', 'd4'], stayed: ['h6', 'h7'], prefers: ['e6', 'e7', 'e8'], avoids: ['f3'] },
      { id: 't9', visited: ['d4', 'd6'], stayed: ['h7', 'h12'], prefers: ['e8', 'e4', 'e12'], avoids: [] },
      { id: 't10', visited: ['d5', 'd2'], stayed: ['h10', 'h3'], prefers: ['e10', 'e3', 'e13'], avoids: ['f7'] },
    ];

    for (const t of travelerData) {
      for (const dId of t.visited) {
        await session.run(
          `MATCH (t:Traveler {id: $tId}), (d:Destination {id: $dId})
           CREATE (t)-[:VISITED]->(d)`,
          { tId: t.id, dId }
        );
      }
      for (const hId of t.stayed) {
        await session.run(
          `MATCH (t:Traveler {id: $tId}), (h:Hotel {id: $hId})
           CREATE (t)-[:STAYED_AT]->(h)`,
          { tId: t.id, hId }
        );
      }
      for (const eId of t.prefers) {
        await session.run(
          `MATCH (t:Traveler {id: $tId}), (e:Experience {id: $eId})
           CREATE (t)-[:PREFERS]->(e)`,
          { tId: t.id, eId }
        );
      }
      for (const fId of t.avoids) {
        await session.run(
          `MATCH (t:Traveler {id: $tId}), (f:Facility {id: $fId})
           CREATE (t)-[:AVOIDS]->(f)`,
          { tId: t.id, fId }
        );
      }
    }

    console.log('✅ Seed complete!');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await session.close();
    process.exit(0);
  }
}

seed();