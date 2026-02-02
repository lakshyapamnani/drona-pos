
import React, { useMemo, useState } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  Eye, 
  Printer, 
  PackageCheck, 
  FileText, 
  CheckCircle2, 
  User, 
  CalendarDays, 
  History,
  Search,
  Filter,
  X,
  MapPin,
  Phone,
  CreditCard,
  Banknote,
  Smartphone,
  Trash2
} from 'lucide-react';
import { Order, OrderStatus, RestaurantInfo } from '../types';

interface OrdersListProps {
  title: string;
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onDeleteOrder: (id: string) => void;
  restaurantInfo: RestaurantInfo;
  taxRate: number;
}

const OrdersList: React.FC<OrdersListProps> = ({ title, orders, onUpdateStatus, onDeleteOrder, restaurantInfo, taxRate }) => {
  const isAllBillsView = title === "All Bills";
  const [activeTab, setActiveTab] = useState<'TODAY' | 'ALL'>('TODAY');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const todayDate = new Date().toLocaleDateString();

  const { todayOrders, allOrders } = useMemo(() => {
    return {
      todayOrders: orders.filter(o => o.date === todayDate),
      allOrders: orders
    };
  }, [orders, todayDate]);

  const displayedOrders = useMemo(() => {
    const list = isAllBillsView 
      ? (activeTab === 'TODAY' ? todayOrders : allOrders) 
      : orders;
    
    if (!searchQuery.trim()) return list;
    
    return list.filter(o => 
      o.billNo.toLowerCase().includes(searchQuery.toLowerCase()) || 
      o.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [isAllBillsView, activeTab, todayOrders, allOrders, orders, searchQuery]);

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
          <div class="center bold">DUPLICATE BILL</div>
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

  const exportToPDF = (data: Order[], subTitle: string) => {
    if (data.length === 0) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>${title} - ${subTitle}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h1 { color: #F57C00; margin-bottom: 5px; }
            h2 { color: #333; margin-top: 0; font-size: 18px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 11px; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>DRONA POS</h1>
          <h2>${title} (${subTitle})</h2>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>Bill No</th>
                <th>Customer</th>
                <th>Time</th>
                <th>Items</th>
                <th>Type</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(o => `
                <tr>
                  <td>${o.billNo}</td>
                  <td>${o.customerName || '-'}</td>
                  <td>${o.time}</td>
                  <td>${o.items.map(i => i.name + ' x ' + i.quantity).join(', ')}</td>
                  <td>${o.orderType}</td>
                  <td>₹${o.total.toFixed(2)}</td>
                  <td>${o.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const renderTable = (data: Order[], emptyMessage: string = "No orders found.") => (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Details</th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Items</th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-20 text-center text-gray-400">
                <div className="flex flex-col items-center gap-2">
                  <PackageCheck size={48} className="opacity-20" />
                  <p className="font-bold text-lg">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      {order.status === 'COMPLETED' && <CheckCircle2 size={16} className="text-green-500" />}
                      <span className="font-bold text-gray-800">{order.billNo}</span>
                    </div>
                    {order.customerName && (
                      <div className="flex items-center gap-1 text-[10px] text-gray-500 font-black uppercase mt-0.5">
                        <User size={10} /> {order.customerName}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm font-semibold">{order.time}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    {order.items.slice(0, 2).map((it, idx) => (
                      <span key={idx} className="text-xs text-gray-600 font-medium">{it.name} x {it.quantity}</span>
                    ))}
                    {order.items.length > 2 && <span className="text-[10px] text-gray-400 font-bold">+{order.items.length - 2} more...</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex flex-col gap-1">
                     <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border w-fit ${
                       order.orderType === 'DINE_IN' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                       order.orderType === 'DELIVERY' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                       'bg-gray-50 text-gray-700 border-gray-200'
                     }`}>
                       {order.orderType.replace('_', ' ')}
                     </span>
                     {order.orderType === 'DINE_IN' && order.tableName && (
                       <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border w-fit bg-purple-50 text-purple-700 border-purple-200">
                         {order.tableName}
                       </span>
                     )}
                   </div>
                </td>
                <td className="px-6 py-4 font-black text-gray-900">₹{order.total.toFixed(0)}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 justify-center">
                    <ActionButton 
                      icon={<Eye size={16} />} 
                      color="text-gray-400 hover:text-blue-500" 
                      tooltip="View Details" 
                      onClick={() => setSelectedOrder(order)}
                    />
                    <ActionButton 
                      icon={<Printer size={16} />} 
                      color="text-gray-400 hover:text-[#F57C00]" 
                      tooltip="Re-print Bill" 
                      onClick={() => printReceipt(order)}
                    />
                    
                    {(order.status === 'PLACED' || order.status === 'READY' || order.status === 'PREPARING') && (
                      <ActionButton 
                        icon={<PackageCheck size={16} />} 
                        color="text-gray-400 hover:text-green-500" 
                        tooltip="Mark as Completed"
                        onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
                      />
                    )}
                    {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                      <ActionButton 
                        icon={<XCircle size={16} />} 
                        color="text-gray-400 hover:text-black" 
                        tooltip="Cancel Order"
                        onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
                      />
                    )}
                    <ActionButton 
                      icon={<Trash2 size={16} />} 
                      color="text-gray-400 hover:text-red-500" 
                      tooltip="Delete Order" 
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete order ${order.billNo}?`)) {
                          onDeleteOrder(order.id);
                        }
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
      {/* Dynamic Header */}
      <div className="p-6 pb-2 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
            {isAllBillsView ? 'Comprehensive Transaction History' : 'Status-specific records'}
          </p>
        </div>
        <div className="flex gap-3">
           <div className="relative">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
              type="text" 
              placeholder="Search bills..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#F57C00] outline-none w-48 transition-all focus:w-64"
             />
           </div>
           <button 
            onClick={() => exportToPDF(displayedOrders, isAllBillsView ? (activeTab === 'TODAY' ? "Today" : "History") : title)}
            className="bg-[#F57C00] text-white px-4 py-2 rounded-xl text-sm font-black hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg shadow-orange-100 active:scale-95"
           >
             <FileText size={18} /> Export PDF
           </button>
        </div>
      </div>

      {/* Tabs for All Bills */}
      {isAllBillsView && (
        <div className="px-6 flex border-b bg-gray-50/50">
          <TabButton 
            active={activeTab === 'TODAY'} 
            onClick={() => setActiveTab('TODAY')} 
            label="Today's Orders" 
            count={todayOrders.length}
            icon={<CalendarDays size={16} />}
          />
          <TabButton 
            active={activeTab === 'ALL'} 
            onClick={() => setActiveTab('ALL')} 
            label="All Orders" 
            count={allOrders.length}
            icon={<History size={16} />}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          {renderTable(displayedOrders, searchQuery ? "No bills match your search." : (activeTab === 'TODAY' ? "No orders placed today." : "No orders found in history."))}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border-2 border-gray-100 flex flex-col max-h-[90vh]">
            <div className="bg-gray-50 p-6 border-b-2 border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-gray-900">{selectedOrder.billNo}</h3>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{selectedOrder.date} • {selectedOrder.time}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-900 hover:text-[#F57C00] transition-colors bg-white p-2 rounded-full shadow-sm"><X size={24} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <User size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Customer</span>
                  </div>
                  <p className="font-bold text-gray-800">{selectedOrder.customerName || "Walk-in Customer"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <MapPin size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Type</span>
                  </div>
                  <p className="font-bold text-gray-800">{selectedOrder.orderType.replace('_', ' ')}</p>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-3 border border-gray-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold">₹{item.price} x {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-black text-gray-900">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-900 text-white p-6 rounded-3xl space-y-3">
                <div className="flex justify-between text-xs text-gray-400 font-bold uppercase">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 font-bold uppercase">
                  <span>Tax (${(taxRate * 100).toFixed(0)}%)</span>
                  <span>₹{selectedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-800 pt-3 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-black text-[#F57C00] uppercase tracking-widest">Total Amount</span>
                    <h3 className="text-2xl font-black">₹{selectedOrder.total.toFixed(0)}</h3>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end text-xs font-black uppercase tracking-widest mb-1">
                      {selectedOrder.paymentMode === 'CASH' && <Banknote size={14} />}
                      {selectedOrder.paymentMode === 'CARD' && <CreditCard size={14} />}
                      {selectedOrder.paymentMode === 'UPI' && <Smartphone size={14} />}
                      {selectedOrder.paymentMode}
                    </div>
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t flex gap-3">
              <button 
                onClick={() => printReceipt(selectedOrder)}
                className="flex-1 bg-white border-2 border-gray-200 text-gray-900 py-4 rounded-2xl font-black hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Printer size={20} /> Re-print Receipt
              </button>
              {selectedOrder.status !== 'COMPLETED' && selectedOrder.status !== 'CANCELLED' && (
                <button 
                  onClick={() => {
                    onUpdateStatus(selectedOrder.id, 'COMPLETED');
                    setSelectedOrder(null);
                  }}
                  className="flex-1 bg-[#F57C00] text-white py-4 rounded-2xl font-black hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-100"
                >
                  <PackageCheck size={20} /> Complete Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; count: number; icon: React.ReactNode }> = ({ active, onClick, label, count, icon }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-4 relative ${
      active ? 'border-[#F57C00] text-[#F57C00] bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
  >
    {icon}
    {label}
    <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${active ? 'bg-orange-100 text-[#F57C00]' : 'bg-gray-100 text-gray-500'}`}>
      {count}
    </span>
  </button>
);

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const styles = {
    PLACED: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    PREPARING: 'bg-blue-100 text-blue-700 border-blue-200',
    READY: 'bg-green-100 text-green-700 border-green-200',
    COMPLETED: 'bg-green-100 text-green-700 border-green-200',
    CANCELLED: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider border uppercase ${styles[status]}`}>
      {status}
    </span>
  );
};

const ActionButton: React.FC<{ icon: React.ReactNode; color: string; tooltip: string; onClick?: () => void }> = ({ icon, color, tooltip, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-2 rounded-xl border border-gray-100 transition-all ${color} hover:shadow-md hover:bg-white active:scale-90`}
    title={tooltip}
  >
    {icon}
  </button>
);

export default OrdersList;
