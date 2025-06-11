async function guessPokemon(name) {
    const resp = await fetch(`http://localhost:8083/api/pokemon/guess/${name}`);
    if (!resp.ok) throw new Error('Error guess Pokemon');
    return resp.json(); // aquí se obtienes {"correct": false,"actual": "ivysaur"}
  }
  
  export default guessPokemon
  