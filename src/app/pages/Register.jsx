// src/app/pages/Register.jsx
import { useState } from 'react';
import { registerUser } from '../../services/Register';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // 👈 para redirigir

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await registerUser(formData);
      console.log(result);
      setMessage('Usuario registrado con éxito');

      // Redirige al login después de 1 segundo (opcional)
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="register-container bg-gray-800">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required /><br />
        <input name="lastName" placeholder="Apellido" value={formData.lastName} onChange={handleChange} required /><br />
        <input name="username" placeholder="Nombre de usuario" value={formData.username} onChange={handleChange} required /><br />
        <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} required /><br />
        <input name="password" placeholder="Contraseña" type="password" value={formData.password} onChange={handleChange} required /><br />
        <button type="submit">Registrarse</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
