# Stage 1: Build the Angular app
FROM node:18-alpine as builder
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .
RUN npm run build --prod

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built app to the Nginx html directory (for serving)
COPY --from=builder /app/dist/checklist-frontend /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]