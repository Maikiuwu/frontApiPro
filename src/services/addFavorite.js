const addFavorite = async (favorite) => {
  const response = await fetch('http://localhost:8083/api/favorites/favourite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(favorite),
  });
  if (!response.ok) throw new Error('No se pudo agregar a favoritos');
  return response.json();
};

export default addFavorite;