FROM node:10.16.0
RUN echo 'unsafe-perm=true' > /root/.npmrc
RUN npm install -g nodemon sequelize-cli mocha
