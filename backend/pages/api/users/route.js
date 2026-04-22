import {NextResponse} from "next/server";
import UserRepo from "@/repos/UserRepo";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const users = await UserRepo.getAll();
    return NextResponse.json(users);
}
// body: {username, email, password}
export async function POST(request){
    const body = await request.json();
    if(!body.username || !body.email || !body.password){
        return NextResponse.json(
            {error: "username, email, and password are required"},
            {status: 400}
        )
    }
    const newUser = await UserRepo.create(body);
    return NextResponse.json(newUser, { status: 201 });
}
export async function PATCH(request){
    const body = await request.json();
    if(!body.userId){
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
    if (body.bio && body.bio.length > 200) {
        return NextResponse.json(
            { error: "Bio cannot exceed 200 characters" },
            { status: 400 }
        );
    }
    const updated = await UserRepo.updateBio(body.userId, body.bio!=null ? body.bio: "")
    if(!updated){
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
}

