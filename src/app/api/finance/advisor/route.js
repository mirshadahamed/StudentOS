import connectMongoDB from "../../../libs/mongodb";
import Saving from "../../../models/Saving";
import Split from "../../../models/Split";
import Transaction from "../../../models/Transaction";

export const runtime = "nodejs";

function safeNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function summarizeCategories(transactions) {
  const totals = {};

  for (const item of transactions) {
    const category = item.category || "Misc";
    totals[category] = (totals[category] || 0) + safeNumber(item.amount);
  }

  return Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([name, amount]) => ({
      name,
      amount,
    }));
}

function buildSnapshot({ incomes, expenses, savings, splits, requestedAmount }) {
  const totalIncome = incomes.reduce((sum, item) => sum + safeNumber(item.amount), 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + safeNumber(item.amount), 0);
  const totalSavings = savings.reduce((sum, item) => sum + safeNumber(item.current), 0);
  const totalSavingsTarget = savings.reduce((sum, item) => sum + safeNumber(item.target), 0);
  const totalSplitBills = splits.reduce((sum, item) => sum + safeNumber(item.total_amount), 0);
  const monthlySurplus = Math.max(totalIncome - totalExpenses, 0);
  const recommendedDeployableAmount = requestedAmount > 0 ? requestedAmount : monthlySurplus;
  const savingsProgress =
    totalSavingsTarget > 0 ? Math.round((totalSavings / totalSavingsTarget) * 100) : null;

  return {
    totalIncome,
    totalExpenses,
    totalSavings,
    totalSavingsTarget,
    totalSplitBills,
    monthlySurplus,
    requestedAmount,
    recommendedDeployableAmount,
    savingsProgress,
    recurringIncomeCount: incomes.filter((item) => Boolean(item.isRecurring)).length,
    recurringExpenseCount: expenses.filter((item) => Boolean(item.isRecurring)).length,
    topExpenseCategories: summarizeCategories(expenses),
    incomeSources: incomes.slice(0, 5).map((item) => ({
      title: item.title,
      amount: safeNumber(item.amount),
      category: item.category || "Misc",
    })),
    savingsGoals: savings.slice(0, 5).map((item) => ({
      name: item.name,
      current: safeNumber(item.current),
      target: safeNumber(item.target),
      deadline: item.deadline || "",
    })),
  };
}

function formatLkr(amount) {
  return `LKR ${Math.round(safeNumber(amount)).toLocaleString()}`;
}

function buildRuleBasedAdvice(snapshot) {
  const {
    totalIncome,
    totalExpenses,
    totalSavings,
    totalSavingsTarget,
    totalSplitBills,
    monthlySurplus,
    recommendedDeployableAmount,
    savingsProgress,
    topExpenseCategories,
  } = snapshot;

  const spendingPressure = totalIncome > 0 ? totalExpenses / totalIncome : 0;
  const highSpending = spendingPressure >= 0.8;
  const lowSavingsBuffer = totalSavings < Math.max(totalExpenses, recommendedDeployableAmount * 2);
  const topCategorySummary =
    topExpenseCategories[0]
      ? `${topExpenseCategories[0].name} is currently the biggest expense bucket at ${formatLkr(
          topExpenseCategories[0].amount
        )}.`
      : "There is not enough expense history yet to identify a dominant spending category.";

  let advisorNote = `You currently have about ${formatLkr(monthlySurplus)} in monthly surplus and ${formatLkr(
    recommendedDeployableAmount
  )} that looks deployable right now. ${topCategorySummary}`;

  if (highSpending) {
    advisorNote += " Cash flow looks tight, so keeping liquidity and a small emergency buffer should come before taking extra risk.";
  } else if (savingsProgress !== null && savingsProgress < 50) {
    advisorNote += " Savings goals are still under halfway funded, so balanced growth with flexibility makes more sense than locking everything up.";
  } else {
    advisorNote += " Your current profile can support a mix of safety, steady growth, and one higher-upside option.";
  }

  return {
    advisor_note: advisorNote,
    investment_options: [
      {
        id: "low-risk",
        category: "Low Risk",
        estimatedReturn: "Capital protection / short-term access",
        title: "Keep a cash buffer in a high-liquidity savings account",
        explanation: `Set aside roughly 1 to 2 months of core expenses first. With expenses near ${formatLkr(
          totalExpenses
        )} and split obligations around ${formatLkr(
          totalSplitBills
        )}, this gives you room for surprise bills without derailing classes or daily living.`,
      },
      {
        id: "balanced",
        category: "Balanced",
        estimatedReturn: "Moderate long-term growth",
        title: "Channel part of the surplus into a diversified Sri Lankan unit trust",
        explanation: `If you can consistently leave ${formatLkr(
          Math.max(monthlySurplus, recommendedDeployableAmount / 3)
        )} untouched each month, a balanced or income-focused unit trust can grow faster than cash while staying more practical than single-stock bets for a student budget.`,
      },
      {
        id: "growth",
        category: "Growth",
        estimatedReturn: "Higher upside / higher volatility",
        title: lowSavingsBuffer
          ? "Delay aggressive investing until your buffer is stronger"
          : "Use a small satellite allocation for growth assets",
        explanation: lowSavingsBuffer
          ? `Your current savings of ${formatLkr(totalSavings)} are still light relative to your commitments, so the growth move right now is to strengthen the base before taking equity-style risk. Once your buffer improves, you can carve out a smaller growth sleeve.`
          : `Because you already have some cushion${totalSavingsTarget > 0 ? ` and ${savingsProgress}% progress toward savings goals` : ""}, you could allocate a limited portion of the deployable amount to higher-growth assets such as selected CSE exposure or a more growth-oriented fund, while keeping the majority in safer buckets.`,
      },
    ],
  };
}

export async function POST(req) {
  try {
    const { amount, userId = "" } = await req.json();

    await connectMongoDB();

    const query = userId ? { userId } : {};
    const [transactions, savings, splits] = await Promise.all([
      Transaction.find(query).sort({ date: -1 }).lean(),
      Saving.find(query).sort({ date: -1 }).lean(),
      Split.find(query).sort({ date: -1 }).lean(),
    ]);

    const incomes = transactions.filter(
      (item) => String(item.type || "").toLowerCase() === "income"
    );
    const expenses = transactions.filter(
      (item) => String(item.type || "").toLowerCase() !== "income"
    );

    const requestedAmount = safeNumber(amount);
    const snapshot = buildSnapshot({
      incomes,
      expenses,
      savings,
      splits,
      requestedAmount,
    });

    if (snapshot.recommendedDeployableAmount <= 0) {
      return Response.json(
        {
          error:
            "Add an amount or record income in the dashboard so the advisor can estimate usable surplus.",
        },
        { status: 400 }
      );
    }

    const parsed = buildRuleBasedAdvice(snapshot);

    return Response.json({
      ...parsed,
      finance_snapshot: snapshot,
    });
  } catch (error) {
    console.error("POST FINANCE ADVISOR ERROR:", error);

    return Response.json(
      { error: "AI advisor request failed" },
      { status: 500 }
    );
  }
}
