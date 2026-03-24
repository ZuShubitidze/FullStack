# STAGE 1: Build the React app
FROM node:20-alpine AS builder
WORKDIR /app

# Vite needs environment variables at BUILD time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# STAGE 2: Serve with Nginx
FROM nginx:alpine
# Copy build output from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy custom Nginx config for React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
