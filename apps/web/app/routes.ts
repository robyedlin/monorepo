import {
  type RouteConfig,
  index,
  layout,
  route
} from '@react-router/dev/routes'

export default [
  index('routes/(app)/index.tsx'),
  layout('./routes/(auth)/_layout.tsx', [
    route('auth/sign-in', 'routes/(auth)/sign-in.tsx'),
    route('auth/sign-in-code', 'routes/(auth)/sign-in-code.tsx')
  ])
] satisfies RouteConfig
