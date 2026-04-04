import { cookies } from "next/headers";

const FALLBACK_USER_ID = "guest-user";

export async function resolveUserId(request, body) {
  const cookieStore = await cookies();

  return (
    request.headers.get("x-user-id") ||
    cookieStore.get("studentos-user-id")?.value ||
    body?.userId ||
    request.nextUrl.searchParams.get("userId") ||
    FALLBACK_USER_ID
  );
}
