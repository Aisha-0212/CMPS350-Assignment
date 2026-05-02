import { NextResponse } from "next/server";
import userRepo from "@/repos/userRepo";

export async function GET(request, { params }) {
  const { id } = await params;
  const user = await userRepo.getById(id);

  if (!user) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await userRepo.deleteUser(id);
    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
