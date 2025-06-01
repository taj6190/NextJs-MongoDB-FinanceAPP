import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// PUT update expense entry
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    const { name, amount, category, description, date } = await request.json();

    if (!amount || !category || !date) {
      return NextResponse.json(
        { message: "Amount, category, and date are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db.collection("expenses").updateOne(
      {
        _id: new ObjectId(id),
        userId: session.user.id,
      },
      {
        $set: {
          name, // <-- fix: update name field
          amount: parseFloat(amount),
          category,
          description: description || "",
          date: new Date(date),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Expense entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Expense updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update expense" },
      { status: 500 }
    );
  }
}

// DELETE expense entry
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db.collection("expenses").deleteOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Expense entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
