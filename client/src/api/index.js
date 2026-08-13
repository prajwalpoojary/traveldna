const BASE_URL = import.meta.env.VITE_API_URL;

export async function getTravelers() {
  const res = await fetch(`${BASE_URL}/travelers`);
  if (!res.ok) throw new Error('Failed to fetch travelers');
  return res.json();
}

export async function getTraveler(id) {
  const res = await fetch(`${BASE_URL}/travelers/${id}`);
  if (!res.ok) throw new Error('Failed to fetch traveler');
  return res.json();
}

export async function createTraveler(data) {
  const res = await fetch(`${BASE_URL}/travelers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create traveler');
  return res.json();
}

export async function getRecommendations(id) {
  const res = await fetch(`${BASE_URL}/recommendations/${id}`);
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  return res.json();
}

export async function getHotels() {
  const res = await fetch(`${BASE_URL}/hotels`);
  if (!res.ok) throw new Error('Failed to fetch hotels');
  return res.json();
}

export async function getHotel(id) {
  const res = await fetch(`${BASE_URL}/hotels/${id}`);
  if (!res.ok) throw new Error('Failed to fetch hotel');
  return res.json();
}