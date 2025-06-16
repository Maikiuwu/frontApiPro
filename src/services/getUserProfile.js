const getUserProfile = async (userId) => {
    console.log('Enviando petición para userId:', userId);
    const response = await fetch('http://localhost:8083/api/users/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idUser: userId }),
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Error fetching user profile');
    return response.json();
};

export default getUserProfile; 