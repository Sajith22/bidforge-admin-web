// src/pages/Dashboard.tsx
// Restyled to match BidForge's dark theme (#0F172A / #1E293B / blue accents)
// — same color language as the polished screens in the Flutter app.

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { api } from '../lib/api';
import type { Product } from '../lib/types';

const statusStyles: Record<Product['status'], string> = {
  live: 'bg-green-500/15 text-green-400 border-green-500/40',
  upcoming: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
  ended: 'bg-slate-500/15 text-slate-400 border-slate-500/40',
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await api.get<Product[]>('/products');
      setProducts(res.data);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const togglePublish = async (product: Product) => {
    await api.patch(`/products/${product.id}/publish`, {
      isPublished: !product.isPublished,
    });
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, isPublished: !p.isPublished } : p,
      ),
    );
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product permanently?')) return;
    await api.delete(`/products/${id}`);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const liveCount = products.filter((p) => p.status === 'live').length;
  const upcomingCount = products.filter((p) => p.status === 'upcoming').length;
  const endedCount = products.filter((p) => p.status === 'ended').length;

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Header */}
      <header className="bg-[#1E293B] border-b border-slate-700 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-white">
            B
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">BidForge Admin</h1>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/products/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            + Add Product
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-red-400 hover:text-red-300 px-2 transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="p-8">
        {/* Stats bar */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
          <StatChip label="Total" value={products.length} color="text-blue-400 border-blue-500/40 bg-blue-500/10" />
          <StatChip label="Live" value={liveCount} color="text-green-400 border-green-500/40 bg-green-500/10" />
          <StatChip label="Upcoming" value={upcomingCount} color="text-amber-400 border-amber-500/40 bg-amber-500/10" />
          <StatChip label="Ended" value={endedCount} color="text-slate-400 border-slate-500/40 bg-slate-500/10" />
        </div>

        {loading && <p className="text-slate-400">Loading products...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && products.length === 0 && (
          <p className="text-slate-400">No products yet. Create your first one.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#1E293B] rounded-xl border border-slate-700 p-5 space-y-3 hover:border-slate-600 transition"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-white">{product.title}</h3>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full border ${statusStyles[product.status]}`}
                >
                  {product.status.toUpperCase()}
                </span>
              </div>

              <p className="text-sm text-slate-400 line-clamp-2">
                {product.description}
              </p>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Current Bid</span>
                <span className="font-bold text-blue-400">
                  ${product.currentHighestBid.toFixed(2)}
                </span>
              </div>

              {product.winnerName && (
                <div className="text-sm bg-green-500/10 text-green-400 rounded-lg px-3 py-2 border border-green-500/20">
                  🏆 {product.winnerName} — ${product.winningBid?.toFixed(2)}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => togglePublish(product)}
                  className={`flex-1 text-xs font-semibold py-2 rounded-lg transition ${
                    product.isPublished
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-slate-700/50 text-slate-400 border border-slate-600'
                  }`}
                >
                  {product.isPublished ? 'Published' : 'Unpublished'}
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="text-xs font-semibold text-red-400 px-3 rounded-lg hover:bg-red-500/10 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function StatChip({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border whitespace-nowrap ${color}`}>
      <span className="font-bold text-lg">{value}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}
