
import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit2, Trash2, Plus, Layers } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'VPS Cloud', description: 'Virtual Private Servers', count: 12, status: true },
    { id: 2, name: 'Dedicated Servers', description: 'Bare metal machines', count: 5, status: true },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', status: true });
  const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);

  const handleSave = () => {
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...formData, id: c.id, count: c.count } : c));
      showToast({ title: 'Category Updated' });
    } else {
      setCategories([...categories, { ...formData, id: Date.now(), count: 0 }]);
      showToast({ title: 'Category Created' });
    }
    setIsDialogOpen(false);
    setFormData({ name: '', description: '', status: true });
    setEditingCategory(null);
  };

  const handleDelete = (id) => {
    setCategories(categories.filter(c => c.id !== id));
    showToast({ title: 'Category Deleted', variant: 'destructive' });
  };

  const startEdit = (category) => {
    setEditingCategory(category);
    setFormData(category);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#FFB833] font-sora">Category Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FFA500]" onClick={() => { setEditingCategory(null); setFormData({ name: '', description: '', status: true }) }}>
              <Plus className="w-4 h-4 mr-2" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'New Category'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input placeholder="Category Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <Input placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <div className="flex items-center gap-2">
                 <span className="text-sm font-medium">Active Status</span>
                 <Switch checked={formData.status} onCheckedChange={c => setFormData({...formData, status: c})} />
              </div>
              <Button className="w-full bg-[#FFA500]" onClick={handleSave}>Save Category</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold text-gray-600">Name</TableHead>
              <TableHead className="font-semibold text-gray-600">Description</TableHead>
              <TableHead className="font-semibold text-gray-600">Products</TableHead>
              <TableHead className="font-semibold text-gray-600">Status</TableHead>
              <TableHead className="font-semibold text-gray-600 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map(category => (
              <TableRow key={category.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-[#FFB833] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-gray-400" /> {category.name}
                </TableCell>
                <TableCell className="text-gray-600">{category.description}</TableCell>
                <TableCell className="text-gray-600">{category.count} items</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${category.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {category.status ? 'Active' : 'Disabled'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(category)}><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(category.id)}><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CategoryManagement;
