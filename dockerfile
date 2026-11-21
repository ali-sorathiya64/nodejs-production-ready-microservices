FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci
ARG SERVICE
ENV SERVICE=${SERVICE}
CMD npm run dev -w $SERVICE