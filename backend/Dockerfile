FROM node:20.12.1-slim
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
RUN npm audit fix

# Copy shared and backend folders
COPY shared/ ./shared/
COPY backend/ ./

# Use Docker-specific tsconfig
COPY backend/tsconfig.docker.json ./tsconfig.json
RUN npx prisma generate
RUN npm run build

# Create startup script
RUN echo '#!/bin/bash\nnpx prisma migrate deploy\nnode -r ./register.js dist/src/index.js' > start.sh
RUN chmod +x start.sh

EXPOSE 5000

# Run the startup script instead
CMD ["./start.sh"]