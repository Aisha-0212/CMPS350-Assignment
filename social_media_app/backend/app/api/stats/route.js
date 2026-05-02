import { NextResponse } from "next/server";
import statsRepo from "@/repos/statsRepo";

export async function GET() {
  const results = await Promise.allSettled([
    statsRepo.getAverageFollowersPerUser(),
    statsRepo.getAveragePostsPerUser(),
    statsRepo.getMostActiveUser(),
    statsRepo.getMostLikedPost(),
    statsRepo.getPostsPerMonth(),
    statsRepo.getMostCommonWord(),
    statsRepo.getTopCommenters(),
    statsRepo.getMostFollowedUser(),
  ]);

  // Promise.allSettled returns { status, value } — unwrap each one
  const [
    avgFollowers,
    avgPosts,
    mostActiveUser,
    mostLikedPost,
    postsPerMonth,
    commonWord,
    topCommenters,
    mostFollowedUser,
  ] = results.map((r) => (r.status === "fulfilled" ? r.value : null));

  return NextResponse.json({
    avgFollowers,
    avgPosts,
    mostActiveUser,
    mostLikedPost,
    postsPerMonth,
    commonWord,
    topCommenters,
    mostFollowedUser,
  });
}