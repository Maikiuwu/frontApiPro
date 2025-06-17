const getFavorites = async (user) => {
  const response = await fetch('http://localhost:8083/api/favorites/getByUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error('Error al obtener favoritos');
  return response.json();
};

export default getFavorites;