async function generatePokemon() {
  const resp = await fetch('http://localhost:8083/api/pokemon/random', {
  credentials: 'include'});
  if (!resp.ok) throw new Error('Error generating Pokemon');
  return resp.json(); // aquí se obtienes { id, name, image, types }
}

export default generatePokemon
