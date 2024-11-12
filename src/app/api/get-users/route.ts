import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // Get three random users from the database
    const users = await UserModel.aggregate([
      { $match: { isAcceptingMessage: true } }, // Filter users who accept messages
      { $addFields: { messageCount: { $size: "$messages" } } }, // Add a field to count the number of messages
      { $sort: { messageCount: -1 } }, // Sort by message count in descending order
      { $limit: 3 }, // Limit to top 3 users
      { $project: { _id: 0, username: 1 } } // Project only the username
  ]);

    if (users.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No users found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      users: users.map(user => user.username),
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching random users:", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching users",
    }, { status: 500 });
  }
}
