FROM node:current AS runner

WORKDIR /app
COPY . ./

RUN ["npm", "install"]

CMD ["node", "main.js"]
