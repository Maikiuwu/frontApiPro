const getUserProfile = async (userId) => {
  try {
    console.log('Enviando petición para userId:', userId);
    const response = await fetch('http://localhost:8083/api/users/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idUser: userId }),
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error al obtener el perfil: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Respuesta del servidor:', data);
    return data;
  } catch (error) {
    console.error('Error completo:', error);
    throw error;
  }
};

export default getUserProfile; 