import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ko', 'de'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
  }
}); 