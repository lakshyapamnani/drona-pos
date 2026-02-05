
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
  CloudOff,
  Home,
  ClipboardList,
  PieChart,
  TrendingUp
} from 'lucide-react';
import { 
  MenuItem, 
  Category, 
  Order, 
  OrderStatus, 
  RestaurantInfo,
  Table,
  Addon
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
  // Check if URL path is /mobile for dedicated mobile view
  const [isMobileRoute, setIsMobileRoute] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    return path === '/mobile' || path === '/mobile/' || path.startsWith('/mobile');
  });
  const [mobileTab, setMobileTab] = useState<'analytics' | 'orders' | 'bills' | 'reports'>('analytics');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // States with Local Storage fallback
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('drona_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('drona_menu_items');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });
  const [orders, setOrders] = useState<Order[]>([]);  // Orders are stored in Firebase only
  const [tables, setTables] = useState<Table[]>(() => {
    const saved = localStorage.getItem('drona_tables');
    return saved ? JSON.parse(saved) : [
      { id: 't1', name: 'T-1', status: 'AVAILABLE' },
      { id: 't2', name: 'T-2', status: 'AVAILABLE' },
      { id: 't3', name: 'T-3', status: 'AVAILABLE' },
      { id: 't4', name: 'T-4', status: 'AVAILABLE' },
      { id: 't5', name: 'T-5', status: 'AVAILABLE' },
      { id: 't6', name: 'T-6', status: 'AVAILABLE' },
    ];
  });
  const [addons, setAddons] = useState<Addon[]>(() => {
    const saved = localStorage.getItem('drona_addons');
    return saved ? JSON.parse(saved) : [];
  });
  const [tableCarts, setTableCarts] = useState<Record<string, { items: any[]; customerName: string }>>(() => {
    const saved = localStorage.getItem('drona_table_carts');
    return saved ? JSON.parse(saved) : {};
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

  // Connectivity and Route Listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      setIsMobileRoute(path === '/mobile' || path === '/mobile/' || path.startsWith('/mobile'));
    };
    
    // Check on mount as well
    const path = window.location.pathname.toLowerCase();
    if (path === '/mobile' || path === '/mobile/' || path.startsWith('/mobile')) {
      setIsMobileRoute(true);
    }
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Initialize Firebase with default data if empty (only once, not on every load)
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        // Check if menu data already exists in Firebase
        const categoriesRef = ref(db, 'categories');
        onValue(categoriesRef, async (snapshot) => {
          if (!snapshot.exists()) {
            // Only sync if no data exists
            for (const cat of INITIAL_CATEGORIES) {
              await set(ref(db, `categories/${cat.id}`), cat);
            }
            console.log('Categories synced to Firebase');
          }
        }, { onlyOnce: true });

        const menuRef = ref(db, 'menu_items');
        onValue(menuRef, async (snapshot) => {
          if (!snapshot.exists()) {
            // Only sync if no data exists
            for (const item of INITIAL_MENU_ITEMS) {
              await set(ref(db, `menu_items/${item.id}`), item);
            }
            console.log('Menu items synced to Firebase');
          }
        }, { onlyOnce: true });
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    initializeDatabase();
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

    // Orders Sync - Firebase is the single source of truth
    const ordersRef = ref(db, 'orders');
    const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderArray = Object.values(data) as Order[];
        const sortedOrders = orderArray.sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());
        setOrders(sortedOrders);
      } else {
        // No orders in Firebase
        setOrders([]);
      }
      setIsDataLoaded(true);
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

    // Tables Sync
    const tablesRef = ref(db, 'tables');
    const unsubscribeTables = onValue(tablesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tableArray = Object.values(data) as Table[];
        setTables(tableArray);
        localStorage.setItem('drona_tables', JSON.stringify(tableArray));
      }
    });

    // Addons Sync
    const addonsRef = ref(db, 'addons');
    const unsubscribeAddons = onValue(addonsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const addonArray = Object.values(data) as Addon[];
        setAddons(addonArray);
        localStorage.setItem('drona_addons', JSON.stringify(addonArray));
      } else {
        setAddons([]);
        localStorage.setItem('drona_addons', JSON.stringify([]));
      }
    });

    // Table Carts Sync (for pending orders on tables)
    const tableCartsRef = ref(db, 'table_carts');
    const unsubscribeTableCarts = onValue(tableCartsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTableCarts(data);
        localStorage.setItem('drona_table_carts', JSON.stringify(data));
      } else {
        setTableCarts({});
        localStorage.setItem('drona_table_carts', JSON.stringify({}));
      }
    });

    return () => {
      unsubscribeCats();
      unsubscribeMenu();
      unsubscribeOrders();
      unsubscribeSettings();
      unsubscribeTables();
      unsubscribeAddons();
      unsubscribeTableCarts();
    };
  }, []);

  // Action Handlers - Firebase is the single source of truth for orders
  const handleCreateOrder = async (order: Order) => {
    console.log("Creating order:", order);
    
    // Clean the order object - remove undefined values (Firebase doesn't accept undefined)
    const cleanOrder = JSON.parse(JSON.stringify(order));
    
    try {
      // Save directly to Firebase - the onValue listener will update local state
      await set(ref(db, `orders/${order.id}`), cleanOrder);
      console.log("Order saved to Firebase successfully:", order.id);
    } catch (error) {
      console.error("Firebase Error (Create Order):", error);
      alert("Failed to save order. Please check your internet connection.");
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      // Update Firebase directly - the onValue listener will update local state
      await update(ref(db, `orders/${orderId}`), { status });
    } catch (error) {
      console.error("Firebase Error (Update Status):", error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      // Delete from Firebase directly - the onValue listener will update local state
      await set(ref(db, `orders/${orderId}`), null);
    } catch (error) {
      console.error("Firebase Error (Delete Order):", error);
    }
  };

  // Table Handlers
  const handleAddTable = async (tableName: string) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newTable: Table = { id: newId, name: tableName, status: 'AVAILABLE' };
    
    const updatedTables = [...tables, newTable];
    setTables(updatedTables);
    localStorage.setItem('drona_tables', JSON.stringify(updatedTables));

    try {
      await set(ref(db, `tables/${newId}`), newTable);
    } catch (error) {
      console.error("Firebase Sync Error (Add Table):", error);
    }
  };

  const handleDeleteTable = async (tableId: string) => {
    const updatedTables = tables.filter(t => t.id !== tableId);
    setTables(updatedTables);
    localStorage.setItem('drona_tables', JSON.stringify(updatedTables));

    try {
      await set(ref(db, `tables/${tableId}`), null);
    } catch (error) {
      console.error("Firebase Sync Error (Delete Table):", error);
    }
  };

  const handleUpdateTableStatus = async (tableId: string, status: Table['status'], currentOrderId?: string) => {
    const updatedTables = tables.map(t => 
      t.id === tableId ? { ...t, status, currentOrderId } : t
    );
    setTables(updatedTables);
    localStorage.setItem('drona_tables', JSON.stringify(updatedTables));

    try {
      await update(ref(db, `tables/${tableId}`), { status, currentOrderId: currentOrderId || null });
    } catch (error) {
      console.error("Firebase Sync Error (Update Table):", error);
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
      // Also delete addons linked to this category
      const addonsToDelete = addons.filter(a => a.categoryId === id);
      for (const addon of addonsToDelete) {
        await set(ref(db, `addons/${addon.id}`), null);
      }
    } catch (error) {
      console.error("Firebase Sync Error (Delete Category):", error);
    }
  };

  // Addon Handlers
  const handleAddAddon = async (addon: Addon) => {
    try {
      await set(ref(db, `addons/${addon.id}`), addon);
    } catch (error) {
      console.error("Firebase Sync Error (Add Addon):", error);
    }
  };

  const handleUpdateAddon = async (addon: Addon) => {
    try {
      await set(ref(db, `addons/${addon.id}`), addon);
    } catch (error) {
      console.error("Firebase Sync Error (Update Addon):", error);
    }
  };

  const handleDeleteAddon = async (id: string) => {
    try {
      await set(ref(db, `addons/${id}`), null);
    } catch (error) {
      console.error("Firebase Sync Error (Delete Addon):", error);
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

  const handleUpdateTableCarts = async (newTableCarts: Record<string, { items: any[]; customerName: string }>) => {
    setTableCarts(newTableCarts);
    localStorage.setItem('drona_table_carts', JSON.stringify(newTableCarts));
    try {
      await set(ref(db, 'table_carts'), newTableCarts);
    } catch (error) {
      console.error("Firebase Sync Error (Table Carts):", error);
    }
  };

  // Reset menu database with new menu from constants
  const handleResetMenuDatabase = async () => {
    try {
      // Clear old categories and menu items from Firebase
      await set(ref(db, 'categories'), null);
      await set(ref(db, 'menu_items'), null);
      
      // Sync all new categories to Firebase
      for (const cat of INITIAL_CATEGORIES) {
        await set(ref(db, `categories/${cat.id}`), cat);
      }
      
      // Sync all new menu items to Firebase
      for (const item of INITIAL_MENU_ITEMS) {
        await set(ref(db, `menu_items/${item.id}`), item);
      }
      
      // Update local state
      setCategories(INITIAL_CATEGORIES);
      setMenuItems(INITIAL_MENU_ITEMS);
      localStorage.setItem('drona_categories', JSON.stringify(INITIAL_CATEGORIES));
      localStorage.setItem('drona_menu_items', JSON.stringify(INITIAL_MENU_ITEMS));
      
      alert('Menu database reset successfully with new menu!');
    } catch (error) {
      console.error('Error resetting menu database:', error);
      alert('Failed to reset menu database. Check console for details.');
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
            tables={tables}
            tableCarts={tableCarts}
            addons={addons}
            onCreateOrder={handleCreateOrder}
            onUpdateTableStatus={handleUpdateTableStatus}
            onUpdateTableCarts={handleUpdateTableCarts}
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
            onDeleteOrder={handleDeleteOrder}
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
            onDeleteOrder={handleDeleteOrder}
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
            onDeleteOrder={handleDeleteOrder}
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
            onDeleteOrder={handleDeleteOrder}
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
            tables={tables}
            addons={addons}
            setTaxRate={handleSaveTaxRate}
            setRestaurantInfo={handleSaveRestaurantInfo}
            onAddMenuItem={handleAddMenuItem}
            onUpdateMenuItem={handleUpdateMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
            onAddTable={handleAddTable}
            onDeleteTable={handleDeleteTable}
            onAddAddon={handleAddAddon}
            onUpdateAddon={handleUpdateAddon}
            onDeleteAddon={handleDeleteAddon}
            onResetMenuDatabase={handleResetMenuDatabase}
          />
        );
      default:
        return <BillingScreen categories={categories} menuItems={menuItems} taxRate={taxRate} restaurantInfo={restaurantInfo} tables={tables} tableCarts={tableCarts} addons={addons} onCreateOrder={handleCreateOrder} onUpdateTableStatus={handleUpdateTableStatus} onUpdateTableCarts={handleUpdateTableCarts} />;
    }
  };

  // Mobile view rendering
  const renderMobileScreen = () => {
    // Show loading state while data is being fetched
    if (!isDataLoaded) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
          <div className="w-16 h-16 border-4 border-[#F57C00] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading data from cloud...</p>
          <p className="text-gray-400 text-sm mt-1">Please wait</p>
        </div>
      );
    }

    switch (mobileTab) {
      case 'analytics':
        return <Dashboard orders={orders} />;
      case 'orders':
        return (
          <OrdersList
            title="Live Orders"
            orders={orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED')}
            onUpdateStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            restaurantInfo={restaurantInfo}
            taxRate={taxRate}
          />
        );
      case 'bills':
        return (
          <OrdersList
            title="All Bills"
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            restaurantInfo={restaurantInfo}
            taxRate={taxRate}
          />
        );
      case 'reports':
        return <Reports orders={orders} />;
      default:
        return <Dashboard orders={orders} />;
    }
  };

  // Mobile Layout - triggered by /mobile URL path
  if (isMobileRoute) {
    return (
      <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white h-14 border-b flex items-center justify-between px-4 shrink-0 shadow-sm z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#F57C00] rounded-lg flex items-center justify-center font-bold text-white">D</div>
            <span className="text-lg font-bold tracking-tight">DRONA <span className="text-[#F57C00]">POS</span></span>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <Cloud size={12} />
                <span className="text-[10px] font-black">LIVE</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded-full">
                <CloudOff size={12} />
                <span className="text-[10px] font-black">OFFLINE</span>
              </div>
            )}
          </div>
        </header>

        {/* Mobile Content */}
        <main className="flex-1 overflow-hidden">
          {renderMobileScreen()}
        </main>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t shadow-lg shrink-0 safe-area-bottom">
          <div className="flex justify-around items-center h-16">
            <MobileNavItem
              icon={<TrendingUp size={22} />}
              label="Analytics"
              active={mobileTab === 'analytics'}
              onClick={() => setMobileTab('analytics')}
            />
            <MobileNavItem
              icon={<Clock size={22} />}
              label="Orders"
              active={mobileTab === 'orders'}
              onClick={() => setMobileTab('orders')}
              badge={orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length}
            />
            <MobileNavItem
              icon={<Receipt size={22} />}
              label="Bills"
              active={mobileTab === 'bills'}
              onClick={() => setMobileTab('bills')}
            />
            <MobileNavItem
              icon={<PieChart size={22} />}
              label="Reports"
              active={mobileTab === 'reports'}
              onClick={() => setMobileTab('reports')}
            />
          </div>
        </nav>
      </div>
    );
  }

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
               <button
                 onClick={() => setActiveScreen('BILLING')}
                 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-sm transition-all ${
                   activeScreen === 'BILLING' 
                     ? 'bg-[#F57C00] text-white shadow-lg shadow-orange-200' 
                     : 'bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-[#F57C00]'
                 }`}
               >
                 <Receipt size={16} />
                 <span>Billing</span>
               </button>
               <div className="h-6 w-px bg-gray-200 mx-1"></div>
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

interface MobileNavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all relative ${
      active 
        ? 'text-[#F57C00]' 
        : 'text-gray-400'
    }`}
  >
    <div className={`relative p-2 rounded-xl transition-all ${active ? 'bg-orange-100' : ''}`}>
      {icon}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </div>
    <span className={`text-[10px] mt-1 font-bold ${active ? 'text-[#F57C00]' : 'text-gray-500'}`}>{label}</span>
  </button>
);

export default App;
