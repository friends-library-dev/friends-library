FROM ruby:2.6.5-buster

RUN git clone https://github.com/asciidoctor/docbookrx.git ~/docbookrx 
RUN cd ~/docbookrx && git checkout 682d8c2f7a9e1e6f546c5f7d0067353621c68a7a
RUN cd ~/docbookrx && bundle config --local build.nokogiri --use-system-libraries
RUN cd ~/docbookrx && bundle --path=.bundle/gems
RUN printf "cd ~/docbookrx\nbundle exec docbookrx /root/docs/document.xml\n" > ~/convert.sh

CMD ["/bin/bash", "/root/convert.sh"]
