FROM node:14

# set working directory to app
WORKDIR /app

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# install serve to server build files
RUN npm install -g serve

# copy source code to app
COPY . ./

# Generate production build
RUN npm build

# Serve build
CMD ["serve", "-s", "build", "-l", "3000"]
