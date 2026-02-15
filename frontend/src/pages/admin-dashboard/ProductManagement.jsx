
import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

const ProductManagement = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'VPS Start', category: 'VPS', price: '29.90', status: 'active', description: 'Entry level VPS' },
    { id: 2, name: 'Dedicated Pro', category: 'Dedicated', price: '499.00', status: 'active', description: 'High performance server' },
  ]);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: '', price: '', description: '', status: 'active' });
  const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);

  const handleSave = () => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...formData, id: p.id } : p));
      showToast({ title: 'Product Updated' });
    } else {
      setProducts([...products, { ...formData, id: Date.now() }]);
      showToast({ title: 'Product Created' });
    }
    setIsDialogOpen(false);
    setFormData({ name: '', category: '', price: '', description: '', status: 'active' });
    setEditingProduct(null);
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
    showToast({ title: 'Product Deleted', variant: 'destructive' });
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsDialogOpen(true);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#FFB833] font-sora">Product Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FFA500]" onClick={() => { setEditingProduct(null); setFormData({ name: '', category: '', price: '', description: '', status: 'active' }) }}>
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input placeholder="Product Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                  <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VPS">VPS</SelectItem>
                    <SelectItem value="Dedicated">Dedicated</SelectItem>
                    <SelectItem value="Hosting">Hosting</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Price" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <Input placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full bg-[#FFA500]" onClick={handleSave}>Save Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input className="pl-9 bg-white" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#FFA500]/10 flex items-center justify-center text-[#FFA500]">
                  <Package className="w-5 h-5" />
                </div>
                <Badge variant={product.status === 'active' ? 'default' : 'secondary'} className={product.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-700'}>
                  {product.status}
                </Badge>
              </div>
              <h3 className="font-bold text-lg text-[#FFB833] mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{product.category}</p>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="font-bold text-lg">R$ {product.price}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(product)}><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(product.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;
