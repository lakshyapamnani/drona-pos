
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Menu as MenuIcon, 
  Bell, 
  Printer, 
  FileText,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Layers,
  Cloud,
  CloudOff
} from 'lucide-react';
import { 
  MenuItem, 
  Category, 
  Order, 
  OrderStatus, 
  RestaurantInfo
} from './types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_MENU_ITEMS, 
  TAX_RATE as INITIAL_TAX_RATE 
} from './constants';
import BillingScreen from './components/BillingScreen';
import Dashboard from './components/Dashboard';
import OrdersList from './components/OrdersList';
import Reports from './components/Reports';
import MenuManagement from './components/MenuManagement';

// Firebase imports
import { db } from './firebase';
import { ref, onValue, set, push, update } from 'firebase/database';

type ActiveScreen = 
  | 'BILLING' 
  | 'DASHBOARD' 
  | 'LIVE_ORDERS' 
  | 'COMPLETED_ORDERS' 
  | 'CANCELLED_ORDERS' 
  | 'REPORTS' 
  | 'MENU_CONFIG'
  | 'ALL_ORDERS';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('BILLING');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // States with Local Storage fallback
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('drona_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('drona_menu_items');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('drona_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [taxRate, setTaxRate] = useState(() => {
    const saved = localStorage.getItem('drona_tax_rate');
    return saved ? parseFloat(saved) : INITIAL_TAX_RATE;
  });
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>(() => {
    const saved = localStorage.getItem('drona_restaurant_info');
    return saved ? JSON.parse(saved) : {
      name: 'DRONA POS CAFE',
      phone: '+91 9876543210',
      address: '123 Main Street, Food Park, City'
    };
  });

  // Connectivity Listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Firebase Real-time Listeners
  useEffect(() => {
    // Categories Sync
    const categoriesRef = ref(db, 'categories');
    const unsubscribeCats = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const catArray = Object.values(data) as Category[];
        setCategories(catArray);
        localStorage.setItem('drona_categories', JSON.stringify(catArray));
      }
    });

    // Menu Items Sync
    const menuRef = ref(db, 'menu_items');
    const unsubscribeMenu = onValue(menuRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const itemArray = Object.values(data) as MenuItem[];
        setMenuItems(itemArray);
        localStorage.setItem('drona_menu_items', JSON.stringify(itemArray));
      }
    });

    // Orders Sync
    const ordersRef = ref(db, 'orders');
    const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderArray = Object.values(data) as Order[];
        const sortedOrders = orderArray.sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());
        setOrders(sortedOrders);
        localStorage.setItem('drona_orders', JSON.stringify(sortedOrders));
      }
    });

    // Settings Sync
    const settingsRef = ref(db, 'settings');
    const unsubscribeSettings = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.restaurantInfo) {
          setRestaurantInfo(data.restaurantInfo);
          localStorage.setItem('drona_restaurant_info', JSON.stringify(data.restaurantInfo));
        }
        if (data.taxRate !== undefined) {
          setTaxRate(data.taxRate);
          localStorage.setItem('drona_tax_rate', data.taxRate.toString());
        }
      }
    });

    return () => {
      unsubscribeCats();
      unsubscribeMenu();
      unsubscribeOrders();
      unsubscribeSettings();
    };
  }, []);

  // Action Handlers with Cloud Sync
  const handleCreateOrder = async (order: Order) => {
    // 1. Local Update
    const updatedOrders = [order, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('drona_orders', JSON.stringify(updatedOrders));

    // 2. Firebase Push
    try {
      await set(ref(db, `orders/${order.id}`), order);
    } catch (error) {
      console.error("Firebase Sync Error (Order):", error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(updatedOrders);
    localStorage.setItem('drona_orders', JSON.stringify(updatedOrders));

    try {
      await update(ref(db, `orders/${orderId}`), { status });
    } catch (error) {
      console.error("Firebase Sync Error (Status):", error);
    }
  };

  const handleAddMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newItem = { ...item, id: newId };
    try {
      await set(ref(db, `menu_items/${newId}`), newItem);
    } catch (error) {
      console.error("Firebase Sync Error (Add Item):", error);
    }
  };

  const handleUpdateMenuItem = async (updatedItem: MenuItem) => {
    try {
      await set(ref(db, `menu_items/${updatedItem.id}`), updatedItem);
    } catch (error) {
      console.error("Firebase Sync Error (Update Item):", error);
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    try {
      await set(ref(db, `menu_items/${id}`), null);
    } catch (error) {
      console.error("Firebase Sync Error (Delete Item):", error);
    }
  };

  const handleAddCategory = async (name: string) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newCat = { id: newId, name };
    try {
      await set(ref(db, `categories/${newId}`), newCat);
    } catch (error) {
      console.error("Firebase Sync Error (Add Category):", error);
    }
  };

  const handleUpdateCategory = async (updatedCat: Category) => {
    try {
      await set(ref(db, `categories/${updatedCat.id}`), updatedCat);
    } catch (error) {
      console.error("Firebase Sync Error (Update Category):", error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await set(ref(db, `categories/${id}`), null);
      // Also delete items in this category
      const itemsToDelete = menuItems.filter(i => i.categoryId === id);
      for (const item of itemsToDelete) {
        await set(ref(db, `menu_items/${item.id}`), null);
      }
    } catch (error) {
      console.error("Firebase Sync Error (Delete Category):", error);
    }
  };

  const handleSaveTaxRate = async (newRate: number) => {
    setTaxRate(newRate);
    try {
      await update(ref(db, 'settings'), { taxRate: newRate });
    } catch (error) {
      console.error("Firebase Sync Error (Tax):", error);
    }
  };

  const handleSaveRestaurantInfo = async (info: RestaurantInfo) => {
    setRestaurantInfo(info);
    try {
      await update(ref(db, 'settings'), { restaurantInfo: info });
    } catch (error) {
      console.error("Firebase Sync Error (Profile):", error);
    }
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'BILLING':
        return (
          <BillingScreen 
            categories={categories} 
            menuItems={menuItems} 
            taxRate={taxRate}
            restaurantInfo={restaurantInfo}
            onCreateOrder={handleCreateOrder} 
          />
        );
      case 'DASHBOARD':
        return <Dashboard orders={orders} />;
      case 'LIVE_ORDERS':
        return (
          <OrdersList 
            title="Live Orders" 
            orders={orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED')} 
            onUpdateStatus={handleUpdateOrderStatus}
            restaurantInfo={restaurantInfo}
            taxRate={taxRate}
          />
        );
      case 'ALL_ORDERS':
        return (
          <OrdersList 
            title="All Bills" 
            orders={orders} 
            onUpdateStatus={handleUpdateOrderStatus}
            restaurantInfo={restaurantInfo}
            taxRate={taxRate}
          />
        );
      case 'COMPLETED_ORDERS':
        return (
          <OrdersList 
            title="Completed Orders" 
            orders={orders.filter(o => o.status === 'COMPLETED')} 
            onUpdateStatus={handleUpdateOrderStatus}
            restaurantInfo={restaurantInfo}
            taxRate={taxRate}
          />
        );
      case 'CANCELLED_ORDERS':
        return (
          <OrdersList 
            title="Cancelled Orders" 
            orders={orders.filter(o => o.status === 'CANCELLED')} 
            onUpdateStatus={handleUpdateOrderStatus}
            restaurantInfo={restaurantInfo}
            taxRate={taxRate}
          />
        );
      case 'REPORTS':
        return <Reports orders={orders} />;
      case 'MENU_CONFIG':
        return (
          <MenuManagement 
            categories={categories} 
            menuItems={menuItems}
            taxRate={taxRate}
            restaurantInfo={restaurantInfo}
            setTaxRate={handleSaveTaxRate}
            setRestaurantInfo={handleSaveRestaurantInfo}
            onAddMenuItem={handleAddMenuItem}
            onUpdateMenuItem={handleUpdateMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        );
      default:
        return <BillingScreen categories={categories} menuItems={menuItems} taxRate={taxRate} restaurantInfo={restaurantInfo} onCreateOrder={handleCreateOrder} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden text-sm select-none">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-[#262626] text-white z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-700 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F57C00] rounded-lg flex items-center justify-center font-bold text-xl">D</div>
          <span className="text-xl font-bold tracking-tight">DRONA <span className="text-[#F57C00]">POS</span></span>
        </div>

        <nav className="mt-4 flex-1 overflow-y-auto custom-scrollbar">
          <SidebarItem 
            icon={<Receipt size={20} />} 
            label="Billing" 
            active={activeScreen === 'BILLING'} 
            onClick={() => { setActiveScreen('BILLING'); setIsSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={<BarChart3 size={20} />} 
            label="Analytics Dashboard" 
            active={activeScreen === 'DASHBOARD'} 
            onClick={() => { setActiveScreen('DASHBOARD'); setIsSidebarOpen(false); }} 
          />
          
          <div className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</div>
          <SidebarItem 
            icon={<Layers size={20} />} 
            label="All Bills" 
            active={activeScreen === 'ALL_ORDERS'} 
            onClick={() => { setActiveScreen('ALL_ORDERS'); setIsSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={<Clock size={20} />} 
            label="Live Orders" 
            active={activeScreen === 'LIVE_ORDERS'} 
            onClick={() => { setActiveScreen('LIVE_ORDERS'); setIsSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={<CheckCircle2 size={20} />} 
            label="Completed Orders" 
            active={activeScreen === 'COMPLETED_ORDERS'} 
            onClick={() => { setActiveScreen('COMPLETED_ORDERS'); setIsSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={<XCircle size={20} />} 
            label="Cancelled Orders" 
            active={activeScreen === 'CANCELLED_ORDERS'} 
            onClick={() => { setActiveScreen('CANCELLED_ORDERS'); setIsSidebarOpen(false); }} 
          />

          <div className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Business</div>
          <SidebarItem 
            icon={<FileSpreadsheet size={20} />} 
            label="Reports" 
            active={activeScreen === 'REPORTS'} 
            onClick={() => { setActiveScreen('REPORTS'); setIsSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={<Settings size={20} />} 
            label="Configuration" 
            active={activeScreen === 'MENU_CONFIG'} 
            onClick={() => { setActiveScreen('MENU_CONFIG'); setIsSidebarOpen(false); }} 
          />

          <div className="mt-8 border-t border-gray-700">
            <SidebarItem icon={<LogOut size={20} />} label="Logout" onClick={() => console.log('Logout')} />
          </div>
        </nav>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white h-14 border-b flex items-center justify-between px-4 shrink-0 shadow-sm z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <MenuIcon size={24} className="text-gray-600" />
            </button>
            <div className="hidden md:flex items-center gap-2">
               <span className="text-[#F57C00] font-bold text-lg">DRONA</span>
               <div className="h-6 w-px bg-gray-200 mx-2"></div>
               <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border">
                 {isOnline ? (
                   <div className="flex items-center gap-1.5 text-green-600">
                     <Cloud size={14} />
                     <span className="text-[10px] font-black uppercase tracking-tighter">Live Sync</span>
                   </div>
                 ) : (
                   <div className="flex items-center gap-1.5 text-red-500">
                     <CloudOff size={14} />
                     <span className="text-[10px] font-black uppercase tracking-tighter">Offline</span>
                   </div>
                 )}
               </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-4">
            <HeaderAction icon={<Printer size={20} />} tooltip="Printer Settings" />
            <HeaderAction 
              icon={<FileText size={20} />} 
              tooltip="Reports" 
              onClick={() => setActiveScreen('REPORTS')}
            />
            <div className="relative">
              <HeaderAction 
                icon={<Bell size={20} />} 
                tooltip="All Bills" 
                onClick={() => setActiveScreen('ALL_ORDERS')}
              />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </div>
            <div className="flex items-center gap-2 pl-2 border-l ml-2">
              <div className="w-8 h-8 bg-orange-100 text-[#F57C00] rounded-full flex items-center justify-center font-bold">A</div>
              <span className="hidden lg:block font-black text-gray-900">Admin</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-6 py-3.5 transition-colors ${
      active ? 'bg-[#F57C00] text-white font-semibold' : 'text-gray-400 hover:text-white hover:bg-gray-800'
    }`}
  >
    {icon}
    <span className="flex-1 text-left">{label}</span>
    {active && <ChevronRight size={16} />}
  </button>
);

const HeaderAction: React.FC<{ icon: React.ReactNode; tooltip: string; onClick?: () => void }> = ({ icon, tooltip, onClick }) => (
  <button 
    onClick={onClick}
    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative group" 
    title={tooltip}
  >
    {icon}
  </button>
);

export default App;
