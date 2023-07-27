FROM cassproject/ldb:1.5.31

USER elasticsearch
RUN mkdir CASS
COPY src CASS/src
COPY package.json CASS/package.json
COPY ca.crt CASS/ca.crt
COPY cass.crt CASS/cass.crt
COPY cass.key CASS/cass.key
COPY pm2.standalone.config.js CASS/pm2.standalone.config.js
COPY copyright.txt CASS/copyright.txt
COPY LICENSE CASS/LICENSE
RUN cd CASS && npm install --omit=dev && npm upgrade --production --omit=dev --save && npm audit --production --audit-level=high fix

VOLUME ["/usr/share/elasticsearch/data","/usr/share/elasticsearch/CASS/etc","/usr/share/elasticsearch/CASS/logs"]

USER elasticsearch:root
ENTRYPOINT (cd CASS && npm run run:standalone && npm run logs) & /bin/tini -- /usr/local/bin/docker-entrypoint.sh