import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/db'
import { createSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // 1. Validate
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      )
    }
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      )
    }

    // 2. Kiểm tra email đã tồn tại chưa
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Email này đã được sử dụng' },
        { status: 409 }
      )
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // 4. Lưu user vào DB
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    })

    // 5. Tạo session (JWT → cookie)
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
