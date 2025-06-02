'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import FormDialog from "@/components/ui/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    type: "expense",
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    activeTab === "all" ? true : category.type === activeTab
  );

  const handleOpenDialog = (category = null) => {
    if (category) {
      setFormData({
        id: category._id,
        name: category.name,
        type: category.type,
      });
      setIsEditing(true);
    } else {
      setFormData({
        id: null,
        name: "",
        type: "expense",
      });
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const url = isEditing ? `/api/categories/${formData.id}` : '/api/categories';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
        }),
      });

      if (!response.ok) throw new Error('Failed to save category');

      await fetchCategories();
      toast.success(isEditing ? "Category updated successfully" : "Category added successfully");
      handleCloseDialog();
    } catch (error) {
      console.error(error);
      toast.error("Error saving category");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete category');

      await fetchCategories();
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Error deleting category");
      console.error(error);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (item) => (
        <span
          className={`capitalize px-2 py-1 rounded-full text-xs ${
            item.type === "income"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.type}
        </span>
      )
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2 sm:px-0 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-500 text-sm sm:text-base">Manage your income and expense categories</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="flex items-center w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="overflow-x-auto w-full sm:w-auto">
          <TabsTrigger value="all">All Categories</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expense">Expense</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4 sm:mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "all"
                  ? "All Categories"
                  : activeTab === "income"
                    ? "Income Categories"
                    : "Expense Categories"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <DataTable
                  data={filteredCategories}
                  columns={activeTab === "all" ? columns : columns.filter(col => col.key !== 'type')}
                  pageSize={10}
                  categories={categories}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <FormDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        title={isEditing ? "Edit Category" : "Add New Category"}
        description={isEditing
          ? "Update your category details below"
          : "Fill in the details to create a new category"
        }
        onSubmit={handleSubmit}
        submitText={isEditing ? "Save Changes" : "Create Category"}
        isLoading={loading}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Category Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Salary, Rent, Groceries"
              className="h-10"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">
              Category Type
            </Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormDialog>
    </div>
  );
};

export default CategoriesPage;
