# config nginx
FROM nginx

# Substitui o arquivo default de conf
RUN rm /etc/nginx/conf.d/*
COPY ./docker/config/nginx/conf/production.conf /etc/nginx/conf.d/default.conf

# Escuta a porta 80
EXPOSE 80