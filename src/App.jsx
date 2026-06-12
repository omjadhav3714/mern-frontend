import { useState, useEffect } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

const API_URL = import.meta.env.VITE_BACKEND_URL;
const APP_NAME = import.meta.env.VITE_APP_NAME;

function Register() {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

// process.env.VITE_BACKEND_URL

  async function handleSubmit(e) {
    e.preventDefault()
    console.log("Submitted details -- ");

    const payload = {
      "name": name,
      "email": email,
      "password": password
    }

    console.log(payload)

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    if (response.status == 201) {
      alert("User created")
    } else {
      alert("Error Occurred: " + response.json().message)
    }
  }

  return (
    <section id="center">
      {/* Form to register using name, email, password */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        height: "100vh"
      }}>
        <div className="container">
          <div className="form-wrapper">
            <div className="form-header">
              <h2>Create Account</h2>
              <p>Join our community today</p>

              <p>
                {APP_NAME} - Connecting you to the world of MERN!
              </p>
            </div>
            <form className="registration-form">
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" placeholder="Enter your name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Create a password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="submit-btn" onClick={handleSubmit}>Register</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    console.log("Submitted details -- ");

    const payload = {
      "email": email,
      "password": password
    }

    console.log(payload)

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    if (response.status == 200) {
      alert("User Login Successfull!")
      const res_json = response.json()
      console.log(res_json);
      // Save token from res_json to cookies
      res_json.then(data => {
        document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
      });

    } else {
      alert("Error Occurred: " + response.json().message)
    }
  }

  return (
    <section id="center">
      {/* Form to register using name, email, password */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        height: "100vh"
      }}>
        <div className="container">
          <div className="form-wrapper">
            <div className="form-header">
              <h2>Login</h2>
              <p>Use your email and password to login</p>
            </div>
            <form className="registration-form">
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Create a password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="submit-btn" onClick={handleLogin} >Login</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}


function Products() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    async function fetchProducts() {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
      if (!token) {
        alert("User Not Logged In")
        return
      }
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      })
      const data = await response.json()
      setProducts(data)
    }
    fetchProducts()
  }, [])

  async function handleAddProduct(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      name: formData.get('name'),
      category: formData.get('category'),
      price: formData.get('price')
    };

    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(payload)
    });
    console.log(response.json());
    
    if (response.ok) {
      alert("Product added successfully!");
      window.location.reload();
    } else {
      alert("Failed to add product");
    }
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>Products Page</h2>
      <p>Browse our products here.</p>
      {
        // render products
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', padding: '20px' }}>
          {products.map((product) => (
            <div key={product._id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', width: '250px', textAlign: 'left', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              {/* <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} /> */}
              <h3 style={{ margin: '10px 0' }}>{product.name}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>{product.category}</p>
              <p style={{ fontWeight: 'bold', color: '#2c3e50' }}>${product.price}</p>
            </div>
          ))}
        </div>

      }
      {/* Form to add a product */}
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="form-wrapper" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="form-header">
            <h2>Add New Product</h2>
          </div>
          <form className="registration-form" onSubmit={handleAddProduct}>
            <div className="input-group">
              <label htmlFor="prodName">Product Name</label>
              <input type="text" id="prodName" name="name" placeholder="Enter product name" required />
            </div>
            <div className="input-group">
              <label htmlFor="prodCategory">Category</label>
              <input type="text" id="prodCategory" name="category" placeholder="Enter category" required />
            </div>
            <div className="input-group">
              <label htmlFor="prodPrice">Price</label>
              <input type="number" id="prodPrice" name="price" placeholder="Enter price" required />
            </div>
            <button type="submit" className="submit-btn">Add Product</button>
          </form>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <>
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', justifyContent: 'center', background: '#f5f5f5' }}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/products">Products</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </>
  )
}

export default App
