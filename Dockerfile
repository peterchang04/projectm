FROM node:8.11-alpine
MAINTAINER peter

# Ports
ENV PORT 8080
EXPOSE 8080

# Directories
ENV APP_DIR /app
WORKDIR $APP_DIR

# Copy package manager files
COPY package*.json ./
COPY yarn.lock ./

# Get Dependencies
RUN yarn install
RUN yarn global add @vue/cli

# Healthcheck
ENV HEALTHCHECK_URI "http://127.0.0.1:${PORT}/"
HEALTHCHECK --interval=20s --timeout=30s --retries=15 CMD curl --fail ${HEALTHCHECK_URI} || exit 1

# Launch
CMD yarn run serve
