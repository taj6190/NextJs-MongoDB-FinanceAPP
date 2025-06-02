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

  const fetchIncomes = async () => {
    try {
      const response = await fetch('/api/income');
      if (!response.ok) throw new Error('Failed to fetch income');
      const data = await response.json();
      setIncomes(data);
    } catch (error) {
      console.error('Error fetching income:', error);
      toast.error('Failed to load income data');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?type=income');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      const incomeCategories = data.filter(category => category.type === 'income');
      setCategories(incomeCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleOpenDialog = (income = null) => {
    if (income) {
      // Find the category object by name
      const matchedCategory = categories.find(
        (cat) => cat.name === income.category
      );
      setFormData({
        id: income._id,
        name: income.name || "",
        amount: income.amount.toString(),
        category: matchedCategory ? matchedCategory._id : "",
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
  };

  const handleCloseDialog = () => setIsDialogOpen(false);

  // ✅ Fixed: convert string to Date if name is "date"
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "date" ? new Date(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
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

    // Find the selected category object by ID
    const selectedCategory = categories.find(
      (cat) => String(cat._id) === String(formData.category)
    );
    const categoryName = selectedCategory ? selectedCategory.name : formData.category;

    try {
      const incomeData = {
        name: formData.name,
        amount,
        category: categoryName, // Store category name, not ID
        categoryType: 'income',
        date: format(formData.date, "yyyy-MM-dd"),
        description: formData.description,
      };

      const url = isEditing ? `/api/income/${formData.id}` : '/api/income';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(incomeData),
      });

      if (!response.ok) {
        throw new Error('Failed to save income');
      }

      await fetchIncomes();
      toast.success(isEditing ? "Income updated successfully" : "Income added successfully");
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving income:", error);
      toast.error("Error saving income");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/income/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete income');
      }

      await fetchIncomes();
      toast.success("Income deleted successfully");
    } catch (error) {
      console.error("Error deleting income:", error);
      toast.error("Error deleting income");
    }
  };

  const columns = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (item) => format(new Date(item.date), "MMM dd, yyyy")
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (item) => {
        // Always show the category name directly (since we now store the name)
        return item.category || "Unknown";
      },
    },
    {
      key: 'description',
      label: 'Description'
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (item) => formatCurrency(item.amount)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item) => (
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenDialog(item)}
          >
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
      )
    }
  ];

  return (
    <div className="space-y-6 px-2 sm:px-0 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Income</h1>
          <p className="text-gray-500 text-sm sm:text-base">Track your income sources</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="flex items-center w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Income
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Income Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <DataTable
              data={incomes}
              columns={columns}
              pageSize={10}
              categories={categories}
            />
          </div>
        </CardContent>
      </Card>

      <FormDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        title={isEditing ? "Edit Income" : "Add New Income"}
        description={isEditing 
          ? "Update your income details below"
          : "Fill in the details to add a new income record"
        }
        onSubmit={handleSubmit}
        submitText={isEditing ? "Save Changes" : "Add Income"}
        isLoading={loading}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Income Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Salary, Freelance Work"
              className="h-10"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
              className="h-10"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
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
                {categories
                  .filter((category) => category.type === "income")
                  .map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              Date
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={format(formData.date, "yyyy-MM-dd")}
              onChange={handleInputChange}
              className="h-10"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
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
