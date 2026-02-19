import { useState } from 'react'
import { formatCurrency, formatDate, CATEGORIES, CATEGORY_ICONS } from '../utils/formatters'
import './TransactionList.css'

export default function TransactionList({ transactions, onEdit, onDelete }) {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')

  const filtered = transactions
    .filter(t => {
      const q = search.toLowerCase()
      const matchSearch = !q ||
        t.title?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q) ||
        String(t.amount).includes(q)
      const matchType = filterType === 'all' || t.type === filterType
      const matchCat = filterCategory === 'all' || t.category === filterCategory
      return matchSearch && matchType && matchCat
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date)
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date)
      if (sortBy === 'amount-desc') return Number(b.amount) - Number(a.amount)
      if (sortBy === 'amount-asc') return Number(a.amount) - Number(b.amount)
      return 0
    })

  return (
    <div className="transaction-section">
      <div className="section-header">
        <h2 className="section-title">Transactions</h2>
        <span className="tx-count">{filtered.length} entries</span>
      </div>

      <div className="filters-bar">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search transactions…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <div className="filter-chips">
          {['all', 'income', 'expense'].map(t => (
            <button
              key={t}
              className={`chip ${filterType === t ? 'chip-active' : ''}`}
              onClick={() => setFilterType(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="tx-empty">
          {transactions.length === 0
            ? '✦ No transactions yet — add your first one!'
            : 'No transactions match your search.'}
        </div>
      ) : (
        <div className="tx-list">
          {filtered.map(t => (
            <div key={t.id} className={`tx-card ${t.type}`}>
              <div className="tx-icon">
                {CATEGORY_ICONS[t.category] || '📦'}
              </div>
              <div className="tx-info">
                <div className="tx-title">{t.title}</div>
                <div className="tx-meta">
                  <span className={`tx-badge ${t.type}`}>{t.category}</span>
                  <span className="tx-date">{formatDate(t.date)}</span>
                  {t.note && <span className="tx-note" title={t.note}>📝</span>}
                </div>
              </div>
              <div className={`tx-amount ${t.type}`}>
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </div>
              <div className="tx-actions">
                <button className="tx-action edit" onClick={() => onEdit(t)} title="Edit">✎</button>
                <button className="tx-action delete" onClick={() => onDelete(t.id)} title="Delete">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
