# ─────────────────────────────────────────────────────────────────────────────
# Dockerfile — bidforge-admin-web (React + Vite)
#
# Multi-stage: Stage 1 runs the Vite build inside the image (Node builds
# are fast/lightweight enough that this self-contained approach is the
# standard pattern — unlike the Flutter app's Dockerfile, which copies
# a pre-built folder for speed reasons specific to Flutter's SDK size).
# Stage 2 just serves the static output with Nginx.
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: Serve ────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

RUN apk add --no-cache wget

RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]