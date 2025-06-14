    const GuardarIntentos = async (tries) => {
    try {
      const respuesta = await fetch('http://localhost:8083/api/users/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tries),
      });
    } catch (error) {
      console.error('Error al guardar:', error); 
    }
  };
  export default GuardarIntentos;