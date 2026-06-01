export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'StarCard API',
    version: '1.0.0',
    description: 'API xác thực người dùng cho StarCard Shop',
  },
  tags: [
    { name: 'Auth', description: 'Đăng ký, đăng nhập, đăng xuất' },
  ],
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Đăng ký tài khoản mới',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name:     { type: 'string', example: 'Hung Nguyen' },
                  email:    { type: 'string', example: 'hung@gmail.com' },
                  password: { type: 'string', example: '123456' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Đăng ký thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        user: {
                          type: 'object',
                          properties: {
                            id:    { type: 'string', example: 'clx123abc' },
                            name:  { type: 'string', example: 'Hung Nguyen' },
                            email: { type: 'string', example: 'hung@gmail.com' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: 'Thiếu thông tin hoặc password quá ngắn' },
          409: { description: 'Email đã tồn tại' },
          500: { description: 'Lỗi server' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Đăng nhập',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email:    { type: 'string', example: 'hung@gmail.com' },
                  password: { type: 'string', example: '123456' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Đăng nhập thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        user: {
                          type: 'object',
                          properties: {
                            id:    { type: 'string', example: 'clx123abc' },
                            name:  { type: 'string', example: 'Hung Nguyen' },
                            email: { type: 'string', example: 'hung@gmail.com' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: 'Thiếu thông tin' },
          401: { description: 'Email hoặc mật khẩu không đúng' },
          500: { description: 'Lỗi server' },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Đăng xuất',
        responses: {
          200: {
            description: 'Đăng xuất thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Lấy thông tin user đang đăng nhập',
        responses: {
          200: {
            description: 'Thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        user: {
                          type: 'object',
                          properties: {
                            id:        { type: 'string' },
                            name:      { type: 'string' },
                            email:     { type: 'string' },
                            phone:     { type: 'string', nullable: true },
                            address:   { type: 'string', nullable: true },
                            createdAt: { type: 'string' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Chưa đăng nhập' },
          404: { description: 'Không tìm thấy user' },
        },
      },
    },
  },
}
