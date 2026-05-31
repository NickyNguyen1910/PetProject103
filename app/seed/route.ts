import { NextResponse } from 'next/server';

export async function GET() {
  // This just returns the demo user info - actual seeding happens client-side via localStorage
  return NextResponse.json({
    message: 'Seed data info',
    demoUser: {
      email: 'demo@starcard.vn',
      password: 'demo123',
    },
  });
}
