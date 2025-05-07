async function guessPokemon(name) {
    const resp = await fetch(`http://localhost:3000/guess/${name}`);
    if (!resp.ok) throw new Error('Error guess Pokemon');
    return resp.json(); // aquí ya obtienes { id, name, image, types }
  }
  
  export default guessPokemon
  