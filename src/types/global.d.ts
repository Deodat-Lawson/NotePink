export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean
    }
  }
}


declare module 'remark-unwrap-images';
declare module 'rehype-slug';
declare module 'rehype-autolink-headings';
