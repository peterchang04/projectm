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
      * Instance Template (prjm-it-dev:$revision_id)
        * gcr.io/projectmvue/development:$revision_id
      * Health Check (projectm-ighealthcheck-development)

### Docker build
docker pull gcr.io/projectmvue/local:latest
docker run -it -v %cd%:/app -p 80:80 gcr.io/projectmvue/local:latest
docker build -t gcr.io/projectmvue/local -f Dockerfile_local
docker push gcr.io/projectmvue/local
