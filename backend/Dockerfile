FROM node:20

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/ .

COPY shared/ ./shared

COPY backend/tsconfig.json ./tsconfig.json

RUN npx prisma generate

RUN npm run build

EXPOSE 5000
CMD ["node", "dist/index.js"]
