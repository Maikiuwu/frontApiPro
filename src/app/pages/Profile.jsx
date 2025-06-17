import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import getLastAttempts from '../../services/getLastAttempts';
import getFavorites from '../../services/getFavorites';

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [lastAttempts, setLastAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pokemonData, setPokemonData] = useState({});
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.idUser) {
      console.log('No hay usuario en localStorage');
      navigate('/login');
      return;
    }

    setUserProfile(user);
    setLoading(false);

    getLastAttempts(user.idUser)
      .then(attempts => {
        setLastAttempts(attempts);
        // Obtener datos de cada Pokémon
        attempts.forEach(pokemon => {
          fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`)
            .then(res => res.json())
            .then(data => {
              setPokemonData(prev => ({
                ...prev,
                [pokemon]: {
                  id: data.id,
                  image: data.sprites.other['official-artwork'].front_default
                }
              }));
            })
        });
      })
  }, [navigate]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    // ...existing code...
    getFavorites(user)
      .then(setFavorites)
      .catch(() => setFavorites([]));
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url(https://wallpapers.com/images/featured/pokemon-hd-fazqcs1tmwwte1ap.jpg)] bg-cover bg-center">
        <div className="text-white text-2xl">Cargando perfil...</div>
      </div>
    );
  }

  function getPokemonIdFromSpriteUrl(url) {
    const match = url.match(/\/(\d+)\.png$/);
    return match ? match[1] : '';
  }

  const sortedFavorites = [...favorites].sort((a, b) => {
    const idA = parseInt(getPokemonIdFromSpriteUrl(a.spriteUrl));
    const idB = parseInt(getPokemonIdFromSpriteUrl(b.spriteUrl));
    return idA - idB; // ascendente
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 to-orange-700 shadow-xl- bg-cover bg-center">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Mi PokePerfil</h1>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/guess')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
            >
              Volver al Juego
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('user');
                navigate('/login');
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-8">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Información del Perfil */}
          <div className="bg-gray-800/80 p-6 rounded-xl shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Información Personal</h2>
            {userProfile ? (
              <div className="space-y-4 text-white">
                <p><span className="font-semibold">Nombre:</span> {userProfile.name || 'No disponible'} {userProfile.lastName || ''}</p>
                <p><span className="font-semibold">Usuario:</span> {userProfile.username || 'No disponible'}</p>
                <p><span className="font-semibold">Email:</span> {userProfile.email || 'No disponible'}</p>
                <div className="bg-white/10 p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-2">Puntuación</h3>
                  <p className="text-3xl font-bold text-yellow-400">{lastAttempts.length} Pokémon</p>
                </div>
              </div>
            ) : (
              <p className="text-white">No se pudo cargar la información del perfil</p>
            )}
          </div>

          {/* Últimos Intentos */}
          <div className="bg-gray-800/80 p-6 rounded-xl shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Últimos 5 pokemones Adivinados</h2>
            <ul className="space-y-2">
              {lastAttempts.length === 0 ? (
                <li className="text-white">No hay intentos recientes</li>
              ) : (
                <ul>
                  {lastAttempts.map((pokemon, index) => (
                    <li key={index} className="text-white border-b border-gray-700 pb-2">
                      {index + 1}. {pokemon}
                    </li>
                  ))}
                </ul>
              )}
            </ul>
          </div>
        </div>


        <div className="Favoritos bg-gray-800/80 p-6 rounded-xl shadow-xl mb-3">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Mis favoritos</h2>
          {sortedFavorites.length === 0 ? (
            <div className="text-white text-center">No tienes favoritos aún.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedFavorites.map((fav, idx) => {
                const pokemonId = getPokemonIdFromSpriteUrl(fav.spriteUrl);
                return (
                  <div key={idx} className="bg-gray-500 rounded-xl shadow-lg flex flex-col items-center p-4">
                    <img
                      src={fav.spriteUrl}
                      alt={fav.pokemonName}
                      className="w-24 h-24 object-contain mb-2"
                    />
                    <div className="text-white font-bold text-lg">
                      {fav.pokemonName?.charAt(0).toUpperCase() + fav.pokemonName?.slice(1)}
                    </div>
                    <div className="text-white text-sm">#{pokemonId}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="Pokedex bg-gray-800/80 p-6 rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Mi Pokédex</h2>

        </div>
      </div>
    </main>
  );
}