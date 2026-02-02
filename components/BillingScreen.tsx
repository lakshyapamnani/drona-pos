
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  UtensilsCrossed,
  Truck,
  Package,
  ShoppingBag,
  ShoppingCart,
  CheckCircle,
  User,
  Users,
  X
} from 'lucide-react';
import { Category, MenuItem, CartItem, OrderType, PaymentMode, Order, RestaurantInfo, Table } from '../types';

interface VegChoicePopupProps {
  item: MenuItem;
  onSelect: (choice: 'VEG' | 'NON_VEG') => void;
  onClose: () => void;
}

const VegChoicePopup: React.FC<VegChoicePopupProps> = ({ item, onSelect, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
    <div className="bg-white rounded-2xl p-6 w-80 shadow-2xl" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-black text-lg text-gray-900">Choose Option</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-4 font-medium">{item.name}</p>
      <div className="flex gap-3">
        <button
          onClick={() => onSelect('VEG')}
          className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-black transition-all flex flex-col items-center gap-1 shadow-lg shadow-green-200"
        >
          <span className="w-4 h-4 rounded-full bg-white border-2 border-green-700"></span>
          <span>Veg</span>
          <span className="text-sm opacity-90">₹{item.vegPrice}</span>
        </button>
        <button
          onClick={() => onSelect('NON_VEG')}
          className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-black transition-all flex flex-col items-center gap-1 shadow-lg shadow-red-200"
        >
          <span className="w-4 h-4 rounded-full bg-white border-2 border-red-700"></span>
          <span>Non-Veg</span>
          <span className="text-sm opacity-90">₹{item.nonVegPrice}</span>
        </button>
      </div>
    </div>
  </div>
);

interface TableCart {
  items: CartItem[];
  customerName: string;
}

interface BillingScreenProps {
  categories: Category[];
  menuItems: MenuItem[];
  taxRate: number;
  restaurantInfo: RestaurantInfo;
  tables: Table[];
  tableCarts: Record<string, TableCart>;
  onCreateOrder: (order: Order) => void;
  onUpdateTableStatus: (tableId: string, status: Table['status'], currentOrderId?: string) => void;
  onUpdateTableCarts: (tableCarts: Record<string, TableCart>) => void;
}

const BillingScreen: React.FC<BillingScreenProps> = ({ 
  categories, 
  menuItems, 
  taxRate, 
  restaurantInfo, 
  tables,
  tableCarts,
  onCreateOrder,
  onUpdateTableStatus,
  onUpdateTableCarts
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id || '');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<OrderType>('DINE_IN');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('CASH');
  const [vegChoiceItem, setVegChoiceItem] = useState<MenuItem | null>(null);
  
  // Get current cart based on selected table or default cart for non-dine-in
  const [defaultCart, setDefaultCart] = useState<CartItem[]>([]);
  const [defaultCustomerName, setDefaultCustomerName] = useState('');

  // Helper to update table carts
  const updateTableCart = (tableId: string, updater: (current: TableCart) => TableCart) => {
    const currentCart = tableCarts[tableId] || { items: [], customerName: '' };
    const updated = updater(currentCart);
    onUpdateTableCarts({
      ...tableCarts,
      [tableId]: updated
    });
  };

  const currentCart = useMemo(() => {
    if (orderType === 'DINE_IN' && selectedTableId) {
      return tableCarts[selectedTableId]?.items || [];
    }
    return defaultCart;
  }, [orderType, selectedTableId, tableCarts, defaultCart]);

  const customerName = useMemo(() => {
    if (orderType === 'DINE_IN' && selectedTableId) {
      return tableCarts[selectedTableId]?.customerName || '';
    }
    return defaultCustomerName;
  }, [orderType, selectedTableId, tableCarts, defaultCustomerName]);

  const setCustomerName = (name: string) => {
    if (orderType === 'DINE_IN' && selectedTableId) {
      updateTableCart(selectedTableId, (cart) => ({
        ...cart,
        customerName: name
      }));
    } else {
      setDefaultCustomerName(name);
    }
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => item.categoryId === selectedCategoryId);
  }, [selectedCategoryId, menuItems]);

  const handleAddItem = (item: MenuItem) => {
    // If item has both veg and non-veg options, show popup
    if (item.vegType === 'BOTH') {
      setVegChoiceItem(item);
      return;
    }
    addToCart(item);
  };

  const handleVegChoice = (choice: 'VEG' | 'NON_VEG') => {
    if (!vegChoiceItem) return;
    
    const price = choice === 'VEG' ? vegChoiceItem.vegPrice! : vegChoiceItem.nonVegPrice!;
    const modifiedItem: MenuItem = {
      ...vegChoiceItem,
      price,
      isVeg: choice === 'VEG'
    };
    
    addToCart(modifiedItem, choice);
    setVegChoiceItem(null);
  };

  const addToCart = (item: MenuItem, vegChoice?: 'VEG' | 'NON_VEG') => {
    // Create unique id for items with veg choice
    const cartItemId = vegChoice ? `${item.id}-${vegChoice}` : item.id;
    
    if (orderType === 'DINE_IN' && selectedTableId) {
      const currentItems = tableCarts[selectedTableId]?.items || [];
      const existing = currentItems.find(i => i.id === cartItemId);
      
      if (existing) {
        updateTableCart(selectedTableId, (cart) => ({
          ...cart,
          items: cart.items.map(i => i.id === cartItemId ? { ...i, quantity: i.quantity + 1 } : i)
        }));
      } else {
        updateTableCart(selectedTableId, (cart) => ({
          ...cart,
          items: [...cart.items, { ...item, id: cartItemId, quantity: 1, selectedVegChoice: vegChoice }]
        }));
      }
      
      // Mark table as occupied when items are added
      const table = tables.find(t => t.id === selectedTableId);
      if (table && table.status === 'AVAILABLE') {
        onUpdateTableStatus(selectedTableId, 'OCCUPIED');
      }
    } else {
      setDefaultCart(prev => {
        const existing = prev.find(i => i.id === cartItemId);
        if (existing) {
          return prev.map(i => i.id === cartItemId ? { ...i, quantity: i.quantity + 1 } : i);
        }
        return [...prev, { ...item, id: cartItemId, quantity: 1, selectedVegChoice: vegChoice }];
      });
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    if (orderType === 'DINE_IN' && selectedTableId) {
      const currentItems = tableCarts[selectedTableId]?.items || [];
      const updatedItems = currentItems.map(item => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
      
      // If cart is now empty, reset table status to AVAILABLE
      if (updatedItems.length === 0) {
        onUpdateTableStatus(selectedTableId, 'AVAILABLE');
      }
      
      updateTableCart(selectedTableId, (cart) => ({
        ...cart,
        items: updatedItems
      }));
    } else {
      setDefaultCart(prev => prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0));
    }
  };

  const removeFromCart = (id: string) => {
    if (orderType === 'DINE_IN' && selectedTableId) {
      const currentItems = tableCarts[selectedTableId]?.items || [];
      const updatedItems = currentItems.filter(item => item.id !== id);
      
      // If cart is now empty, reset table status to AVAILABLE
      if (updatedItems.length === 0) {
        onUpdateTableStatus(selectedTableId, 'AVAILABLE');
      }
      
      updateTableCart(selectedTableId, (cart) => ({
        ...cart,
        items: updatedItems
      }));
    } else {
      setDefaultCart(prev => prev.filter(item => item.id !== id));
    }
  };

  const subtotal = currentCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const printReceipt = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <style>
            @page { size: 2in 10in; margin: 0; }
            body { 
              font-family: 'Courier New', Courier, monospace; 
              width: 2in; 
              margin: 0; 
              padding: 10px; 
              font-size: 11px; 
              color: #000; 
              line-height: 1.2;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .line { border-bottom: 1px dashed #000; margin: 8px 0; }
            .header-name { font-size: 14px; font-weight: bold; margin-bottom: 2px; text-transform: uppercase; }
            .item-row { display: flex; justify-content: space-between; margin: 4px 0; }
            .item-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 5px; }
            .qty { width: 25px; text-align: center; }
            .price { width: 45px; text-align: right; }
            .footer { margin-top: 15px; font-size: 10px; }
            .total-section { font-size: 12px; margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="center header-name">${restaurantInfo.name}</div>
          <div class="center">${restaurantInfo.address}</div>
          <div class="center">Tel: ${restaurantInfo.phone}</div>
          <div class="line"></div>
          <div>Bill: ${order.billNo}</div>
          ${order.customerName ? `<div>Cust: ${order.customerName}</div>` : ''}
          <div>Date: ${order.date}</div>
          <div>Time: ${order.time}</div>
          <div>Type: ${order.orderType}</div>
          <div class="line"></div>
          <div class="bold item-row">
            <span class="item-name">Item</span>
            <span class="qty">Qty</span>
            <span class="price">Amt</span>
          </div>
          ${order.items.map(it => `
            <div class="item-row">
              <span class="item-name">${it.name}</span>
              <span class="qty">${it.quantity}</span>
              <span class="price">${(it.price * it.quantity).toFixed(0)}</span>
            </div>
          `).join('')}
          <div class="line"></div>
          <div class="item-row"><span>Subtotal:</span><span>₹${order.subtotal.toFixed(0)}</span></div>
          <div class="item-row"><span>Tax (${(taxRate * 100).toFixed(0)}%):</span><span>₹${order.tax.toFixed(0)}</span></div>
          <div class="item-row bold total-section"><span>TOTAL:</span><span>₹${order.total.toFixed(0)}</span></div>
          <div class="line"></div>
          <div class="center">Paid via ${order.paymentMode}</div>
          <div class="footer center">
            <p>Thank you!</p>
            <p>Visit again.</p>
          </div>
          <script>window.print(); setTimeout(() => window.close(), 500);</script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handlePlaceOrder = (print = false) => {
    if (currentCart.length === 0) {
      alert("Please add items to the cart first.");
      return;
    }

    if (orderType === 'DINE_IN' && !selectedTableId) {
      alert("Please select a table for dine-in orders.");
      return;
    }

    const selectedTable = tables.find(t => t.id === selectedTableId);

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      billNo: `INV-${Date.now().toString().substr(-6)}`,
      customerName: (customerName || "").trim(),
      tableId: orderType === 'DINE_IN' ? selectedTableId || undefined : undefined,
      tableName: orderType === 'DINE_IN' ? selectedTable?.name : undefined,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: [...currentCart],
      subtotal,
      tax,
      total,
      paymentMode,
      orderType,
      staffName: 'Admin',
      status: 'COMPLETED'
    };

    onCreateOrder(newOrder);
    if (print) {
      printReceipt(newOrder);
    }
    
    // Clear the cart for the table and make table available
    if (orderType === 'DINE_IN' && selectedTableId) {
      const updatedCarts = { ...tableCarts };
      delete updatedCarts[selectedTableId];
      onUpdateTableCarts(updatedCarts);
      onUpdateTableStatus(selectedTableId, 'AVAILABLE');
      setSelectedTableId(null);
    } else {
      setDefaultCart([]);
      setDefaultCustomerName('');
    }
  };
  // Get table item count for badges
  const getTableItemCount = (tableId: string) => {
    return tableCarts[tableId]?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Veg Choice Popup */}
      {vegChoiceItem && (
        <VegChoicePopup
          item={vegChoiceItem}
          onSelect={handleVegChoice}
          onClose={() => setVegChoiceItem(null)}
        />
      )}
      
      {/* Table Selection Bar */}
      <div className="bg-white border-b shadow-sm px-4 py-3 shrink-0">
        <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-1">
          <div className="flex items-center gap-2 shrink-0">
            <Users size={20} className="text-[#F57C00]" />
            <span className="text-sm font-black text-gray-700 uppercase tracking-wider">Tables</span>
          </div>
          <div className="h-6 w-px bg-gray-300" />
          {tables.map(table => {
            const itemCount = getTableItemCount(table.id);
            const isSelected = selectedTableId === table.id;
            const isOccupied = table.status === 'OCCUPIED' || itemCount > 0;
            
            return (
              <button
                key={table.id}
                onClick={() => {
                  setSelectedTableId(table.id);
                  setOrderType('DINE_IN');
                }}
                className={`relative px-4 py-2 rounded-xl font-black text-sm transition-all shrink-0 ${
                  isSelected 
                    ? 'bg-[#F57C00] text-white shadow-lg shadow-orange-200' 
                    : isOccupied
                      ? 'bg-orange-100 text-[#F57C00] border-2 border-[#F57C00]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {table.name}
                {itemCount > 0 && (
                  <span className={`absolute -top-2 -right-2 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                    isSelected ? 'bg-white text-[#F57C00]' : 'bg-[#F57C00] text-white'
                  }`}>
                    {itemCount}
                  </span>
                )}
              </button>
            );
          })}
          {selectedTableId && (
            <button
              onClick={() => setSelectedTableId(null)}
              className="px-3 py-2 rounded-xl font-bold text-xs text-gray-500 hover:bg-gray-100 transition-all shrink-0"
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-32 md:w-48 bg-white border-r flex flex-col shrink-0 shadow-sm z-20">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`w-full py-3.5 px-4 text-left transition-all flex items-center gap-3 group border-b border-gray-100 ${
                  selectedCategoryId === cat.id 
                    ? 'bg-orange-50 border-r-4 border-r-[#F57C00] text-[#F57C00]' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className={`text-xs md:text-sm font-bold uppercase tracking-tight ${selectedCategoryId === cat.id ? 'text-[#F57C00]' : 'text-gray-700'}`}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-gray-50 p-6 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {filteredItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleAddItem(item)}
              className="bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-[#F57C00] hover:shadow-lg transition-all p-4 text-left relative group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-3">
                {item.vegType === 'BOTH' ? (
                  <span className="w-4 h-4 rounded-full border-2 p-[2px]" style={{borderImage: 'linear-gradient(90deg, #16a34a 50%, #dc2626 50%) 1'}}>
                    <div className="w-full h-full rounded-full" style={{background: 'linear-gradient(90deg, #16a34a 50%, #dc2626 50%)'}}></div>
                  </span>
                ) : (
                  <span className={`w-4 h-4 rounded-full border-2 ${item.vegType === 'VEG' || item.isVeg ? 'border-green-600 p-[2px]' : 'border-red-600 p-[2px]'}`}>
                    <div className={`w-full h-full rounded-full ${item.vegType === 'VEG' || item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                  </span>
                )}
                {item.vegType === 'BOTH' ? (
                  <div className="text-right">
                    <span className="text-xs font-black text-green-600">V:₹{item.vegPrice}</span>
                    <span className="text-gray-400 mx-0.5">/</span>
                    <span className="text-xs font-black text-red-600">NV:₹{item.nonVegPrice}</span>
                  </div>
                ) : (
                  <span className="text-sm font-black text-gray-900 group-hover:text-[#F57C00]">₹{item.price}</span>
                )}
              </div>
              <h3 className="font-bold text-gray-800 text-sm md:text-base mb-1 line-clamp-2 flex-1">{item.name}</h3>
              <div className="mt-3 flex justify-end">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-[#F57C00] group-hover:text-white transition-all shadow-sm">
                  <Plus size={18} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="w-80 md:w-96 bg-white border-l shadow-2xl flex flex-col shrink-0 z-10">
        {/* Table indicator for Dine In */}
        {orderType === 'DINE_IN' && selectedTableId && (
          <div className="px-4 py-2 bg-[#F57C00] text-white text-center">
            <span className="font-black text-sm">
              {tables.find(t => t.id === selectedTableId)?.name || 'Table'} - Active Order
            </span>
          </div>
        )}
        
        <div className="flex p-3 bg-gray-100 border-b gap-1">
          <OrderTypeTab active={orderType === 'DINE_IN'} onClick={() => setOrderType('DINE_IN')} label="Dine In" icon={<UtensilsCrossed size={16} />} />
          <OrderTypeTab active={orderType === 'DELIVERY'} onClick={() => setOrderType('DELIVERY')} label="Delivery" icon={<Truck size={16} />} />
          <OrderTypeTab active={orderType === 'PICK_UP'} onClick={() => setOrderType('PICK_UP')} label="Pick Up" icon={<Package size={16} />} />
        </div>

        <div className="p-4 border-b bg-white">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Customer Name / Order Note"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-[#F57C00] outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          {currentCart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-40">
              <ShoppingBag size={64} strokeWidth={1} className="mb-3" />
              <p className="font-bold text-lg">No Items Added</p>
              {orderType === 'DINE_IN' && !selectedTableId && (
                <p className="text-sm mt-2">Select a table to start</p>
              )}
            </div>
          ) : (
            currentCart.map(item => (
              <div key={item.id} className="flex gap-3 items-center group animate-in fade-in slide-in-from-right-2 duration-200">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`shrink-0 w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <h4 className="font-bold text-gray-800 truncate text-sm">
                      {item.name}
                      {item.selectedVegChoice && (
                        <span className={`ml-1 text-[10px] font-black ${item.selectedVegChoice === 'VEG' ? 'text-green-600' : 'text-red-600'}`}>
                          ({item.selectedVegChoice === 'VEG' ? 'V' : 'NV'})
                        </span>
                      )}
                    </h4>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium">₹{item.price} per unit</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 border rounded-xl p-1 shadow-sm">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-[#F57C00] text-gray-400"><Minus size={14} /></button>
                  <span className="w-8 text-center font-black text-sm text-gray-900">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-[#F57C00] text-gray-400"><Plus size={14} /></button>
                </div>
                <div className="w-16 text-right font-black text-sm text-gray-900">₹{item.price * item.quantity}</div>
                <button onClick={() => removeFromCart(item.id)} className="text-gray-200 hover:text-black transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-5 border-t bg-gray-50 space-y-5 rounded-t-3xl shadow-top">
          <div className="space-y-1.5 text-xs font-bold uppercase tracking-wider">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Tax (GST ${(taxRate * 100).toFixed(0)}%)</span>
              <span>₹{tax.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-2xl font-black text-gray-900 border-t-2 border-dashed border-gray-200 pt-3 mt-3">
              <span>Total</span>
              <span className="text-[#F57C00]">₹{total.toFixed(0)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <PaymentTab active={paymentMode === 'CASH'} onClick={() => setPaymentMode('CASH')} icon={<Banknote size={18} />} label="Cash" />
            <PaymentTab active={paymentMode === 'CARD'} onClick={() => setPaymentMode('CARD')} icon={<CreditCard size={18} />} label="Card" />
            <PaymentTab active={paymentMode === 'UPI'} onClick={() => setPaymentMode('UPI')} icon={<Smartphone size={18} />} label="UPI" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handlePlaceOrder(false)}
              className="flex items-center justify-center gap-2 bg-[#262626] text-white py-4 rounded-2xl font-black hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200"
            >
              <ShoppingCart size={20} /> Checkout
            </button>
            <button 
              onClick={() => handlePlaceOrder(true)}
              className="flex items-center justify-center gap-2 bg-[#F57C00] text-white py-4 rounded-2xl font-black hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-orange-200"
            >
              <CheckCircle size={20} /> Print & Bill
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

const OrderTypeTab: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-1 rounded-xl text-xs font-black transition-all ${active ? 'bg-white text-[#F57C00] shadow-md border-b-2 border-[#F57C00]' : 'text-gray-500 hover:text-gray-700'}`}>{icon} {label}</button>
);

const PaymentTab: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button onClick={onClick} className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl border-2 transition-all ${active ? 'border-[#F57C00] bg-orange-50 text-[#F57C00] shadow-sm' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>{icon}<span className="text-[10px] font-black uppercase tracking-widest">{label}</span></button>
);

export default BillingScreen;
