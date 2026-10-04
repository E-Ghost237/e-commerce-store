import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, ATTRIBUTION_PARAMS, MAX_STORED_TOUCHES, TOUCHES_COOKIE, type MarketingTouch } from "@/lib/cookies";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

function truncate(value: string | null, length: number): string | undefined {
  return value ? value.slice(0, length) : undefined;
}

/**
 * Captures campaign parameters and external referrers into a short list of marketing touches (sent to the
 * cart later), and keeps signed-out visitors out of the back office.
 */
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !request.cookies.has(ADMIN_COOKIE)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (pathname.startsWith("/admin") || request.method !== "GET") {
    return NextResponse.next();
  }

  const referrer = request.headers.get("referer");
  const referrerHost = referrer ? URL.canParse(referrer) && new URL(referrer).host : null;
  const isExternalReferrer = Boolean(referrerHost && referrerHost !== request.nextUrl.host);
  const hasCampaign = ATTRIBUTION_PARAMS.some((param) => searchParams.has(param));
  const firstVisit = !request.cookies.has(TOUCHES_COOKIE) && !request.cookies.has("cc_seen");

  if (!hasCampaign && !isExternalReferrer && !firstVisit) {
    return NextResponse.next();
  }

  const touch: MarketingTouch = { occurred_at: new Date().toISOString() };
  for (const param of ATTRIBUTION_PARAMS) {
    const value = truncate(searchParams.get(param), 255);
    if (value) {
      touch[param] = value;
    }
  }
  touch.landing_page = truncate(`${request.nextUrl.origin}${pathname}`, 512);
  if (isExternalReferrer) {
    touch.referrer = truncate(referrer, 512);
  }

  let touches: MarketingTouch[] = [];
  try {
    touches = JSON.parse(request.cookies.get(TOUCHES_COOKIE)?.value ?? "[]") as MarketingTouch[];
  } catch {
    touches = [];
  }
  // Keep the first touch and the most recent ones.
  touches = [...touches, touch];
  if (touches.length > MAX_STORED_TOUCHES) {
    touches = [touches[0], ...touches.slice(-(MAX_STORED_TOUCHES - 1))];
  }

  const response = NextResponse.next();
  const secure = request.nextUrl.protocol === "https:";
  response.cookies.set(TOUCHES_COOKIE, JSON.stringify(touches), { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: THIRTY_DAYS });
  response.cookies.set("cc_seen", "1", { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: THIRTY_DAYS });

  return response;
}

export const config = {
  matcher: ["/((?!_next/|api/|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|svg|webp|ico|mp4)$).*)"],
};
