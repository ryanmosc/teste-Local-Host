FROM nginx:alpine

# Apaga o conteúdo padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia seus arquivos estáticos
COPY . /usr/share/nginx/html

# Expõe a porta 80 dentro do container
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
