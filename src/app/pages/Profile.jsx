import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import getLastAttempts from '../../services/getLastAttempts';

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [lastAttempts, setLastAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pokemonData, setPokemonData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('Usuario del localStorage:', user);
    
    if (!user || !user.idUser) {
      console.log('No hay usuario en localStorage');
      navigate('/login');
      return;
    }

    setUserProfile(user);
    setLoading(false);

    getLastAttempts(user.idUser)
      .then(attempts => {
        console.log('Datos de intentos recibidos:', attempts);
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
            .catch(error => {
              console.error(`Error al obtener datos de ${pokemon}:`, error);
            });
        });
      })
      .catch(error => {
        console.error('Error al obtener intentos:', error);
        setError('Error al cargar los intentos recientes');
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url(https://wallpapers.com/images/featured/pokemon-hd-fazqcs1tmwwte1ap.jpg)] bg-cover bg-center">
        <div className="text-white text-2xl">Cargando perfil...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[url(https://wallpapers.com/images/featured/pokemon-hd-fazqcs1tmwwte1ap.jpg)] bg-cover bg-center">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Mi Perfil</h1>
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
                <p><span className="font-semibold">Puntuación:</span> {userProfile.score || 0}</p>
              </div>
            ) : (
              <p className="text-white">No se pudo cargar la información del perfil</p>
            )}
          </div>

          {/* Últimos Intentos */}
          <div className="bg-gray-800/80 p-6 rounded-xl shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Últimos Pokémon Adivinados</h2>
            <ul className="space-y-2">
              {lastAttempts.length === 0 ? (
                <li className="text-white">No hay intentos recientes</li>
              ) : (
                lastAttempts.slice(0, 5).map((pokemon, index) => (
                  <li key={index} className="text-white border-b border-gray-700 pb-2">
                    {index + 1}. {pokemon}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Pokédex */}
        <div className="bg-gray-800/80 p-6 rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Mi Pokédex</h2>
          {lastAttempts.length === 0 ? (
            <p className="text-white text-center">No has adivinado ningún Pokémon todavía</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {lastAttempts.map((pokemon, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4 transform transition-transform hover:scale-105">
                  <div className="aspect-square bg-gray-600 rounded-lg mb-2 flex items-center justify-center">
                    <img
                      src={pokemonData[pokemon]?.image || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'}
                      alt={pokemon}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png';
                      }}
                    />
                  </div>
                  <p className="text-white text-center font-semibold capitalize">{pokemon}</p>
                  <p className="text-gray-400 text-center text-sm">#{pokemonData[pokemon]?.id || '?'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 