FROM node:14

# set working directory to app
WORKDIR /app

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# copy source code to app
COPY . ./

# start the application
CMD ["npm", "start"]
