import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:8083/api/admin';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [message, setMessage] = useState('');

  // Cargar todos los usuarios al iniciar
  useEffect(() => {
    fetch(`${API_URL}/GetUser`)
      .then(res => res.json())
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);

  // Buscar usuario por username
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;
    try {
      const res = await fetch(`${API_URL}/GetUserByUsername?username=${encodeURIComponent(search)}`);
      if (!res.ok) throw new Error('No encontrado');
      const user = await res.json();
      setSearchResult(user);
      setMessage('');
    } catch {
      setSearchResult(null);
      setMessage('Usuario no encontrado');
    }
  };

  // Eliminar usuario
  const handleDelete = async (user) => {
    if (!window.confirm(`¿Eliminar usuario ${user.username}?`)) return;
    await fetch(`${API_URL}/DeleteUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    setUsers(users.filter(u => u.idUser !== user.idUser));
    setSearchResult(null);
    setMessage('Usuario eliminado');
  };

  // Guardar cambios de edición
  const handleEditSave = async () => {
    const res = await fetch(`${API_URL}/EditUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingUser),
    });
    const updated = await res.json();
    setUsers(users.map(u => u.idUser === updated.idUser ? updated : u));
    setEditingUser(null);
    setMessage('Usuario actualizado');
  };

  // Renderiza una fila de usuario (editable o no)
  const renderUserRow = (user) => (
    editingUser && editingUser.idUser === user.idUser ? (
      <tr key={user.idUser} className="bg-yellow-100">
        <td className="text-left">{user.idUser}</td>
        <td className="text-left">
          <input
            value={editingUser.username}
            onChange={e => setEditingUser({ ...editingUser, username: e.target.value })}
            className="border px-2"
          />
        </td>
        <td className="text-left">
          <input
            value={editingUser.name}
            onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
            className="border px-2"
          />
        </td>
        <td className="text-left">
          <input
            value={editingUser.lastName}
            onChange={e => setEditingUser({ ...editingUser, lastName: e.target.value })}
            className="border px-2"
          />
        </td>
        <td className="text-left">
          <input
            value={editingUser.email}
            onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
            className="border px-2"
          />
        </td>
        <td className="text-left">
          <button onClick={handleEditSave} className="bg-green-600 text-white px-2 rounded mr-2">Guardar</button>
          <button onClick={() => setEditingUser(null)} className="bg-gray-400 text-white px-2 rounded">Cancelar</button>
        </td>
      </tr>
    ) : (
      <tr key={user.idUser}>
        <td className="text-left">{user.idUser}</td>
        <td className="text-left">{user.username}</td>
        <td className="text-left">{user.name}</td>
        <td className="text-left">{user.lastName}</td>
        <td className="text-left">{user.email}</td>
        <td className="text-left">
          <button onClick={() => setEditingUser(user)} className="bg-yellow-500 text-white px-2 rounded mr-2">Editar</button>
          <button onClick={() => handleDelete(user)} className="bg-red-600 text-white px-2 rounded">Eliminar</button>
        </td>
      </tr>
    )
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración de Usuarios</h1>

      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Buscar por username"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 rounded">Buscar</button>
        <button type="button" onClick={() => { setSearch(''); setSearchResult(null); setMessage(''); }} className="bg-gray-400 text-white px-2 rounded">Limpiar</button>
      </form>

      {message && <div className="mb-4 text-red-600">{message}</div>}

      {searchResult && searchResult.idUser !== 1 ? (
        <table className="w-full bg-white rounded shadow mb-6">
          <thead>
            <tr>
              <th className="text-left">ID</th>
              <th className="text-left">Username</th>
              <th className="text-left">Nombre</th>
              <th className="text-left">Apellido</th>
              <th className="text-left">Email</th>
              <th className="text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {renderUserRow(searchResult)}
          </tbody>
        </table>
      ) : searchResult && searchResult.idUser === 1 ? (
        <div className="mb-4 text-gray-600">No se puede mostrar el usuario admin.</div>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="text-left">ID</th>
              <th className="text-left">Username</th>
              <th className="text-left">Nombre</th>
              <th className="text-left">Apellido</th>
              <th className="text-left">Email</th>
              <th className="text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(u => u.idUser !== 1)
              .map(renderUserRow)}
          </tbody>
        </table>
      )}
    </div>
  );
}