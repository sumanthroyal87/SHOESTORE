import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../css/Admin.css';
import '../../css/Auth.css';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '', brand: '', description: '', price: '', originalPrice: '',
    category: 'Sneakers', sizes: '7,8,9,10', colors: 'Black,White',
    image: '', stock: '', gender: 'Unisex', featured: false
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products?limit=100');
      setProducts(res.data.products);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const resetForm = () => {
    setFormData({
      name: '', brand: '', description: '', price: '', originalPrice: '',
      category: 'Sneakers', sizes: '7,8,9,10', colors: 'Black,White',
      image: '', stock: '', gender: 'Unisex', featured: false
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      brand: product.brand,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || '',
      category: product.category,
      sizes: product.sizes.join(','),
      colors: product.colors.join(','),
      image: product.image,
      stock: product.stock,
      gender: product.gender,
      featured: product.featured
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const productData = {
      ...formData,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice) || 0,
      stock: Number(formData.stock),
      sizes: formData.sizes.split(',').map(s => Number(s.trim())),
      colors: formData.colors.split(',').map(c => c.trim())
    };

    try {
      if (editingId) {
        await axios.put(`/api/admin/products/${editingId}`, productData);
        setMessage('Product updated successfully!');
      } else {
        await axios.post('/api/admin/products', productData);
        setMessage('Product created successfully!');
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/api/admin/products/${id}`);
      setMessage('Product deleted');
      fetchProducts();
    } catch (err) {
      setMessage('Error deleting product');
    }
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Manage Products</h1>

        <div className="admin-layout">
          <div className="admin-sidebar">
            <div className="admin-sidebar-card">
              <h3>⚙️ Admin Menu</h3>
              <Link to="/admin" className={isActive('/admin')}>📊 Dashboard</Link>
              <Link to="/admin/products" className={isActive('/admin/products')}>📦 Products</Link>
              <Link to="/admin/orders" className={isActive('/admin/orders')}>🛍️ Orders</Link>
              <Link to="/admin/users" className={isActive('/admin/users')}>👥 Users</Link>
            </div>
          </div>

          <div className="admin-content">
            {message && (
              <div className={`alert ${message.includes('Error') || message.includes('error') ? 'alert-error' : 'alert-success'}`}>
                {message}
              </div>
            )}

            {/* Add/Edit Form */}
            {showForm && (
              <div className="admin-form-card">
                <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                <form onSubmit={handleSubmit}>
                  <div className="admin-form-row">
                    <div className="form-group">
                      <label>Product Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>Brand</label>
                      <input type="text" name="brand" value={formData.brand} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="3" required />
                  </div>
                  <div className="admin-form-row">
                    <div className="form-group">
                      <label>Price (₹)</label>
                      <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>Original Price (₹)</label>
                      <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>Stock</label>
                      <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="admin-form-row">
                    <div className="form-group">
                      <label>Category</label>
                      <select name="category" value={formData.category} onChange={handleChange}>
                        <option value="Running">Running</option>
                        <option value="Casual">Casual</option>
                        <option value="Sports">Sports</option>
                        <option value="Sneakers">Sneakers</option>
                        <option value="Formal">Formal</option>
                        <option value="Boots">Boots</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Unisex">Unisex</option>
                      </select>
                    </div>
                  </div>
                  <div className="admin-form-row">
                    <div className="form-group">
                      <label>Sizes (comma separated)</label>
                      <input type="text" name="sizes" value={formData.sizes} onChange={handleChange} placeholder="6,7,8,9,10" />
                    </div>
                    <div className="form-group">
                      <label>Colors (comma separated)</label>
                      <input type="text" name="colors" value={formData.colors} onChange={handleChange} placeholder="Black,White,Red" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="https://..." />
                  </div>
                  <div className="form-group">
                    <label>
                      <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
                      {' '}Featured Product
                    </label>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Create'} Product</button>
                    <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* Products Table */}
            <div className="admin-table-card">
              <div className="table-header">
                <h3>All Products ({products.length})</h3>
                <button className="btn btn-accent btn-sm" onClick={() => { resetForm(); setShowForm(true); }}>
                  + Add Product
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Brand</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td><img src={product.image} alt={product.name} /></td>
                        <td>{product.name}</td>
                        <td>{product.brand}</td>
                        <td>{product.category}</td>
                        <td>₹{product.price.toLocaleString()}</td>
                        <td>
                          <span className={`badge ${product.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td>
                          <div className="admin-actions">
                            <button className="edit-btn" onClick={() => handleEdit(product)}>Edit</button>
                            <button className="delete-btn" onClick={() => handleDelete(product._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
