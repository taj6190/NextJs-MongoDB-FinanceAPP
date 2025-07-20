"use client";

import { format } from "date-fns";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import FormDialog from "@/components/ui/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    amount: "",
    category: "",
    date: new Date(),
    description: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  async function fetchExpenses() {
    try {
      const response = await fetch("/api/expenses");
      if (!response.ok) throw new Error("Failed to fetch expenses");
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to load expense data");
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch("/api/categories?type=expense");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data.filter((c) => c.type === "expense"));
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  function openDialog(expense = null) {
    if (expense) {
      const matchedCategory = categories.find(
        (cat) => cat.name === expense.category
      );
      setFormData({
        id: expense._id,
        name: expense.name || "",
        amount: expense.amount.toString(),
        category: matchedCategory ? matchedCategory._id : "",
        date: new Date(expense.date),
        description: expense.description || "",
      });
      setIsEditing(true);
    } else {
      setFormData({
        id: null,
        name: "",
        amount: "",
        category: "",
        date: new Date(),
        description: "",
      });
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  }

  function closeDialog() {
    setIsDialogOpen(false);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "date" ? new Date(value) : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name || !formData.amount || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);

    const selectedCategory = categories.find(
      (cat) => String(cat._id) === String(formData.category)
    );
    const categoryName = selectedCategory ? selectedCategory.name : formData.category;

    try {
      const expenseData = {
        name: formData.name,
        amount,
        category: categoryName,
        categoryType: "expense",
        date: format(formData.date, "yyyy-MM-dd"),
        description: formData.description,
      };

      const url = isEditing ? `/api/expenses/${formData.id}` : "/api/expenses";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) throw new Error("Failed to save expense");

      await fetchExpenses();
      toast.success(isEditing ? "Expense updated successfully" : "Expense added successfully");
      closeDialog();
    } catch (error) {
      console.error("Error saving expense:", error);
      toast.error("Error saving expense");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete expense");
      await fetchExpenses();
      toast.success("Expense deleted");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Error deleting expense");
    }
  }

  const columns = [
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (item) => format(new Date(item.date), "MMM dd, yyyy"),
    },
    { key: "name", label: "Name", sortable: true },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (item) => {
        const category = categories.find((cat) => String(cat._id) === String(item.category));
        return category ? category.name : item.category || "Unknown";
      },
    },
    { key: "description", label: "Description" },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (item) => formatCurrency(item.amount),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="icon" onClick={() => openDialog(item)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500"
            onClick={() => handleDelete(item._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-0 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Expenses</h1>
          <p className="text-gray-500 text-sm sm:text-base">Track your expenses</p>
        </div>
        <Button onClick={() => openDialog()} className="flex items-center w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </div>

      {/* Expense Table */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <DataTable data={expenses} columns={columns} pageSize={10} />
          </div>
        </CardContent>
      </Card>

      {/* Expense Form Dialog */}
      <FormDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        title={isEditing ? "Edit Expense" : "Add New Expense"}
        description={
          isEditing
            ? "Update your expense details below"
            : "Fill in the details to add a new expense record"
        }
        onSubmit={handleSubmit}
        submitText={isEditing ? "Save Changes" : "Add Expense"}
        isLoading={loading}
      >
        <div className="space-y-4">
          {/* Expense Name */}
          <div>
            <Label htmlFor="name">Expense Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Rent, Groceries"
              required
              className="h-10"
            />
          </div>

          {/* Amount */}
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
              required
              className="h-10"
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={format(formData.date, "yyyy-MM-dd")}
              onChange={handleInputChange}
              required
              className="h-10"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Optional notes or details"
              className="h-10"
            />
          </div>
        </div>
      </FormDialog>
    </div>
  );
}
