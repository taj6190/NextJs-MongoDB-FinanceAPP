"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#4ade80", "#f87171"];

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [balance, setBalance] = useState(0);
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchDashboardData();
    }
  }, [status]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch expenses
      const expensesResponse = await fetch("/api/expenses");
      if (!expensesResponse.ok) {
        throw new Error("Failed to fetch expenses");
      }
      const expensesData = await expensesResponse.json();
      const expenses = Array.isArray(expensesData) ? expensesData : [];

      // Fetch income
      const incomeResponse = await fetch("/api/income");
      if (!incomeResponse.ok) {
        throw new Error("Failed to fetch income");
      }
      const incomeData = await incomeResponse.json();
      const income = Array.isArray(incomeData) ? incomeData : [];

      // Combine and sort all transactions
      const allTransactions = [
        ...expenses.map((exp) => ({ ...exp, type: "expense" })),
        ...income.map((inc) => ({ ...inc, type: "income" })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      // Calculate totals
      const incomeSum = income.reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0
      );
      const expenseSum = expenses.reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0
      );

      setIncomeTotal(incomeSum);
      setExpenseTotal(expenseSum);
      setBalance(incomeSum - expenseSum);

      // Get latest 5 transactions
      setLatestTransactions(allTransactions.slice(0, 5));

      // Prepare pie chart data
      setPieData([
        { name: "Income", value: incomeSum },
        { name: "Expenses", value: expenseSum },
      ]);

      // Prepare monthly data
      const monthlyData = prepareMonthlyData(allTransactions);
      setMonthlyData(monthlyData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Optional: add toast notification or other UI for errors
    } finally {
      setLoading(false);
    }
  };

  const prepareMonthlyData = (transactions) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 5);

    // Initialize monthly data array
    const monthlyData = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(sixMonthsAgo);
      date.setMonth(sixMonthsAgo.getMonth() + i);
      monthlyData.push({
        month: months[date.getMonth()],
        income: 0,
        expense: 0,
      });
    }

    // Fill in the data
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      if (date >= sixMonthsAgo && date <= currentDate) {
        const monthIndex = monthlyData.findIndex(
          (d) => d.month === months[date.getMonth()]
        );
        if (monthIndex !== -1) {
          if (transaction.type === "income") {
            monthlyData[monthIndex].income += Number(transaction.amount);
          } else {
            monthlyData[monthIndex].expense += Number(transaction.amount);
          }
        }
      }
    });

    return monthlyData;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm md:text-base">
            Overview of your financial activities
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => router.push("/income")}
            className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2"
          >
            <DollarSign className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4" />
            Add Income
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/expenses")}
            className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2"
          >
            <Calendar className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-4 sm:p-6 rounded-xl shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center text-green-700 dark:text-green-400">
              <ArrowUpCircle className="mr-2 h-5 w-5" />
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 dark:text-green-400">
              {formatCurrency(incomeTotal)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 p-4 sm:p-6 rounded-xl shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center text-red-700 dark:text-red-400">
              <ArrowDownCircle className="mr-2 h-5 w-5" />
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700 dark:text-red-400">
              {formatCurrency(expenseTotal)}
            </div>
          </CardContent>
        </Card>

        <Card
          className={`bg-gradient-to-br p-4 sm:p-6 rounded-xl shadow ${
            balance >= 0
              ? "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
              : "from-red-50 to-red-100 dark:from-red-950 dark:to-red-900"
          }`}
        >
          <CardHeader className="pb-2">
            <CardTitle
              className={`text-lg font-medium flex items-center ${
                balance >= 0
                  ? "text-blue-700 dark:text-blue-400"
                  : "text-red-700 dark:text-red-400"
              }`}
            >
              <Wallet className="mr-2 h-5 w-5" />
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${
                balance >= 0
                  ? "text-blue-700 dark:text-blue-400"
                  : "text-red-700 dark:text-red-400"
              }`}
            >
              {formatCurrency(balance)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
        <Card className="p-4 sm:p-6 rounded-xl shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Income vs Expenses
            </CardTitle>
            <CardDescription>Distribution of your financial activities</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6 rounded-xl shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Monthly Trends
            </CardTitle>
            <CardDescription>
              Income and expenses over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#4ade80" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Latest Transactions */}
      <Card className="p-4 sm:p-6 rounded-xl shadow">
        <CardHeader>
          <CardTitle>Latest Transactions</CardTitle>
          <CardDescription>Your most recent financial activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-3 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="px-3 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="px-3 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium text-muted-foreground">
                    Note
                  </th>
                  <th className="px-3 sm:px-4 py-2 text-right text-xs sm:text-sm font-medium text-muted-foreground">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {latestTransactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="border-b hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                      {format(new Date(transaction.date), "MMM d, yyyy")}
                    </td>
                    <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                      {transaction.category}
                    </td>
                    <td className="px-3 sm:px-4 py-2 whitespace-nowrap max-w-xs truncate">
                      {transaction.note || "-"}
                    </td>
                    <td
                      className={`px-3 sm:px-4 py-2 text-right font-semibold whitespace-nowrap ${
                        transaction.type === "income"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                ))}
                {latestTransactions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-muted-foreground">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        /* Reduce padding on mobile */
        @media (max-width: 640px) {
          div.space-y-6.p-2.sm\\:p-4.md\\:p-6 {
            padding-left: 8px !important;
            padding-right: 8px !important;
          }
          .grid.grid-cols-1.md\\:grid-cols-3.gap-3.sm\\:gap-6 {
            gap: 0.75rem !important; /* smaller gap on mobile */
          }
          table.w-full.min-w-\\[500px\\] {
            min-width: 0 !important; /* allow table to shrink on small screens */
          }
          /* Adjust buttons on mobile */
          .flex.gap-2.w-full.sm\\:w-auto > button {
            padding-left: 0.75rem !important;
            padding-right: 0.75rem !important;
            font-size: 0.75rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
