
import React, { useState } from 'react';
import { 
  Calendar, 
  Filter, 
  FileSpreadsheet, 
  FileText 
} from 'lucide-react';
import { Order } from '../types';

interface ReportsProps {
  orders: Order[];
}

const Reports: React.FC<ReportsProps> = ({ orders }) => {
  const [filterMode, setFilterMode] = useState('All');

  const exportToExcel = () => {
    if (orders.length === 0) {
      alert("No data available for export.");
      return;
    }

    const headers = [
      "Order ID", "Date", "Time", "Items", "Subtotal", "Tax", "Total", "Payment Mode", "Type", "Status"
    ];

    const rows = orders.map(order => [
      order.billNo,
      order.date,
      order.time,
      order.items.map(i => `${i.name} (x${i.quantity})`).join('; '),
      order.subtotal.toFixed(2),
      order.tax.toFixed(2),
      order.total.toFixed(2),
      order.paymentMode,
      order.orderType,
      order.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `DRONA_POS_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (orders.length === 0) {
      alert("No data available for print.");
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalTax = orders.reduce((sum, order) => sum + order.tax, 0);

    const html = `
      <html>
        <head>
          <title>DRONA POS - Sales Report</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #F57C00; padding-bottom: 20px; margin-bottom: 30px; }
            h1 { color: #F57C00; margin: 0; font-size: 28px; }
            .meta { font-size: 14px; color: #666; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #eee; font-size: 13px; }
            th { background-color: #fafafa; font-weight: bold; text-transform: uppercase; color: #555; }
            .total-row { background-color: #fff9f2; font-weight: bold; }
            .summary-box { margin-top: 40px; float: right; width: 300px; padding: 20px; border: 1px solid #eee; border-radius: 10px; background: #fff; }
            .summary-item { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .summary-total { font-size: 18px; color: #F57C00; border-top: 2px solid #F57C00; padding-top: 10px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>DRONA POS - Sales Report</h1>
            <div class="meta">Generated on: ${new Date().toLocaleString()}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Bill No</th>
                <th>Date</th>
                <th>Items</th>
                <th>Payment</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(o => `
                <tr>
                  <td>${o.billNo}</td>
                  <td>${o.date} ${o.time}</td>
                  <td>${o.items.length} items</td>
                  <td>${o.paymentMode}</td>
                  <td>₹${o.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="summary-box">
            <div class="summary-item"><span>Total Orders:</span> <span>${orders.length}</span></div>
            <div class="summary-item"><span>Total Tax:</span> <span>₹${totalTax.toFixed(2)}</span></div>
            <div class="summary-total summary-item"><span>Net Revenue:</span> <span>₹${totalRevenue.toFixed(2)}</span></div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="h-full bg-gray-50 p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Reports</h1>
          <p className="text-sm text-gray-600 font-medium">Track and export your cafe performance data</p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-black hover:bg-green-700 transition-colors shadow-sm active:scale-95"
           >
             <FileSpreadsheet size={18} /> Export Excel
           </button>
           <button 
            onClick={exportToPDF}
            className="flex items-center gap-2 bg-[#F57C00] text-white px-4 py-2 rounded-lg font-black hover:bg-orange-600 transition-colors shadow-sm active:scale-95"
           >
             <FileText size={18} /> Print PDF
           </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
           <div className="space-y-1">
             <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Start Date</label>
             <div className="relative">
               <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
               <input type="date" className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-black focus:ring-2 focus:ring-orange-500 outline-none shadow-inner" />
             </div>
           </div>
           <div className="space-y-1">
             <label className="text-xs font-black text-gray-700 uppercase tracking-wider">End Date</label>
             <div className="relative">
               <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
               <input type="date" className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-black focus:ring-2 focus:ring-orange-500 outline-none shadow-inner" />
             </div>
           </div>
           <div className="space-y-1">
             <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Payment Mode</label>
             <select 
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-black focus:ring-2 focus:ring-orange-500 outline-none shadow-inner appearance-none cursor-pointer"
             >
               <option>All Modes</option>
               <option>Cash</option>
               <option>Card</option>
               <option>UPI</option>
             </select>
           </div>
           <div className="flex items-end">
              <button className="w-full flex items-center justify-center gap-2 bg-[#262626] text-white py-2.5 rounded-lg font-black hover:bg-black transition-all active:scale-95">
                <Filter size={18} /> Apply Filter
              </button>
           </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 font-black text-gray-700 uppercase tracking-widest text-[10px]">Metric</th>
                <th className="px-6 py-4 font-black text-gray-700 uppercase tracking-widest text-[10px]">Performance</th>
                <th className="px-6 py-4 font-black text-gray-700 uppercase tracking-widest text-[10px]">Target</th>
                <th className="px-6 py-4 font-black text-gray-700 uppercase tracking-widest text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <ReportRow label="Gross Sales" value={`₹${orders.reduce((a,b) => a+b.total, 0).toLocaleString()}`} target="₹5,00,000" trend="On Track" />
              <ReportRow label="Net Profit (Est. 40%)" value={`₹${(orders.reduce((a,b) => a+b.total, 0) * 0.4).toLocaleString()}`} target="₹2,00,000" trend="Above Average" />
              <ReportRow label="Total Orders" value={orders.length.toString()} target="1,500" trend="Growing" />
              <ReportRow label="Avg. Order Value" value={`₹${(orders.length > 0 ? orders.reduce((a,b) => a+b.total, 0) / orders.length : 0).toFixed(0)}`} target="₹350" trend="Excellent" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ReportRow: React.FC<{ label: string; value: string; target: string; trend: string }> = ({ label, value, target, trend }) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4 font-black text-gray-900">{label}</td>
    <td className="px-6 py-4 font-black text-[#F57C00] text-lg">{value}</td>
    <td className="px-6 py-4 text-gray-500 font-bold">{target}</td>
    <td className="px-6 py-4">
      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
        trend.includes('Track') || trend.includes('Excellent') || trend.includes('Growing') ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
      }`}>
        {trend}
      </span>
    </td>
  </tr>
);

export default Reports;
