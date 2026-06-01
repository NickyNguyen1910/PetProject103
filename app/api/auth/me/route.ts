import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET() {
  try {
    // 1. Đọc session từ cookie
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Chưa đăng nhập' },
        { status: 401 }
      )
    }

    // 2. Lấy thông tin user từ DB
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        avatar: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy người dùng' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: { user } })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại' },
      { status: 500 }
    )
  }
}
