import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/db'
import { createSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // 1. Validate
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      )
    }

    // 2. Tìm user theo email
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      )
    }

    // 3. So sánh password
    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      )
    }

    // 4. Tạo session (JWT → cookie)
    await createSession(user.id)

    return NextResponse.json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email },
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại' },
      { status: 500 }
    )
  }
}
