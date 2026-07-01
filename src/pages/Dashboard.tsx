import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { api } from '../lib/api';
import type { Product } from '../lib/types';

const statusStyles: Record<Product['status'], string> = {
  live: 'bg-green-100 text-green-700 border-green-300',
  upcoming: 'bg-amber-100 text-amber-700 border-amber-300',
  ended: 'bg-gray-100 text-gray-600 border-gray-300',
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    void (async () => {
      try {
        const res = await api.get<Product[]>('/products');
        if (!ignore) setProducts(res.data);
      } catch {
        if (!ignore) setError('Failed to load products');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">BidForge Admin</h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/products/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
          >
            + Add Product
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline px-2"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="p-8">
        {loading && <p className="text-gray-500">Loading products...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && products.length === 0 && (
          <p className="text-gray-500">No products yet. Create your first one.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border p-5 shadow-sm space-y-3"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800">{product.title}</h3>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full border ${statusStyles[product.status]}`}
                >
                  {product.status.toUpperCase()}
                </span>
              </div>

              <p className="text-sm text-gray-500 line-clamp-2">
                {product.description}
              </p>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Current Bid</span>
                <span className="font-bold text-blue-600">
                  ${product.currentHighestBid.toFixed(2)}
                </span>
              </div>

              {product.winnerName && (
                <div className="text-sm bg-green-50 text-green-700 rounded-lg px-3 py-2">
                  🏆 {product.winnerName} — ${product.winningBid?.toFixed(2)}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => togglePublish(product)}
                  className={`flex-1 text-xs font-semibold py-2 rounded-lg ${
                    product.isPublished
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {product.isPublished ? 'Published' : 'Unpublished'}
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="text-xs font-semibold text-red-600 px-3 rounded-lg hover:bg-red-50"
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
