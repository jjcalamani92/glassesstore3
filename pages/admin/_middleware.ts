import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {
  const session: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!session) {
    // return NextResponse.redirect('/auth/login');
    return new Response(JSON.stringify({ message: "No autorizado" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const validUser = ["jesuscalamani92@gmail.com", "temuergu@gmail.com", process.env.EMAIL];
  
  if (!validUser.includes(session.user.email)) {
    
    return new Response(JSON.stringify({ message: "No autorizado" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  const validRoles = ["ADMIN_ROL", "SUPER_ROL", "SEO"];

  if (!validRoles.includes(session.user.role) ) {
    
    return new Response(JSON.stringify({ message: "No autorizado" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }


  return NextResponse.next();
}
