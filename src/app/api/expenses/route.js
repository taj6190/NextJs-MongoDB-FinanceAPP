import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("exprense");

    const expenses = await db
      .collection("expenses")
      .find({ userId: session.user.id })
      .toArray();

    // Convert _id to string
    const expensesWithIdStr = expenses.map(exp => ({
      ...exp,
      _id: exp._id.toString(),
    }));

    return NextResponse.json(expensesWithIdStr, { status: 200 });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { amount, description, date, category, name } = data;

    if (!amount || !name || !date) {
      return NextResponse.json(
        { error: "Amount, name, and date are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("exprense");

    const expenseData = {
      name,
      amount: parseFloat(amount),
      description: description || "",
      date: new Date(date),
      category: category || "Other",
      userId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("expenses").insertOne(expenseData);

    const insertedExpense = {
      ...expenseData,
      _id: result.insertedId.toString(),
    };

    return NextResponse.json(insertedExpense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Failed to create expense", details: error.message },
      { status: 500 }
    );
  }
}
