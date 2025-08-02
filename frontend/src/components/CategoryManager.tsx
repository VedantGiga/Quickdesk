import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firebaseTicketService } from '../services/firebaseTickets';

interface Category {
  id: string;
  name: string;
  description: string;
}

const CategoryManager: React.FC = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await firebaseTicketService.getCategories();
      setCategories(data as Category[]);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    try {
      await firebaseTicketService.addCategory(newCategory.name, newCategory.description);
      setNewCategory({ name: '', description: '' });
      loadCategories();
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  if (user?.role !== 'admin') {
    return <div className="p-6 text-center text-red-600">Access denied. Admin only.</div>;
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>

      {/* Add Category Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Category
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
        <div className="grid gap-4">
          {categories.map((category) => (
            <div key={category.id} className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
              <p className="text-gray-600 mt-1">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;