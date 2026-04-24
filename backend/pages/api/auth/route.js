import { NextResponse } from "next/server";
import UserRepo from "@/repos/UserRepo";

export async function POST(request) {
  const body = await request.json();
  const { action } = body;

  if (action === "login") {
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }
    const user = await UserRepo.getByEmail(email);
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Incorrect email or password" },
        { status: 401 },
      );
    }
    return NextResponse.json(user);
  }

  if (action === "follow") {
    const { followerId, followeeId } = body;
    if (!followerId || !followeeId) {
      return NextResponse.json(
        { error: "followerId and followeeId are required" },
        { status: 400 },
      );
    }
    if (followerId === followeeId) {
      return NextResponse.json(
        { error: "You cannot follow yourself" },
        { status: 400 },
      );
    }
    const newFollow = await UserRepo.followUser(followerId, followeeId);
    return NextResponse.json(newFollow, { status: 201 });
  }

  if (action === "unfollow") {
    const { followerId, followeeId } = body;
    if (!followerId || !followeeId) {
      return NextResponse.json(
        { error: "followerId and followeeId are required" },
        { status: 400 },
      );
    }
    if (followerId === followeeId) {
      return NextResponse.json(
        { error: "You cannot unfollow yourself" },
        { status: 400 },
      );
    }
    const newUnfollow = await UserRepo.unfollowUser(followerId, followeeId);
    return NextResponse.json(newUnfollow, { status: 201 });
  }

  return NextResponse.json(
    { error: `Unknown action: ${action}` },
    { status: 400 },
  );
}
