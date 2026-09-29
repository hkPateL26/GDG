import { NextResponse } from "next/server";
import { APP_VERSION, APP_BUILD_NAME, APP_RELEASE_DATE } from "@/lib/app-version";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getLatestSrcMtime(dirPath: string): number {
  let latest = 0;
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        const subLatest = getLatestSrcMtime(fullPath);
        if (subLatest > latest) latest = subLatest;
      } else if (
        entry.isFile() &&
        /\.(tsx?|css|json)$/.test(entry.name)
      ) {
        const stat = fs.statSync(fullPath);
        const mtimeSec = Math.floor(stat.mtimeMs / 1000);
        if (mtimeSec > latest) latest = mtimeSec;
      }
    }
  } catch {
    // Ignore fs errors in serverless environments where src may not be readable
  }
  return latest;
}

export async function GET() {
  const srcDir = path.join(process.cwd(), "src");
  const latestMtime = getLatestSrcMtime(srcDir);
  const commitSha =
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.RENDER_GIT_COMMIT ||
    "local";

  const buildHash = `${APP_VERSION}-${commitSha.slice(0, 7)}-${latestMtime}`;

  return NextResponse.json(
    {
      version: APP_VERSION,
      buildHash,
      buildName: APP_BUILD_NAME,
      releaseDate: APP_RELEASE_DATE,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}
