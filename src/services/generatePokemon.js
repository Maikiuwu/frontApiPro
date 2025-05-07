async function generatePokemon() {
  const resp = await fetch('http://localhost:3000/generatePokemon');
  if (!resp.ok) throw new Error('Error generating Pokemon');
  return resp.json(); // aquí ya obtienes { id, name, image, types }
}

export default generatePokemon
