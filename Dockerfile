FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY server.js ./
COPY index.html ./
COPY README.md ./
COPY ["제출문.md", "./"]
COPY ["완주_체크리스트.md", "./"]
COPY ["대표작_카드_복붙용.txt", "./"]

ENV NODE_ENV=production
EXPOSE 10000

CMD ["node", "server.js"]
