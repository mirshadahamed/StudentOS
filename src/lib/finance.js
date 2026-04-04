export function getDateRange(searchParams) {
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const range = {};

  if (from || to) {
    range.date = {};
    if (from) {
      range.date.$gte = new Date(from);
    }
    if (to) {
      range.date.$lte = new Date(to);
    }
  }

  return range;
}

export function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function buildFinanceSummary(transactions) {
  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);
  const savings = transactions
    .filter((item) => item.type === "savings")
    .reduce((sum, item) => sum + item.amount, 0);

  return {
    income,
    expenses,
    savings,
    balance: income - expenses - savings,
    net: income - expenses,
    count: transactions.length,
  };
}
