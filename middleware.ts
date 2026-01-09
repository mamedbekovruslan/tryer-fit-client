import { NextRequest, NextResponse } from 'next/server';

// Список защищенных маршрутов
const protectedRoutes = ['/home'];

export function middleware(request: NextRequest) {
  // Проверяем, является ли текущий маршрут защищенным
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Получаем токен из cookies (если он там хранится)
    const token = request.cookies.get('token')?.value;
    
    // Или проверяем, есть ли токен в localStorage (это сложнее сделать на сервере)
    // Поэтому мы можем перенаправлять на клиентскую проверку
    
    // Если токена нет, перенаправляем на страницу входа
    if (!token) {
      // Так как на сервере нет localStorage, мы не можем проверить его напрямую
      // Вместо этого, мы можем использовать заголовки или другие механизмы
      
      // Для простоты, возвращаем ответ, который будет обработан на клиенте
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Сопоставляем все пути, кроме тех, что начинаются с:
     * - api (маршруты API)
     * - _next/static (статические файлы)
     * - _next/image (файлы оптимизации изображений)
     * - favicon.ico (файл иконки)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // Также проверяем защищенные маршруты
    '/home/:path*',
  ],
};