FROM jac18281828/tsdev:latest

ARG PROJECT=airdrop
WORKDIR /workspaces/${PROJECT}
RUN chown -R tsdev:tsdev .

COPY --chown=tsdev:tsdev package.json .
COPY --chown=tsdev:tsdev package-lock.json .

RUN npm i --save-dev

USER tsdev
COPY --chown=tsdev:tsdev . .

RUN npm run prettier:check
RUN npm run eslint
RUN npm run build

CMD npm start
