const removeFavorites = async (favorite) => {

  const response = await fetch('http://localhost:8083/api/favorites/remove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(favorite),
  });
  if (!response.ok) throw new Error('Error al obtener favoritos');
};

export { removeFavorites };