FROM cassproject/ldb:node-1.5.31
USER root
WORKDIR /app
COPY ca.crt ca.crt
COPY cass.crt ldb.crt
COPY cass.key ldb.key
RUN apt update && apt dist-upgrade -y && apt clean
COPY package.json ./
RUN npm install --production --omit=dev && npm upgrade --production --omit=dev --save && npm audit --production --omit=dev --audit-level=high --fix && chown root:root node_modules -R
COPY src src
EXPOSE 80
CMD node ./src/main/server.js