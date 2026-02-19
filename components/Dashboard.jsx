import { useState } from 'react'
import Navbar from './Navbar'
import SummaryCards from './SummaryCards'
import Charts from './Charts'
import TransactionList from './TransactionList'
import TransactionModal from './TransactionModal'
import { useTransactions } from '../hooks/useTransactions'
import './Dashboard.css'

export default function Dashboard() {
  const {
    transactions,
    income, expense, balance,
    addTransaction, updateTransaction, deleteTransaction,
  } = useTransactions()

  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)

  const openAdd = () => { setEditData(null); setModalOpen(true) }
  const openEdit = (t) => { setEditData(t); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditData(null) }

  const handleSave = (form) => {
    if (editData) updateTransaction(editData.id, form)
    else addTransaction(form)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) deleteTransaction(id)
  }

  return (
    <div className="dashboard">
      <Navbar />

      <main className="main-content">
        <div className="content-wrap">
          <div className="page-header">
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="page-sub">Your financial summary</p>
            </div>
            <button className="btn btn-primary fab-btn" onClick={openAdd}>
              + New Transaction
            </button>
          </div>

          <SummaryCards balance={balance} income={income} expense={expense} />
          <Charts transactions={transactions} />
          <TransactionList
            transactions={transactions}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
          <footer className="dashboard-footer">
            <p><strong>FinHelp</strong> &mdash; Your secure, private finance tracker.</p>
            <p>Built to help you manage deposits and expenses with ease. Data is synced securely to the cloud.</p>
          </footer>
        </div>
      </main>

      <TransactionModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        editData={editData}
      />

      <button className="fab" onClick={openAdd} title="Add Transaction">+</button>
    </div>
  )
}
