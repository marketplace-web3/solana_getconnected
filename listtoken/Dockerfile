FROM jac18281828/tsdev:latest

ARG PROJECT=listtoken
WORKDIR /workspaces/${PROJECT}
RUN chown -R tsdev:tsdev .

COPY --chown=tsdev:tsdev package.json .
COPY --chown=tsdev:tsdev package-lock.json .

USER tsdev

RUN npm i --save-dev

COPY --chown=tsdev:tsdev . .

RUN npm run prettier:check
RUN npm run eslint
RUN npm run build

CMD npm start

