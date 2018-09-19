# projectm (projectmvue)

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

### Google Cloud Infrastructure
* Load Balancer (projectm-loadbalancer-development)
  * Static IP (projectm-staticip-development) (35.241.63.177)
  * Health Check (projectm-lbhealthcheck-development)
  * Backend Service (projectm-backendservice-development)
    * Instance Group (projectm-instancegroup-development)
      * Instance Template (projectm-instancetemplate-development)
        * gcr.io/projectmvue/development:latest
      * Health Check (projectm-ighealthcheck-development)

### Docker build
docker build -t peterchang04/projectm .
docker push peterchang04/projectm
docker run -it -v %cd%:/app -p 8080:8080 peterchang04/projectm
