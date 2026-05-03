FROM node:24-bookworm-slim
LABEL maintainer="paulserban.eu"

ARG LEADERBOARD_SERVICE_PROJECT_PATH
ARG LEADERBOARD_NODE_PORT

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY .${LEADERBOARD_SERVICE_PROJECT_PATH}/package.json /usr/src/app/

RUN yarn install
# if you build you code for production
# RUN npm ci --only=production

# Expose the port the app runs on
EXPOSE ${LEADERBOARD_NODE_PORT}

# Bundle app source
COPY .${LEADERBOARD_SERVICE_PROJECT_PATH}/ /usr/src/app/

# Command to run when the container is ready
# Separate arguments as separate values in the array
CMD [ "yarn", "run", "dev"]