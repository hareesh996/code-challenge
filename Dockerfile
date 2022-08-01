FROM node:16
# Create workspace
WORKDIR /usr/code-challenge
# copy, package and package-lock json file
COPY package*.json ./
RUN npm install
# copy the source code.
COPY . .
RUN npm run build
# Start the server
CMD [ "node", "dist/apps/weather-app/main.js" ]
