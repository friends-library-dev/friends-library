FROM asciidoctor/docker-asciidoctor

ENV PANDOC https://github.com/jgm/pandoc/releases/download/2.10/pandoc-2.10-linux-amd64.tar.gz
RUN curl --silent --location $PANDOC > $HOME/pandoc.tar.gz
RUN tar xvzf $HOME/pandoc.tar.gz --strip-components 1 -C /usr/local
