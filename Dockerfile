FROM nginx:1.13.1

COPY dist/ /usr/share/nginx/html
