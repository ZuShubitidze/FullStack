# STAGE 1: Build the app
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including TypeScript)
RUN npm install
RUN npx prisma generate

COPY . .
RUN npm run build

# STAGE 2: Run the app
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache curl

# Set environment to production
ENV NODE_ENV=production
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl-arm64-openssl-3.0.x 

# Copy only the package files
COPY package*.json ./

# Install ONLY production dependencies (No TypeScript, no DevTools)
RUN npm install --omit=dev

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copy the compiled code and templates from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Expose port and start
EXPOSE 3000
# CMD ["npm", "start"]
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
