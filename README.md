# projectm

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```

### Docker build
docker build -t peterchang04/projectm .
docker push peterchang04/projectm
docker run -it -v %cd%:/app -p 8080:8080 peterchang04/projectm
