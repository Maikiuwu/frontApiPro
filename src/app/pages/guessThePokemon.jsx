import generatePokemon from '../../services/generatePokemon'
import { useState, useEffect } from 'react'
import guessPokemon from '../../services/guessPokemon'
import JSConfetti from 'js-confetti'

const jsConfetti = new JSConfetti()

function App() {
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [value, setValue] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)

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

  const handleGuess = async (name) => {
    if (!name) return
    setSuccess(false)
    try {
      const res = await guessPokemon(name)

      const { correct } = res

      if (correct) {
        setSuccess(true)
        setValue('')
        jsConfetti.addConfetti()
        return
      }

      setValue('')
      setShowErrorModal(true)

      setTimeout(() => {
        setShowErrorModal(false)
      }, 1500)
    } catch (error) {
      console.error('Error guessing Pokemon:', error)
    }
  }

  // Cargar un Pokémon cuando se inicia la aplicación
  useEffect(() => {
    fetchPokemon()
  }, [])

  function handleGetNewPokemon() {
    setSuccess(false)
    setValue('')
    fetchPokemon()
  }
  console.log('success', success)
  return (
    <main className="gap-5 bg-gray-800 text-white flex flex-col justify-center items-center h-screen overflow-hidden">
      <h1 className="text-6xl font-bold">Guess Pokémon</h1>
      <div className="container p-4 max-w-xs justify-center items-center flex flex-col gap-5">
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
                alt={success ? name : "Nombre Pokemon "+name}
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
              className="h-12 text-lg border border-gray-500 bg-gray-500/30 rounded-xl min-w-xs px-2"
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
      <div
        className={`flex flex-col gap-5 p-4 bg-red-500 size-40 absolute text-5xl justify-center items-center rounded-xl shadow-xl opacity-0 transition-opacity duration-300 z-10 ${
          showErrorModal ? 'opacity-100' : ''
        }`}
      >
        <h2>Que noob</h2>
      </div>
    </main>
  )
}

export default App
