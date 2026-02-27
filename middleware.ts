import { NextRequest, NextResponse } from 'next/server';

// Список защищенных маршрутов
const protectedRoutes = ['/home', '/profile', '/admin', '/chat'];

// Маршруты с ограничением по типу пользователя
const userTypeRestrictedRoutes: { [key: string]: string[] } = {
  '/profile': ['client'], // Только клиенты могут получить доступ к профилю
  '/admin': ['trainer'],   // Только тренеры могут получить доступ к админке
  // Чат доступен обоим типам пользователей
};

// Функция для проверки валидности JWT токена
function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  try {
    // Разбиваем токен на части (header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false; // Некорректный формат токена
    }

    // Декодируем payload (вторая часть)
    const payload = JSON.parse(atob(parts[1]));

    // Проверяем, не истек ли токен (exp - время истечения в секундах)
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (error) {
    console.error('Ошибка при проверке токена:', error);
    return false;
  }
}

// Функция для получения типа пользователя из токена
function getUserTypeFromToken(token: string | null): string | null {
  if (!token) return null;

  try {
    // Разбиваем токен на части (header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null; // Некорректный формат токена
    }

    // Декодируем payload (вторая часть)
    const payload = JSON.parse(atob(parts[1]));

    // Возвращаем тип пользователя из токена
    return payload.user_type || payload.type || null;
  } catch (error) {
    console.error('Ошибка при получении типа пользователя из токена:', error);
    return null;
  }
}

export function middleware(request: NextRequest) {
  // Проверяем, является ли текущий маршрут защищенным
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Получаем токен из cookies (если он там хранится)
    const token = request.cookies.get('token')?.value;

    // Проверяем, не истек ли токен
    if (token && !isTokenValid(token)) {
      // Если токен истек, удаляем его и перенаправляем на страницу входа
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    // Если токена нет, перенаправляем на страницу входа
    if (!token) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    // Проверяем ограничения по типу пользователя
    const restrictedUserTypes = userTypeRestrictedRoutes[request.nextUrl.pathname];
    if (restrictedUserTypes) {
      const userType = getUserTypeFromToken(token);
      if (userType && !restrictedUserTypes.includes(userType)) {
        // Если пользователь не имеет разрешенного типа, перенаправляем на домашнюю страницу
        return NextResponse.redirect(new URL('/home', request.url));
      }
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