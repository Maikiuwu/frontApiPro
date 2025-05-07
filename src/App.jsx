import generatePokemon from './services/generatePokemon'
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchPokemon = async () => {
    try {
      setLoading(true);
      const result = await generatePokemon();
      if (result) {
        setName(result.name);
        setImage(result.image);
      }
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
    } finally {
      setLoading(false);
    }
  }

  const guessPokemon = async ()=> {
    try{

    }catch (error) {
      console.error('Error fetching guess:', error);
    }
  }

  guessPokemon


  // Cargar un Pokémon cuando se inicia la aplicación
  useEffect(() => {
    fetchPokemon()
  }, [])

  return (
    <div className="pokemon-container">
      <h1>Guess Pokémon</h1>
      
      {loading ? (
        <p>Cargando Pokémon...</p>
      ) : (
        <div className="pokemon-card">
          <h2>{name}</h2>
          {image && <img src={image} alt={name} />}
        </div>
      )}
      
      <input type="text" />
      <button onClick={fetchPokemon} disabled={loading}>
        {loading ? 'Cargando...' : 'Generar Nuevo Pokémon'}
      </button>
    </div>
  )
}

export default App