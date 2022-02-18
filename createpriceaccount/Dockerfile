ARG VERSION=latest
FROM jac18281828/tsdev:${VERSION}

ARG PROJECT=createpriceaccount
WORKDIR /workspaces/${PROJECT}
RUN chown -R jac.jac .

COPY --chown=jac:jac package.json .
COPY --chown=jac:jac package-lock.json .

USER jac

RUN npm i --save-dev

COPY --chown=jac:jac . .

#RUN npm run prettier:check
#RUN npm run eslint
#RUN npm run build

CMD npm start

