import { useState } from 'react';

export default function RegistrationForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const validate = () => {
    if (!name.trim()) return 'Name is required';
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Valid email is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password !== confirm) return 'Passwords do not match';
    if (!terms) return 'You must agree to the terms';
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    // Demo: save to localStorage
    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
    if (users.find(u => u.email === email)) {
      setError('Email already registered');
      return;
    }
    const newUser = { id: Date.now().toString(), name, email, phone, password }; // store plaintext for demo (not for production)
    users.push(newUser);
    localStorage.setItem('demo_users', JSON.stringify(users));
    setSuccess('Registration successful. You can log in now.');
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Register</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="field">
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div className="field">
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="field">
        <label>Phone</label>
        <input value={phone} onChange={e => setPhone(e.target.value)} />
      </div>
      <div className="field">
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <div className="field">
        <label>Confirm Password</label>
        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
      </div>
      <div className="field checkbox">
        <input id="terms" type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} />
        <label htmlFor="terms">I agree to the terms and privacy policy</label>
      </div>

      <button type="submit">Create account</button>

      <p>Already have an account? <a href="/login">Log in</a></p>
    </form>
  );
}