import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Edit2, Trash2, X, Save, Loader2, ChevronLeft, DollarSign,
    Package, Tag, AlertCircle, CheckCircle2
} from 'lucide-react';
import api from '../api/client';
import { toast } from '../utils/toast';

const AdminMenuPage = () => {
    const navigate = useNavigate();
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [showAddItem, setShowAddItem] = useState(false);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const response = await api.get('/admin/menu');
            setMenu(response.data.categories || []);
        } catch (error) {
            console.error('Failed to fetch menu:', error);
            toast.error('Failed to load menu');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (name) => {
        try {
            const response = await api.post('/admin/menu/category', {
                name,
                display_order: menu.length
            });
            toast.success('Category added!');
            setShowAddCategory(false);
            fetchMenu();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to add category');
        }
    };

    const handleAddItem = async (itemData) => {
        try {
            await api.post('/admin/menu/item', itemData);
            toast.success('Menu item added!');
            setShowAddItem(false);
            fetchMenu();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to add item');
        }
    };

    const handleUpdateItem = async (itemId, itemData) => {
        try {
            await api.put(`/admin/menu/item/${itemId}`, itemData);
            toast.success('Item updated!');
            setEditingItem(null);
            fetchMenu();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to update item');
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            await api.delete(`/admin/menu/item/${itemId}`);
            toast.success('Item deleted!');
            fetchMenu();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to delete item');
        }
    };

    const handleToggleAvailability = async (item) => {
        try {
            if (item.is_available) {
                await api.post(`/admin/menu/menu-item/${item.id}/soldout`);
            } else {
                await api.post(`/admin/menu/menu-item/${item.id}/available`);
            }
            toast.success(`Item marked as ${item.is_available ? 'unavailable' : 'available'}`);
            fetchMenu();
        } catch (error) {
            toast.error('Failed to update availability');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Menu Management</h1>
                <p className="text-text-muted">Manage your menu items and categories</p>
            </div>
            <div className="flex items-center justify-end mb-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowAddCategory(true)}
                        className="px-4 py-2 bg-bg-surface rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-bg-elevated transition-colors"
                    >
                        <Tag size={16} />
                        Add Category
                    </button>
                    <button
                        onClick={() => setShowAddItem(true)}
                        className="px-4 py-2 bg-primary text-black rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
                    >
                        <Plus size={16} />
                        Add Item
                    </button>
                </div>
            </div>

            <div className="content-padding">
                {menu.length === 0 ? (
                    <div className="card text-center py-12">
                        <Package size={48} className="text-text-dim mx-auto mb-4" />
                        <p className="text-text-muted mb-4">No menu items yet</p>
                        <button onClick={() => setShowAddItem(true)} className="btn-primary">
                            Add Your First Item
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {menu.map((category) => (
                            <CategorySection
                                key={category.id}
                                category={category}
                                onEditItem={setEditingItem}
                                onDeleteItem={handleDeleteItem}
                                onToggleAvailability={handleToggleAvailability}
                                onUpdateItem={handleUpdateItem}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Add Category Modal */}
            <AnimatePresence>
                {showAddCategory && (
                    <CategoryModal
                        onClose={() => setShowAddCategory(false)}
                        onSave={handleAddCategory}
                    />
                )}
            </AnimatePresence>

            {/* Add Item Modal */}
            <AnimatePresence>
                {showAddItem && (
                    <ItemModal
                        categories={menu}
                        onClose={() => setShowAddItem(false)}
                        onSave={handleAddItem}
                    />
                )}
            </AnimatePresence>

            {/* Edit Item Modal */}
            <AnimatePresence>
                {editingItem && (
                    <ItemModal
                        item={editingItem}
                        categories={menu}
                        onClose={() => setEditingItem(null)}
                        onSave={(data) => handleUpdateItem(editingItem.id, data)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const CategorySection = ({ category, onEditItem, onDeleteItem, onToggleAvailability, onUpdateItem }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{category.name}</h2>
                <span className="text-xs text-text-muted">{category.items?.length || 0} items</span>
            </div>
            <div className="flex flex-col gap-3">
                {category.items && category.items.length > 0 ? (
                    category.items.map((item) => (
                        <MenuItemRow
                            key={item.id}
                            item={item}
                            onEdit={onEditItem}
                            onDelete={onDeleteItem}
                            onToggleAvailability={onToggleAvailability}
                        />
                    ))
                ) : (
                    <p className="text-text-muted text-sm py-4 text-center">No items in this category</p>
                )}
            </div>
        </motion.div>
    );
};

const MenuItemRow = ({ item, onEdit, onDelete, onToggleAvailability }) => {
    return (
        <div className="flex items-center gap-4 p-4 bg-bg-surface rounded-xl hover:bg-bg-elevated transition-colors">
            <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-base">{item.name}</h3>
                    {!item.is_available && (
                        <span className="badge badge-danger text-xs">Sold Out</span>
                    )}
                </div>
                {item.description && (
                    <p className="text-xs text-text-muted line-clamp-1 mb-2">{item.description}</p>
                )}
                <div className="flex items-center gap-4">
                    <span className="text-lg font-black text-primary">${parseFloat(item.price).toFixed(2)}</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onToggleAvailability(item)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${item.is_available
                            ? 'bg-success/20 text-success hover:bg-success/30'
                            : 'bg-danger/20 text-danger hover:bg-danger/30'
                        }`}
                    title={item.is_available ? 'Mark as sold out' : 'Mark as available'}
                >
                    {item.is_available ? <CheckCircle2 size={18} /> : <X size={18} />}
                </button>
                <button
                    onClick={() => onEdit(item)}
                    className="w-10 h-10 rounded-xl bg-accent-blue/20 text-accent-blue flex items-center justify-center hover:bg-accent-blue/30 transition-colors"
                >
                    <Edit2 size={18} />
                </button>
                <button
                    onClick={() => onDelete(item.id)}
                    className="w-10 h-10 rounded-xl bg-danger/20 text-danger flex items-center justify-center hover:bg-danger/30 transition-colors"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

const CategoryModal = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Category name is required');
            return;
        }
        setSaving(true);
        await onSave(name.trim());
        setSaving(false);
        setName('');
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto bg-bg-card rounded-t-3xl z-50 p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Add Category</h2>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-bg-surface flex items-center justify-center">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-xs uppercase font-bold text-text-dim tracking-widest mb-2 block">
                            Category Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Nepalese Food Items"
                            className="input-field"
                            required
                            autoFocus
                        />
                    </div>
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {saving ? 'Saving...' : 'Add Category'}
                    </button>
                </form>
            </motion.div>
        </>
    );
};

const ItemModal = ({ item, categories, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: item?.name || '',
        description: item?.description || '',
        price: item?.price ? parseFloat(item.price).toFixed(2) : '',
        category_id: item?.category_id || (categories[0]?.id || null),
        is_available: item?.is_available !== undefined ? item.is_available : true,
        display_order: item?.display_order || 0
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.price) {
            toast.error('Name and price are required');
            return;
        }
        setSaving(true);
        await onSave({
            ...formData,
            price: parseFloat(formData.price),
            category_id: formData.category_id || null
        });
        setSaving(false);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto bg-bg-card rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto"
            >
                <div className="sticky top-0 bg-bg-card border-b border-white/10 p-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold">{item ? 'Edit Item' : 'Add Menu Item'}</h2>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-bg-surface flex items-center justify-center">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    <div>
                        <label className="text-xs uppercase font-bold text-text-dim tracking-widest mb-2 block">
                            Item Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Chicken Chow Mein"
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs uppercase font-bold text-text-dim tracking-widest mb-2 block">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the item..."
                            className="input-field min-h-[100px] resize-none"
                            rows={4}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs uppercase font-bold text-text-dim tracking-widest mb-2 block">
                                Price *
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="0.00"
                                    className="input-field pl-12"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs uppercase font-bold text-text-dim tracking-widest mb-2 block">
                                Category
                            </label>
                            <select
                                value={formData.category_id || ''}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value || null })}
                                className="input-field"
                            >
                                <option value="">No Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_available"
                            checked={formData.is_available}
                            onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                            className="w-5 h-5 rounded accent-primary"
                        />
                        <label htmlFor="is_available" className="text-sm font-semibold">
                            Item is available
                        </label>
                    </div>
                    <button type="submit" disabled={saving} className="btn-primary mt-4">
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {saving ? 'Saving...' : (item ? 'Update Item' : 'Add Item')}
                    </button>
                </form>
            </motion.div>
        </>
    );
};

export default AdminMenuPage;

