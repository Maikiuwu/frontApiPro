import generatePokemon from '../../services/generatePokemon'
import GuardarIntentos from '../../services/GuardarIntentos'
import ActualizarScore from '../../services/ActualizarScore'
import { useState, useEffect } from 'react'
import getLastAttempts from '../../services/getLastAttempts'
import { useNavigate } from 'react-router-dom' // <-- Agrega esto

import JSConfetti from 'js-confetti'
import addFavorite from '../../services/addFavorite'

const jsConfetti = new JSConfetti()

function App() {
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [value, setValue] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [contador, setContador] = useState(0)
  const [formData, setFormData] = useState({ user: 0, pokemonName: '', spriteUrl: '', attempts: 1 })
  const [ranking, setRanking] = useState([]);
  const [lastAttempts, setLastAttempts] = useState([]);
  const [favMessage, setFavMessage] = useState('');
  const navigate = useNavigate(); // <-- Agrega esto

  // Redirección si no hay usuario logueado
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.idUser) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.idUser) {
      getLastAttempts(user.idUser)
        .then(setLastAttempts)
        .catch(() => setLastAttempts([]));
    }
  }, []);
  const fetchPokemon = async () => {
    try {
      setLoading(true)
      const result = await generatePokemon()
      if (result) {
        setName(result.name)
        setImage(result.image)
      }
    } catch (error) {
      console.error('Error fetching Pokemon:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRanking = () => {
    fetch('http://localhost:8083/api/users/ranking')
      .then(res => res.json())
      .then(data => setRanking(data))
      .catch(() => setRanking([]));
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  const handleGuess = (inputName) => {
    if (!inputName) return;
    setContador(contador + 1);
    setSuccess(false);

    const isCorrect = inputName.trim().toLowerCase() === name.toLowerCase();

    if (isCorrect) {
      const user = JSON.parse(localStorage.getItem('user'));

      // Verificar si el Pokémon ya existe en lastAttempts
      const pokemonExists = lastAttempts.some(poke => poke.toLowerCase() === name.toLowerCase());

      if (!pokemonExists) {
        const newFormData = {
          user: user,
          pokemonName: name,
          spriteUrl: image,
          attempts: contador + 1
        };

        setSuccess(true);
        jsConfetti.addConfetti();
        setFormData(newFormData);
        console.log('formData', newFormData);
        GuardarIntentos(newFormData);
        ActualizarScore(user);
        setValue('');
        setContador(0);
        getLastAttempts(user.idUser)
          .then(setLastAttempts)
          .catch(() => setLastAttempts([]));
      } else {
        setSuccess(true);
        jsConfetti.addConfetti();
        setValue('');
        setContador(0);
      }
    } else {
      setValue('');
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 1500);
    }
  };

  // Cargar un Pokémon cuando se inicia la aplicación
  useEffect(() => {
    fetchPokemon()
  }, [])

  function handleGetNewPokemon() {
    setSuccess(false)
    setValue('')
    fetchPokemon()
    setContador(0)

    // ACTUALIZA LOS ÚLTIMOS 5 POKÉMON
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.idUser) {
      getLastAttempts(user.idUser)
        .then(setLastAttempts)
        .catch(() => setLastAttempts([]));
    }
  }

  // Cerrar sesión
  function handleLogout() {
    localStorage.removeItem('user');
    navigate('/login');
  }

  const handleAddFavorite = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    try {
      await addFavorite({
        user: { idUser: user.idUser }, // SOLO el idUser
        pokemonName: name,
        spriteUrl: image,
      });
      setFavMessage('¡Agregado a favoritos!');
      setTimeout(() => setFavMessage(''), 2000);
    } catch {
      setFavMessage('Ya está en favoritos o hubo un error.');
      setTimeout(() => setFavMessage(''), 2000);
    }
  };

  return (
    <main className="gap-5 bg-[url(https://wallpapers.com/images/featured/pokemon-hd-fazqcs1tmwwte1ap.jpg)] text-white flex flex-col justify-center items-center h-screen  bg-cover bg-center">
      {/* Botones de navegación */}
      <div className="absolute top-6 right-8 flex gap-4 z-20">
        <button
          onClick={() => navigate('/profile')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-lg"
        >
          Mi Perfil
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md shadow-lg"
        >
          Cerrar sesión
        </button>
      </div>
      <div class="flex flex-col justify-center items-center gap-5 p-4 bg-gradient-to-br from-orange-600 to-blue-700 shadow-xl rounded-2xl">
        <h1 className="text-6xl font-bold">Guess Pokémon</h1>
        <div className="container p-4 max-w-xs justify-center items-center flex flex-col gap-5 ">
          {loading ? (
            <p>Cargando Pokémon...</p>
          ) : (
            <div className="flex flex-col justify-center items-center p-4 w-full bg-gray-700 rounded-3xl shadow-xl">
              {success && (
                <h2 className="text-2xl font-bold text-balance text-center mb-4 text-green-400" >
                  Felicidades, el pokemon era {name}
                </h2>
              )}
              {!success && (
                <h2 className="text-4xl font-bold text-balance text-center mb-4 ">
                  ¿Quien es este pokemon?
                </h2>
              )}

              {image && (
                <img
                  src={image}
                  alt={success ? name : "Nombre Pokemon " + name}
                  className={`max-w-4/5 transition-all duration-500 ${success ? 'brightness-100' : 'brightness-0'}`}

                />
              )}
            </div>
          )}
          <div className="flex flex-col gap-5 p-4">
            <form
              className="flex gap-2 justify-center items-center"
              onSubmit={(e) => {
                e.preventDefault()
                handleGuess(e.target[0].value)
              }}
            >
              <input
                type="text"
                className="h-12 text-lg border border-gray-800 bg-gray-500/30 rounded-xl min-w-xs px-2 text-black"
                placeholder="Escribe el nombre del Pokémon"
                onChange={(e) => setValue(e.target.value)}
                value={value}
                required
                id="pokemon-name"
                autoComplete="off"
                disabled={loading || success}
                name="pokemon-name"
              />
              <button
                className="bg-green-800 h-12 px-2 rounded-xl cursor-pointer hover:bg-green-700 transition-colors disabled:bg-gray-500/50 disabled:cursor-not-allowed disabled:text-gray-500"
                type="submit"
                disabled={loading || success}
              >
                Adivinar
              </button>
            </form>
            <button
              onClick={handleGetNewPokemon}
              disabled={loading}
              className="h-12 text-lg border border-blue-500/50 bg-blue-800/40 rounded-xl hover:bg-blue-700 cursor-pointer transition-colors"
            >
              {loading ? 'Cargando...' : 'Generar nuevo pokémon'}
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          {success && (
            <button
              onClick={handleAddFavorite}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded shadow"
            >
              Agregar a favoritos
            </button>
          )}
          {favMessage && (
            <span className="text-green-300 text-sm">{favMessage}</span>
          )}
        </div>
        <div
          className={`flex flex-col gap-5 p-4 bg-red-500 size-40 absolute text-5xl justify-center items-center rounded-xl shadow-xl opacity-0 transition-opacity duration-300 z-10 ${showErrorModal ? 'opacity-100' : ''
            }`}
        >
          <h2>Que noob</h2>
        </div>

      </div>
      <div class="absolute left-0 top-8 border-5 border-solid border-green-600" style={{ minWidth: 300, background: '#222', color: '#fff', borderRadius: 12, padding: 16, marginLeft: 32 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 12 }}>Top 10 Usuarios</h2>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th className="text-left">#</th>
              <th className="text-left">Usuario</th>
              <th className="text-left">Score</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((user, idx) => (
              <tr key={user.id || idx}>
                <td>{idx + 1}</td>
                <td>{user.username}</td>
                <td>{user.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div class="absolute left-0 bottom-8  border-5 border-solid border-blue-700"
        style={{ minWidth: 300, background: '#222', color: '#fff', borderRadius: 12, padding: 16, marginLeft: 32 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 12 }}>Tus últimos 5 Pokémon</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {lastAttempts.length === 0 && <li>No hay intentos recientes.</li>}
          {lastAttempts.slice(0, 5).map((poke, idx) => (
            <li key={idx} style={{ padding: 4, borderBottom: '1px solid #444' }}>{idx + 1} - {poke}</li>
          ))}
        </ul>
      </div>
    </main>
  )
}

export default App
