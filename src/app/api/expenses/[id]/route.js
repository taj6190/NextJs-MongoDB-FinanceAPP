import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

function isValidObjectId(id) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid expense ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("exprense");

    const expense = await db.collection("expenses").findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    expense._id = expense._id.toString();

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error);
    return NextResponse.json({ error: "Failed to fetch expense" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid expense ID" }, { status: 400 });
    }

    const body = await request.json();
    const { amount, category, description, date } = body;

    if (!amount || !category || !date) {
      return NextResponse.json(
        { error: "Amount, category, and date are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("exprense");

    const expenseUpdate = {
      amount: parseFloat(amount),
      category,
      description: description || "",
      date: new Date(date),
      updatedAt: new Date(),
    };

    const result = await db.collection("expenses").updateOne(
      { _id: new ObjectId(id), userId: session.user.id },
      { $set: expenseUpdate }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Expense updated successfully",
      expense: { ...expenseUpdate, _id: id },
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json({ error: "Failed to update expense" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid expense ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("exprense");

    const result = await db.collection("expenses").deleteOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 });
  }
}
