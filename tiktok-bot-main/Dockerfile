# 1️⃣ Base image (LTS Node, stable)
FROM node:20-alpine

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Copy package files first (layer caching)
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm ci --only=production

# 5️⃣ Copy app source
COPY . .

# 6️⃣ Create audio directory
RUN mkdir -p audio

# 7️⃣ Environment
ENV NODE_ENV=production

# 8️⃣ Start bot
CMD ["node", "index.js"]
