import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/Login';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(formData);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/guess');
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="login-container bg-gray-900 text-white">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Usuario" value={formData.username} onChange={handleChange} required /><br />
        <input name="password" type="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required /><br />
        <button type="submit">Ingresar</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
