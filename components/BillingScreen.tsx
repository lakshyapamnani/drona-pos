
import React, { useState, useMemo } from 'react';
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
  User
} from 'lucide-react';
import { Category, MenuItem, CartItem, OrderType, PaymentMode, Order, RestaurantInfo } from '../types';

interface BillingScreenProps {
  categories: Category[];
  menuItems: MenuItem[];
  taxRate: number;
  restaurantInfo: RestaurantInfo;
  onCreateOrder: (order: Order) => void;
}

const BillingScreen: React.FC<BillingScreenProps> = ({ categories, menuItems, taxRate, restaurantInfo, onCreateOrder }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id || '');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('DINE_IN');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('CASH');
  const [customerName, setCustomerName] = useState('');

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => item.categoryId === selectedCategoryId);
  }, [selectedCategoryId, menuItems]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
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
    if (cart.length === 0) {
      alert("Please add items to the cart first.");
      return;
    }

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      billNo: `INV-${Date.now().toString().substr(-6)}`,
      customerName: (customerName || "").trim(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: [...cart],
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
    setCart([]);
    setCustomerName('');
  };

  return (
    <div className="flex h-full overflow-hidden">
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
              onClick={() => addToCart(item)}
              className="bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-[#F57C00] hover:shadow-lg transition-all p-4 text-left relative group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`w-4 h-4 rounded-full border-2 ${item.isVeg ? 'border-green-600 p-[2px]' : 'border-red-600 p-[2px]'}`}>
                  <div className={`w-full h-full rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                </span>
                <span className="text-sm font-black text-gray-900 group-hover:text-[#F57C00]">₹{item.price}</span>
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
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-40">
              <ShoppingBag size={64} strokeWidth={1} className="mb-3" />
              <p className="font-bold text-lg">No Items Added</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-3 items-center group animate-in fade-in slide-in-from-right-2 duration-200">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`shrink-0 w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <h4 className="font-bold text-gray-800 truncate text-sm">{item.name}</h4>
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
  );
};

const OrderTypeTab: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-1 rounded-xl text-xs font-black transition-all ${active ? 'bg-white text-[#F57C00] shadow-md border-b-2 border-[#F57C00]' : 'text-gray-500 hover:text-gray-700'}`}>{icon} {label}</button>
);

const PaymentTab: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button onClick={onClick} className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl border-2 transition-all ${active ? 'border-[#F57C00] bg-orange-50 text-[#F57C00] shadow-sm' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>{icon}<span className="text-[10px] font-black uppercase tracking-widest">{label}</span></button>
);

export default BillingScreen;
