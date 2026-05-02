import { NextResponse } from "next/server";
import userRepo from "@/repos/userRepo";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  if (search) {
    const users = await userRepo.search(search);
    return NextResponse.json(users);
  }

  const users = await userRepo.getAll();
  return NextResponse.json(users);
}

export async function POST(request) {
  const body = await request.json();
  const { action } = body;

  if (action === "login") {
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    const user = await userRepo.getByEmail(email);
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Incorrect email or password" },
        { status: 401 }
      );
    }
    return NextResponse.json(user);
  }

  if (action === "follow") {
    const { followerId, followeeId } = body;
    if (!followerId || !followeeId) {
      return NextResponse.json(
        { error: "followerId and followeeId are required" },
        { status: 400 }
      );
    }
    if (followerId === followeeId) {
      return NextResponse.json(
        { error: "You cannot follow yourself" },
        { status: 400 }
      );
    }
    const result = await userRepo.followUser(followerId, followeeId);
    return NextResponse.json(result, { status: 201 });
  }

  if (action === "unfollow") {
    const { followerId, followeeId } = body;
    if (!followerId || !followeeId) {
      return NextResponse.json(
        { error: "followerId and followeeId are required" },
        { status: 400 }
      );
    }
    if (followerId === followeeId) {
      return NextResponse.json(
        { error: "You cannot unfollow yourself" },
        { status: 400 }
      );
    }
    const result = await userRepo.unfollowUser(followerId, followeeId);
    return NextResponse.json(result, { status: 201 });
  }

  // Registration
  if (!body.username || !body.email || !body.password) {
    return NextResponse.json(
      { error: "username, email, and password are required" },
      { status: 400 }
    );
  }
  try {
    const newUser = await userRepo.create(body);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(request) {
  const body = await request.json();
  if (!body.userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }
  if (body.bio && body.bio.length > 200) {
    return NextResponse.json(
      { error: "Bio cannot exceed 200 characters" },
      { status: 400 }
    );
  }
  const updated = await userRepo.updateBio(
    body.userId,
    body.bio != null ? body.bio : ""
  );
  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}