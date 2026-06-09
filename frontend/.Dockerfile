# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Kopieer package bestanden en installeer dependencies
COPY package*.json ./
RUN npm install

# Kopieer de rest van de code en build de app
COPY . .
RUN npm run build

# Stage 2: Serve met Nginx
FROM nginx:stable-alpine
RUN cat > /etc/nginx/conf.d/default.conf <<'EOF'
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF
# Kopieer de build output van Angular naar de nginx folder
# Let op: pas '/app/dist/frontend/browser' aan als je folderstructuur anders is na de build
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
