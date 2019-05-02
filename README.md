### Dev Environment setup
* install atom.io (64bit)
* install git for windows (64bit)
  * use Atom as default editor
  * Git from the command line and also from 3rd party software
  * all other default options
* install docker for windows
  * create a login
* install gcloud, using versioned archives
  * extract google-cloud-sdk folder to c:/google-cloud-sdk (prevents PATH from being possibly too long)
  * add C:\google-cloud-sdk\bin to System PATH variables
  * windows 64 bit + python
* install docker-credential-helper
  -> gcloud components install docker-credential-gcr
* configure gcloud auth for accessing Google Container Registry
  -> docker-credential-gcr configure-docker
  -> gcloud auth configure-docker
* login to gcloud
  -> gcloud auth login
* work with Peter to add user to Google Cloud project(s)
* launch project using /launchDocker.bat

### Other software
* Install slack
  * pakchang.slack.com


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
