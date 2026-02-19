import { useState, useEffect } from 'react'
import { CATEGORIES } from '../utils/formatters'
import './TransactionModal.css'

const defaultForm = {
  title: '',
  amount: '',
  type: 'expense',
  category: 'Food & Dining',
  date: new Date().toISOString().split('T')[0],
  note: '',
}

export default function TransactionModal({ isOpen, onClose, onSave, editData }) {
  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || '',
        amount: editData.amount || '',
        type: editData.type || 'expense',
        category: editData.category || 'Food & Dining',
        date: editData.date || new Date().toISOString().split('T')[0],
        note: editData.note || '',
      })
    } else {
      setForm(defaultForm)
    }
    setError('')
  }, [editData, isOpen])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) return setError('Please enter a title.')
    if (!form.amount || Number(form.amount) <= 0) return setError('Please enter a valid amount.')
    onSave(form)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{editData ? 'Edit Transaction' : 'New Transaction'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="type-toggle">
          <button
            type="button"
            className={`type-btn expense-btn ${form.type === 'expense' ? 'active' : ''}`}
            onClick={() => setForm(f => ({ ...f, type: 'expense' }))}
          >
            ↓ Expense
          </button>
          <button
            type="button"
            className={`type-btn income-btn ${form.type === 'income' ? 'active' : ''}`}
            onClick={() => setForm(f => ({ ...f, type: 'income' }))}
          >
            ↑ Income
          </button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Grocery run, Salary…"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Amount (USD)</label>
              <input
                type="number"
                name="amount"
                placeholder="0.00"
                value={form.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Note <span className="optional">(optional)</span></label>
            <textarea
              name="note"
              placeholder="Any extra details…"
              value={form.note}
              onChange={handleChange}
              rows="2"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {editData ? 'Update' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
