const getLastAttempts = async (userId) => {
  const user = { idUser: userId };
  const response = await fetch('http://localhost:8083/api/users/last', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error('Error fetching last attempts');
  return response.json();
};

export default getLastAttempts;