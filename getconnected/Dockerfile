ARG VERSION=010522
FROM jac18281828/tsdev:${VERSION}

ARG PROJECT=get_connected
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
