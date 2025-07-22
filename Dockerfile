FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY . /usr/share/nginx/html

RUN printf "\
server {\n\
  listen 80;\n\
\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
\n\
  location / {\n\
    try_files \$uri \$uri/ =404;\n\
  }\n\
}\n" > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
