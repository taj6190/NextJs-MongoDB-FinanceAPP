import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 8,
    backgroundColor: "#f8fafc", // subtle background
  },
  headerBar: {
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: "center",
  },
  headerBarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  header: {
    marginBottom: 10,
    textAlign: "center",
  },
  title: {
    fontSize: 16,
    marginBottom: 3,
    fontWeight: "bold",
    color: "#2563eb",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 9,
    marginBottom: 2,
    color: "#666",
  },
  section: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    boxShadow: "0 1px 4px #e0e7ef",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#2563eb",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e7ef",
    paddingBottom: 2,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 5,
    gap: 2,
  },
  summaryItem: {
    width: "33.33%",
    padding: 2,
  },
  summaryLabel: {
    fontSize: 7,
    color: "#666",
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0f172a",
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#bfbfbf",
    marginTop: 5,
    borderRadius: 6,
    overflow: "hidden",
  },
  tableContainer: {
    border: "1px solid #bfbfbf",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 8,
    padding: 4,
    minHeight: 60,
    maxHeight: 220,
    overflow: "hidden",
    boxShadow: "0 1px 4px #e0e7ef",
  },
  tableRow: {
    flexDirection: "row",
    minHeight: 20,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#e0e7ef",
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#bfbfbf",
  },
  tableCell: {
    padding: 3,
    flex: 1,
    fontSize: 8,
    color: "#334155",
    maxWidth: 60,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  tableCellHeader: {
    fontWeight: "bold",
    color: "#2563eb",
    fontSize: 9,
  },
  tableRowAlt: {
    backgroundColor: "#f1f5f9",
  },
  categorySection: {
    marginTop: 5,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 1,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    textAlign: "center",
    fontSize: 7,
    color: "#666",
  },
  twoColumnLayout: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
  },
  column: {
    flex: 1,
    marginHorizontal: 2,
  },
});

export function FinancialReportPDF({ expenses, incomes, dateRange, category, summary }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBar}>
          <Text style={styles.headerBarText}>Financial Report</Text>
        </View>
        <View style={styles.header}>
          <Text style={styles.title}>Expense Tracker</Text>
          <Text style={styles.subtitle}>
            {format(new Date(dateRange.from), "MMM dd, yyyy")} -{" "}
            {format(new Date(dateRange.to), "MMM dd, yyyy")} | {category}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Income</Text>
              <Text style={[styles.summaryValue, { color: "#4ade80" }]}>
                {formatCurrency(summary.totalIncome)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <Text style={[styles.summaryValue, { color: "#f87171" }]}>
                {formatCurrency(summary.totalExpenses)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Net Balance</Text>
              <Text
                style={[
                  styles.summaryValue,
                  {
                    color: summary.netBalance >= 0 ? "#60a5fa" : "#f87171",
                  },
                ]}
              >
                {formatCurrency(summary.netBalance)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Avg Income</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(summary.averageIncome)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Avg Expense</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(summary.averageExpense)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Top Categories</Text>
              <Text style={styles.summaryValue}>
                {summary.topIncomeCategory} / {summary.topExpenseCategory}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.twoColumnLayout}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Income</Text>
            <View style={styles.tableContainer}>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, styles.tableCellHeader]}>Date</Text>
                  <Text style={[styles.tableCell, styles.tableCellHeader]}>Name</Text>
                  <Text style={[styles.tableCell, styles.tableCellHeader]}>Category</Text>
                  <Text style={[styles.tableCell, styles.tableCellHeader]}>Amount</Text>
                </View>
                {incomes.map((income, index) => (
                  <View key={index} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}>
                    <Text style={styles.tableCell}>
                      {format(new Date(income.date), "MMM dd")}
                    </Text>
                    <Text style={styles.tableCell}>
                      {String(income.name).length > 16 ? String(income.name).slice(0, 15) + "…" : income.name}
                    </Text>
                    <Text style={styles.tableCell}>
                      {String(income.category).length > 16 ? String(income.category).slice(0, 15) + "…" : income.category}
                    </Text>
                    <Text style={[styles.tableCell, { color: "#4ade80" }]}>
                      {formatCurrency(income.amount)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Expenses</Text>
            <View style={styles.tableContainer}>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, styles.tableCellHeader]}>Date</Text>
                  <Text style={[styles.tableCell, styles.tableCellHeader]}>Name</Text>
                  <Text style={[styles.tableCell, styles.tableCellHeader]}>Category</Text>
                  <Text style={[styles.tableCell, styles.tableCellHeader]}>Amount</Text>
                </View>
                {expenses.map((expense, index) => (
                  <View key={index} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}>
                    <Text style={styles.tableCell}>
                      {format(new Date(expense.date), "MMM dd")}
                    </Text>
                    <Text style={styles.tableCell}>
                      {String(expense.name).length > 16 ? String(expense.name).slice(0, 15) + "…" : expense.name}
                    </Text>
                    <Text style={styles.tableCell}>
                      {String(expense.category).length > 16 ? String(expense.category).slice(0, 15) + "…" : expense.category}
                    </Text>
                    <Text style={[styles.tableCell, { color: "#f87171" }]}>
                      {formatCurrency(expense.amount)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
        <Text style={styles.footer}>
          Generated on {format(new Date(), "MMM dd, yyyy 'at' hh:mm a")}
        </Text>
      </Page>
    </Document>
  );
}