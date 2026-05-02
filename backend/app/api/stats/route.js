import { NextResponse } from "next/server";
import statsRepo from "@/repos/statsRepo";

export async function GET(request, { params }) {
  const [
    avgFollowers,
    avgPosts,
    mostActive,
    mostLiked,
    postsPerMonth,
    mostCommonWord,
    topCommenters,
    mostFollowed,
  ] = await Promise.allSettled([
    statsRepo.getAverageFollowersPerUser(),
    statsRepo.getAveragePostsPerUser(),
    statsRepo.getMostActiveUser(),
    statsRepo.getMostLikedPost(),
    statsRepo.getPostsPerMonth(),
    statsRepo.getMostCommonWord(),
    statsRepo.getTopCommenters(),
    statsRepo.getMostFollowedUser(),
  ]);
  const stats = {
    avgFollowers,
    avgPosts,
    mostActive,
    mostLiked,
    postsPerMonth,
    mostCommonWord,
    topCommenters,
    mostFollowed,
  };
  return NextResponse.json(stats);
}
