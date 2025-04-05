import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ko'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/profile': {
      en: '/profile',
      ko: '/profile'
    }
  }
}); 