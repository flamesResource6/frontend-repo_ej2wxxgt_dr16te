import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [cart, setCart] = useState([])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async (opts = {}) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      const q = opts.q ?? query
      const c = opts.category ?? category
      if (q) params.set('q', q)
      if (c) params.set('category', c)
      const res = await fetch(`${API_BASE}/api/products?${params.toString()}`)
      const data = await res.json()
      setProducts(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (p) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.title === p.title)
      if (exists) {
        return prev.map((i) => i.title === p.title ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...p, quantity: 1 }]
    })
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gioielleria</h1>
          <div className="flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca anelli, collane..."
              className="px-3 py-2 rounded-md border w-48 sm:w-72"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 rounded-md border"
            >
              <option value="">Tutte</option>
              <option value="Anelli">Anelli</option>
              <option value="Collane">Collane</option>
              <option value="Bracciali">Bracciali</option>
              <option value="Orecchini">Orecchini</option>
            </select>
            <button
              onClick={() => fetchProducts({ q: query, category })}
              className="px-4 py-2 bg-black text-white rounded-md"
            >
              Cerca
            </button>
            <a href="/test" className="ml-2 text-sm underline text-gray-600">Test</a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <section>
          {loading ? (
            <p className="text-gray-600">Caricamento prodotti...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-600">Nessun prodotto trovato.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products.map((p, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400">Nessuna immagine</span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{p.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 min-h-[2.5rem]">{p.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold">€ {p.price?.toFixed ? p.price.toFixed(2) : p.price}</span>
                      <button onClick={() => addToCart(p)} className="px-3 py-1.5 bg-black text-white rounded-md text-sm">Aggiungi</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="bg-white rounded-xl shadow-sm border p-4 h-fit sticky top-24">
          <h2 className="text-lg font-semibold mb-3">Carrello</h2>
          {cart.length === 0 ? (
            <p className="text-gray-600">Il carrello è vuoto.</p>
          ) : (
            <div className="space-y-3">
              {cart.map((i, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium line-clamp-1">{i.title}</p>
                    <p className="text-sm text-gray-500">x{i.quantity}</p>
                  </div>
                  <p className="font-semibold">€ {(i.price * i.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t pt-3 flex items-center justify-between">
                <span className="font-semibold">Totale</span>
                <span className="font-bold">€ {total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => alert('Checkout di esempio. Implementeremo il pagamento più tardi.')}
                className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md"
              >
                Procedi al checkout
              </button>
            </div>
          )}
        </aside>
      </main>

      <footer className="py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Gioielleria. Tutti i diritti riservati.
      </footer>
    </div>
  )
}

export default App
