FROM node:18
RUN echo 'unsafe-perm=true' > /root/.npmrc
RUN npm install -g nodemon mocha
