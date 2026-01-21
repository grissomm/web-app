# 1. Use official Node.js image
FROM node:18

# 2. Create app directory inside container
WORKDIR /app

# 3. Copy package files first
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy rest of application files
COPY . .

# 6. Open port 3000
EXPOSE 3000

# 7. Start the app
CMD ["node", "app.js"]