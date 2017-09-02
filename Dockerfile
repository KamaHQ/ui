FROM nginx:1.13.1

COPY nginx.conf /etc/nginx/nginx.conf

COPY dist/ /usr/share/nginx/html
