'use client';

import { useEffect } from 'react';

export default function SeedDemo() {
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const hasDemo = users.some((u: { email: string }) => u.email === 'demo@starcard.vn');
    if (!hasDemo) {
      const demo = {
        id: 'demo-001',
        email: 'demo@starcard.vn',
        name: 'Fan K-pop',
        password: 'demo123',
        phone: '0901234567',
        address: '123 Nguyễn Huệ, Quận 1',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('users', JSON.stringify([...users, demo]));
    }
  }, []);

  return null;
}
