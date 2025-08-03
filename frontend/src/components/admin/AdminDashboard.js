import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { itemsAPI } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: ''
  });
  const navigate = useNavigate();

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await itemsAPI.getItems();
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Update existing product
        await itemsAPI.updateItem(editingProduct._id, formData);
        toast.success('Product updated successfully');
      } else {
        // Add new product
        await itemsAPI.createItem(formData);
        toast.success('Product added successfully');
      }
      setShowAddForm(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: ''
      });
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category || '',
      stock: product.stock || '',
      image: product.image || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await itemsAPI.deleteItem(productId);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  if (loading && !products.length) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Product Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingProduct(null);
            setFormData({
              name: '',
              description: '',
              price: '',
              category: '',
              stock: '',
              image: ''
            });
          }}
        >
          {showAddForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {showAddForm && (
        <div className="product-form-container">
          <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Stock:</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Category:</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Image URL:</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </form>
        </div>
      )}

      <div className="products-list">
        <h3>Current Products</h3>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div className="product-details">
                  <h4>{product.name}</h4>
                  <p className="price">${product.price?.toFixed(2)}</p>
                  <p className="stock">In Stock: {product.stock || 0}</p>
                  <div className="product-actions">
                    <button 
                      className="btn btn-edit"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-delete"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
