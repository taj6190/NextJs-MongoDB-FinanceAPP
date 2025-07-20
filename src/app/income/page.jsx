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

export default function IncomePage() {
  const [incomes, setIncomes] = useState([]);
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
    fetchIncomes();
    fetchCategories();
  }, []);

  async function fetchIncomes() {
    try {
      const res = await fetch("/api/income");
      if (!res.ok) throw new Error("Failed to fetch incomes");
      const data = await res.json();
      setIncomes(data);
    } catch {
      toast.error("Failed to load incomes");
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch("/api/categories?type=income");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data.filter((cat) => cat.type === "income"));
    } catch {
      toast.error("Failed to load categories");
    }
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  function openDialog(income = null) {
    if (income) {
      const cat = categories.find((c) => c.name === income.category);
      setFormData({
        id: income._id,
        name: income.name,
        amount: income.amount.toString(),
        category: cat ? cat._id : "",
        date: new Date(income.date),
        description: income.description || "",
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

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "date" ? new Date(value) : value,
    }));
  }

  async function submitForm(e) {
    e.preventDefault();

    if (!formData.name || !formData.amount || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    const selectedCategory = categories.find(
      (cat) => String(cat._id) === String(formData.category)
    );

    const incomeData = {
      name: formData.name,
      amount,
      category: selectedCategory?.name || "Unknown",
      categoryType: "income",
      date: format(new Date(formData.date), "yyyy-MM-dd"),
      description: formData.description,
    };

    const url = isEditing ? `/api/income/${formData.id}` : "/api/income";
    const method = isEditing ? "PUT" : "POST";

    try {
      setLoading(true);
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incomeData),
      });

      if (!res.ok) throw new Error("Failed to save income");

      await fetchIncomes();
      toast.success(isEditing ? "Income updated" : "Income added");
      closeDialog();
    } catch {
      toast.error("Error saving income");
    } finally {
      setLoading(false);
    }
  }

  async function deleteIncome(id) {
    try {
      const res = await fetch(`/api/income/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      await fetchIncomes();
      toast.success("Income deleted");
    } catch {
      toast.error("Delete failed");
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
      render: (item) => item.category || "Unknown",
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
            onClick={() => deleteIncome(item._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Income</h1>
          <p className="text-gray-500">Track your income sources</p>
        </div>
        <Button onClick={() => openDialog()} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" /> Add Income
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Income Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <DataTable data={incomes} columns={columns} pageSize={10} />
          </div>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <FormDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        title={isEditing ? "Edit Income" : "Add New Income"}
        description={
          isEditing
            ? "Update your income details below"
            : "Fill in the details to add income"
        }
        onSubmit={submitForm}
        submitText={isEditing ? "Save Changes" : "Add Income"}
        isLoading={loading}
      >
        <div className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Income Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Salary, Freelance Work"
              required
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
              onChange={handleChange}
              placeholder="Enter amount"
              required
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
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
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
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional notes or details"
            />
          </div>
        </div>
      </FormDialog>
    </div>
  );
}
