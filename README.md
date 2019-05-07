### Dev Environment setup
* install atom.io (64bit)
  * install package "language-vue"
* install git for windows (64bit)
  * use Atom as default editor
  * Git from the command line and also from 3rd party software
  * all other default options
* clone projectm from repo
  -> git clone https://github.com/peterchang04/projectm
* install nodejs
* install yarn for windows
  https://yarnpkg.com
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
  * Backend Service (projectm-backendservice-development)
    - protocol: HTTP
    - backend type: Instance groups
    - region: us-west1
    - instance group: projectm-instancegroup-development
    - cloud CDN: NO
    - health check: projectm-lbhealthcheck-development
  * Frontend service: projectm-frontendservice-development
    - protocol: HTTP
    - network service tier: standard
    - IP address: static (35.212.226.50) - projectm-staticip-development
    - 35.212.226.50 pointed to http://projectm.peterchang.rocks @ godaddy.com
    - port: 80
  * Health Check (projectm-lbhealthcheck-development)
    - protocol: tcp
    - port: 80
    - proxy protocol: none
    - request: <blank>
    - response: <blank>
    - health criteria: default

* Instance Group (projectm-instancegroup-development)
  - port name: http (probably from Load Balancer)
  - port numbers: 80
  - instance template: prjm-itmp-dev-.... (from cloudbuild)
    - container: gcr.io/projectm-238622/development:$revision_id
  - target cpu usage: 75
  - minimum number of instances: 1
  - maximum number of instances: 2
  - cooldown period: 60
  - initial delay: 300
  - healthcheck: (projectm-ighealthcheck-development)
    - port: 80
    - timeout: 5s
    - check interval: 10s
    - unhealthy threshold: 3 attempts

* IAM
  * 734495218776@cloudbuild.gserviceaccount.com
    * Roles
      - Cloud Build Service Account
      - Compute Admin
      - Service Account User

* VPC Network
  * Firewall Rule: projectm-firewall-in-development
    - direction: ingress
    - targets: specified target tags
    - target tags: http
    - source ip ranges: 0.0.0.0/0
    - protocols and ports: tcp:80
  <!-- * Firewall Rule: projectm-firewall-healthcheck-development
    - direction: ingress
    - targets: specified target tags
    - target tags: http
    - source ip ranges: 130.211.0.0/22, 35.191.0.0/16
    - protocols and ports: tcp:80 -->

### Docker build
docker pull gcr.io/projectmvue/local:latest
docker run -it -v %cd%:/app -p 80:80 gcr.io/projectmvue/local:latest
docker build -t gcr.io/projectmvue/local -f Dockerfile_local
docker push gcr.io/projectmvue/local

### to connect to docker container
docker exec -it <container_name> /bin/sh


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
