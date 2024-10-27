'use client';
import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function AuthPage() {
  const { data: session, status } = useSession(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false); 

  const [items, setItems] = useState([]); 
  const [newItem, setNewItem] = useState(''); 
  const [isEditing, setIsEditing] = useState(null); 
  const [editedItem, setEditedItem] = useState(''); 

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
    }
  };

  // CRUD Operations
  const handleAddItem = () => {
    if (!newItem.trim()) return;
    setItems([...items, newItem]);
    setNewItem('');
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleEditItem = (index) => {
    setIsEditing(index);


    setEditedItem(items[index]);




  };

  const handleSaveEdit = (index) => {
    const updatedItems = [...items];
    updatedItems[index] = editedItem;
    setItems(updatedItems);
    setIsEditing(null);
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div style={newStyles.pageWrapper}>
      <div style={newStyles.card}>
        {!session ? (
          <>
            <h2 style={newStyles.title}>{isSignUp ? 'Create Account' : 'Login'}</h2>

            <form onSubmit={handleAuth} style={newStyles.form}>
              <div style={newStyles.inputGroup}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  style={newStyles.input}
                />
              </div>
              <div style={newStyles.inputGroup}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  style={newStyles.input}
                />
              </div>
              {error && <p style={newStyles.error}>{error}</p>}
              <button type="submit" style={newStyles.button}>
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <p style={newStyles.toggleText}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                style={newStyles.toggleButton}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 style={newStyles.title}>Welcome, {session.user.email}!</h2>

            <div style={newStyles.inputGroup}>
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Enter new item"
                style={newStyles.input}
              />
              <button onClick={handleAddItem} style={newStyles.button}>
                Add Item
              </button>
            </div>

            <ul style={newStyles.itemList}>
              {items.map((item, index) => (
                <li key={index} style={newStyles.listItem}>
                  {isEditing === index ? (
                    <>
                      <input
                        type="text"
                        value={editedItem}
                        onChange={(e) => setEditedItem(e.target.value)}
                        style={newStyles.input}
                      />
                      <button
                        onClick={() => handleSaveEdit(index)}
                        style={newStyles.button}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <span>{item}</span>
                      <div style={newStyles.buttonGroup}>
                        <button
                          onClick={() => handleEditItem(index)}
                          style={newStyles.button}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(index)}
                          style={newStyles.deleteButton}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

const newStyles = {
  pageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#1a1a1a', // Dark background
    padding: '20px',
  },
  card: {
    backgroundColor: '#2b2b2b', // Slightly lighter than the background
    padding: '40px',
    borderRadius: '16px', // More rounded corners
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)', // Deep shadow for elevation
    maxWidth: '450px',
    width: '100%',
  },
  title: {
    fontSize: '26px',
    textAlign: 'center',
    marginBottom: '25px',
    color: '#f1f1f1', // Light font color
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #444', // Dark input border
    backgroundColor: '#3a3a3a', // Dark input background
    color: '#e0e0e0', // Light text color
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  inputFocus: {
    borderColor: '#00bfa5', // Accent color for focus state
  },
  button: {
    padding: '14px',
    fontSize: '16px',
    color: '#ffffff',
    backgroundColor: '#00bfa5', // Primary accent color for buttons
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#009688', // Darker hover state
  },
  deleteButton: {
    backgroundColor: '#e91e63', // Danger color for delete
    padding: '10px',
    borderRadius: '8px',
    marginLeft: '10px',
    cursor: 'pointer',
  },
  toggleText: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
    color: '#ccc', // Slightly dimmed text color
  },
  toggleButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#00bfa5', // Accent color for toggling between sign in/sign up
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  error: {
    color: '#ff6f61', // Soft red for error messages
    fontSize: '14px',
  },
  itemList: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: '#404040', // Lighter background for list items
    marginBottom: '10px',
    color: '#e0e0e0',
  },
  buttonGroup: {
    display: 'flex',
  },
};
