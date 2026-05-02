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
  const body = await request.json();
  if (!body.userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }
  const deleteduser = await userRepo.delete(id, body.userId);
  if (!deleteduser.success) {
    const status = deleteduser.error === "user not found" ? 404 : 403;
    return NextResponse.json({ deleteduser: deleteduser.error }, { status });
  }
  return NextResponse.json({ message: "user deleted" });
}
