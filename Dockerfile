FROM timbru31/java-node:11-alpine-jdk

RUN apk update && \
    apk add wget && \
    apk add bash && \
    apk add unzip

RUN wget -c https://github.com/jindrapetrik/jpexs-decompiler/releases/download/version14.4.0/ffdec_14.4.0.zip -O ffdec.zip && \
    unzip ffdec.zip -d ffdec

COPY . /d2protocol
WORKDIR /d2protocol
RUN npm install --prefix /d2protocol
