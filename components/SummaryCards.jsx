import { formatCurrency } from '../utils/formatters'
import './SummaryCards.css'

export default function SummaryCards({ balance, income, expense }) {
  const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0

  return (
    <div className="summary-grid">
      <div className="summary-card balance-card">
        <div className="card-label">Net Balance</div>
        <div className="card-amount balance-amt">{formatCurrency(balance)}</div>
        <div className="card-sub">
          {income === 0
            ? 'Add transactions to get started'
            : savingsRate >= 0
              ? `Remains ${savingsRate}% of net worth`
              : `Overspent by ${Math.abs(savingsRate)}%`}
        </div>
        <div className="card-bar">
          <div
            className="card-bar-fill"
            style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }}
          />
        </div>
      </div>

      <div className="summary-card income-card">
        <div className="card-icon income-icon">↑</div>
        <div className="card-label">Total Income</div>
        <div className="card-amount income-amt">{formatCurrency(income)}</div>

      </div>

      <div className="summary-card expense-card">
        <div className="card-icon expense-icon">↓</div>
        <div className="card-label">Total Spendings</div>
        <div className="card-amount expense-amt">{formatCurrency(expense)}</div>

      </div>
    </div>
  )
}
