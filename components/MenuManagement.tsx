import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Save, X, Utensils, Tag, Store, Percent } from 'lucide-react';
import { MenuItem, Category, RestaurantInfo } from '../types';

interface MenuManagementProps {
  categories: Category[];
  menuItems: MenuItem[];
  taxRate: number;
  restaurantInfo: RestaurantInfo;
  setTaxRate: (rate: number) => void;
  setRestaurantInfo: (info: RestaurantInfo) => void;
  onAddMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  onUpdateMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (id: string) => void;
  onAddCategory: (name: string) => void;
  onUpdateCategory: (cat: Category) => void;
  onDeleteCategory: (id: string) => void;
}

const MenuManagement: React.FC<MenuManagementProps> = ({ 
  categories, 
  menuItems, 
  taxRate,
  restaurantInfo,
  setTaxRate,
  setRestaurantInfo,
  onAddMenuItem, 
  onUpdateMenuItem, 
  onDeleteMenuItem,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory
}) => {
  const [activeTab, setActiveTab] = useState<'ITEMS' | 'CATEGORIES' | 'TAXES' | 'RESTAURANT'>('ITEMS');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const [localRestaurantInfo, setLocalRestaurantInfo] = useState<RestaurantInfo>(restaurantInfo);

  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenItemModal = (item?: MenuItem) => {
    setEditingItem(item || null);
    setIsItemModalOpen(true);
  };

  const handleOpenCatModal = (cat?: Category) => {
    setEditingCat(cat || null);
    setIsCatModalOpen(true);
  };

  const handleSaveRestaurantProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setRestaurantInfo(localRestaurantInfo);
    alert('Restaurant profile updated successfully!');
  };

  return (
    <div className="h-full bg-gray-50 p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Configuration</h1>
          <p className="text-sm text-gray-800 font-bold">Manage your menu, categories, and business rules</p>
        </div>
        {(activeTab === 'ITEMS' || activeTab === 'CATEGORIES') && (
          <button 
            onClick={() => activeTab === 'ITEMS' ? handleOpenItemModal() : handleOpenCatModal()}
            className="flex items-center gap-2 bg-[#F57C00] text-white px-6 py-2.5 rounded-xl font-black hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
          >
            <Plus size={20} /> Add New {activeTab === 'ITEMS' ? 'Item' : 'Category'}
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border flex-1 flex flex-col overflow-hidden">
        <div className="flex border-b overflow-x-auto custom-scrollbar bg-gray-50/50">
          <TabItem label="Menu Items" active={activeTab === 'ITEMS'} onClick={() => setActiveTab('ITEMS')} icon={<Utensils size={18} />} />
          <TabItem label="Categories" active={activeTab === 'CATEGORIES'} onClick={() => setActiveTab('CATEGORIES')} icon={<Tag size={18} />} />
          <TabItem label="Taxes & Charges" active={activeTab === 'TAXES'} onClick={() => setActiveTab('TAXES')} icon={<Percent size={18} />} />
          <TabItem label="Restaurant Profile" active={activeTab === 'RESTAURANT'} onClick={() => setActiveTab('RESTAURANT')} icon={<Store size={18} />} />
        </div>

        <div className="p-6 flex-1 flex flex-col overflow-hidden">
          {activeTab === 'ITEMS' && (
            <>
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900" size={20} />
                <input 
                  type="text" 
                  placeholder="Search items by name..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border-2 border-gray-300 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-900 font-black focus:ring-2 focus:ring-[#F57C00] outline-none shadow-sm placeholder:text-gray-400"
                />
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredItems.map(item => (
                    <div key={item.id} className="p-4 border-2 border-gray-200 bg-white rounded-xl hover:border-[#F57C00] group transition-all shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <h4 className="font-black text-gray-900">{item.name}</h4>
                        </div>
                        <span className="text-orange-600 font-black">₹{item.price}</span>
                      </div>
                      <p className="text-xs text-gray-800 mb-4 uppercase tracking-tighter font-black">
                        Category: {categories.find(c => c.id === item.categoryId)?.name || 'Unknown'}
                      </p>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenItemModal(item)}
                          className="flex-1 bg-gray-100 text-gray-900 py-2 rounded-lg text-xs font-black hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 border-2 border-gray-300"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button 
                          onClick={() => onDeleteMenuItem(item.id)}
                          className="flex-1 bg-black text-white py-2 rounded-lg text-xs font-black hover:bg-gray-800 transition-colors flex items-center justify-center gap-1"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'CATEGORIES' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map(cat => (
                <div key={cat.id} className="p-6 border-2 border-gray-200 bg-white rounded-2xl flex items-center justify-between hover:bg-orange-50/30 hover:border-[#F57C00] transition-colors group shadow-sm">
                  <span className="font-black text-gray-900">{cat.name}</span>
                  <div className="flex gap-1">
                    <button onClick={() => handleOpenCatModal(cat)} className="p-2 text-gray-900 hover:text-[#F57C00]"><Edit2 size={16} /></button>
                    <button onClick={() => onDeleteCategory(cat.id)} className="p-2 text-gray-900 hover:text-black"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'TAXES' && (
            <div className="max-w-xl mx-auto w-full p-8 border-2 border-gray-200 rounded-3xl bg-white shadow-lg">
               <h3 className="text-xl font-black text-gray-900 mb-6">Global Tax Settings</h3>
               <div className="space-y-6">
                 <div>
                   <label className="block text-sm font-black text-gray-900 mb-2 uppercase">GST (Integrated)</label>
                   <div className="flex gap-4">
                     <input 
                      type="number" 
                      value={taxRate * 100} 
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) / 100)}
                      className="flex-1 p-4 rounded-xl border-2 border-gray-300 text-gray-900 font-black text-lg focus:ring-2 focus:ring-[#F57C00] outline-none shadow-inner" 
                     />
                     <span className="p-4 font-black text-gray-900 bg-gray-50 rounded-xl border-2 border-gray-300">%</span>
                   </div>
                 </div>
                 <button className="w-full bg-[#F57C00] text-white py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 hover:bg-orange-600 shadow-xl shadow-orange-100 transition-all active:scale-95">
                   <Save size={20} /> Save Settings
                 </button>
                 <p className="text-xs text-gray-800 text-center font-black uppercase">These settings apply to all bills globally.</p>
               </div>
            </div>
          )}

          {activeTab === 'RESTAURANT' && (
            <div className="max-w-xl mx-auto w-full p-8 border-2 border-gray-200 rounded-3xl bg-white shadow-lg">
               <h3 className="text-xl font-black text-gray-900 mb-6">Restaurant Profile</h3>
               <form onSubmit={handleSaveRestaurantProfile} className="space-y-6">
                 <div>
                   <label className="block text-sm font-black text-gray-900 mb-2 uppercase">Restaurant Name</label>
                   <input 
                    type="text" 
                    value={localRestaurantInfo.name} 
                    onChange={(e) => setLocalRestaurantInfo({...localRestaurantInfo, name: e.target.value})}
                    placeholder="Enter restaurant name"
                    className="w-full p-4 rounded-xl border-2 border-gray-300 text-gray-900 font-black focus:ring-2 focus:ring-[#F57C00] outline-none shadow-inner placeholder:text-gray-400" 
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-black text-gray-900 mb-2 uppercase">Phone Number</label>
                   <input 
                    type="text" 
                    value={localRestaurantInfo.phone} 
                    onChange={(e) => setLocalRestaurantInfo({...localRestaurantInfo, phone: e.target.value})}
                    placeholder="e.g., +91 9876543210"
                    className="w-full p-4 rounded-xl border-2 border-gray-300 text-gray-900 font-black focus:ring-2 focus:ring-[#F57C00] outline-none shadow-inner placeholder:text-gray-400" 
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-black text-gray-900 mb-2 uppercase">Address</label>
                   <textarea 
                    rows={3}
                    value={localRestaurantInfo.address} 
                    onChange={(e) => setLocalRestaurantInfo({...localRestaurantInfo, address: e.target.value})}
                    placeholder="Enter complete address for the bill"
                    className="w-full p-4 rounded-xl border-2 border-gray-300 text-gray-900 font-black focus:ring-2 focus:ring-[#F57C00] outline-none resize-none shadow-inner placeholder:text-gray-400" 
                   />
                 </div>
                 <button type="submit" className="w-full bg-[#F57C00] text-white py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 hover:bg-orange-600 shadow-xl shadow-orange-100 transition-all active:scale-95">
                   <Save size={20} /> Save Business Profile
                 </button>
                 <p className="text-xs text-gray-800 text-center font-black uppercase">These details appear on your printed receipts.</p>
               </form>
            </div>
          )}
        </div>
      </div>

      {/* Item Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border-2 border-gray-100">
            <div className="bg-gray-50 p-6 border-b-2 border-gray-200 flex justify-between items-center">
              <h3 className="text-2xl font-black text-gray-900">{editingItem ? 'Edit' : 'Add'} Menu Item</h3>
              <button onClick={() => setIsItemModalOpen(false)} className="text-gray-900 hover:text-[#F57C00] transition-colors"><X size={28} /></button>
            </div>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const itemData = {
                  name: formData.get('name') as string,
                  price: parseFloat(formData.get('price') as string),
                  categoryId: formData.get('categoryId') as string,
                  isVeg: formData.get('isVeg') === 'on'
                };
                if (editingItem) {
                  onUpdateMenuItem({ ...editingItem, ...itemData });
                } else {
                  onAddMenuItem(itemData);
                }
                setIsItemModalOpen(false);
              }}
              className="p-6 space-y-5"
            >
              <div>
                <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">Item Name</label>
                <input 
                  name="name" 
                  defaultValue={editingItem?.name} 
                  required 
                  className="w-full p-4 bg-white border-2 border-gray-300 rounded-xl text-gray-900 font-black text-lg focus:ring-2 focus:ring-[#F57C00] outline-none shadow-inner" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">Price (₹)</label>
                  <input 
                    name="price" 
                    type="number" 
                    defaultValue={editingItem?.price} 
                    required 
                    className="w-full p-4 bg-white border-2 border-gray-300 rounded-xl text-gray-900 font-black text-lg focus:ring-2 focus:ring-[#F57C00] outline-none shadow-inner" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">Category</label>
                  <select 
                    name="categoryId" 
                    defaultValue={editingItem?.categoryId} 
                    className="w-full p-4 bg-white border-2 border-gray-300 rounded-xl text-gray-900 font-black focus:ring-2 focus:ring-[#F57C00] outline-none shadow-inner appearance-none cursor-pointer"
                  >
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border-2 border-gray-200">
                <input 
                  name="isVeg" 
                  type="checkbox" 
                  defaultChecked={editingItem?.isVeg} 
                  id="isVeg" 
                  className="w-6 h-6 accent-green-600 rounded cursor-pointer" 
                />
                <label htmlFor="isVeg" className="text-base font-black text-gray-900 cursor-pointer">Vegetarian Item</label>
              </div>
              <button type="submit" className="w-full bg-[#F57C00] text-white py-4 rounded-2xl font-black text-xl shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95">
                {editingItem ? 'Update Menu Item' : 'Create Menu Item'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border-2 border-gray-100">
            <div className="bg-gray-50 p-6 border-b-2 border-gray-200 flex justify-between items-center">
              <h3 className="text-2xl font-black text-gray-900">{editingCat ? 'Edit' : 'Add'} Category</h3>
              <button onClick={() => setIsCatModalOpen(false)} className="text-gray-900 hover:text-[#F57C00] transition-colors"><X size={28} /></button>
            </div>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('catName') as string;
                if (editingCat) {
                  onUpdateCategory({ ...editingCat, name });
                } else {
                  onAddCategory(name);
                }
                setIsCatModalOpen(false);
              }}
              className="p-6 space-y-5"
            >
              <div>
                <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">Category Name</label>
                <input 
                  name="catName" 
                  defaultValue={editingCat?.name} 
                  required 
                  className="w-full p-4 bg-white border-2 border-gray-300 rounded-xl text-gray-900 font-black text-lg focus:ring-2 focus:ring-[#F57C00] outline-none shadow-inner" 
                />
              </div>
              <button type="submit" className="w-full bg-[#F57C00] text-white py-4 rounded-2xl font-black text-xl shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95">
                {editingCat ? 'Update Category' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const TabItem: React.FC<{ label: string; active: boolean; onClick: () => void; icon: React.ReactNode }> = ({ label, active, onClick, icon }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 font-black text-sm transition-all border-b-4 shrink-0 ${
      active ? 'border-[#F57C00] text-[#F57C00] bg-white' : 'border-transparent text-gray-800 hover:text-gray-900 hover:bg-gray-100'
    }`}
  >
    {icon} {label}
  </button>
);

export default MenuManagement;
