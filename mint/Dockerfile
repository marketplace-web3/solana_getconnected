ARG VERSION=latest
FROM jac18281828/tsdev:${VERSION}

ARG PROJECT=mint
WORKDIR /workspaces/${PROJECT}

COPY package.json .
COPY package-lock.json .
RUN npm i --save-dev
RUN npm i

COPY .env .
COPY .eslintrc .
COPY tsconfig.json .
COPY src src/

RUN npm run eslint
RUN npm run build

CMD npm start
