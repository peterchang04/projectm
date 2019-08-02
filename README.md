### Dev Environment setup
## NOTE: -> indicates to type the line (minus ->)  into the command line
* install atom.io (64bit)
  * install package "language-vue"
* install git for windows (64bit)
  * use Atom as default editor
  * Git from the command line and also from 3rd party software
  * all other default options
* clone projectm from repo into c:/projectm (*optional*)
  -> cd c:/
  -> git clone https://github.com/peterchang04/projectm
* checkout the development branch
  -> cd c:/projectm
  -> git checkout development
* ask peter to add to github as collaborator
* install nodejs
* install yarn for windows
  https://yarnpkg.com
* build out projectm using yarn
  -> cd c:/projectm
  -> yarn
* in atom, add project folder (File > Add Project Folder) c:/projectm
* install docker for windows
  * create a login
* install gcloud, using versioned archives (windows 64 bit + python)
  * extract google-cloud-sdk folder to c:/google-cloud-sdk (prevents PATH from being possibly too long)
  * add C:\google-cloud-sdk\bin to System PATH variables
* install docker-credential-helper
  -> gcloud components install docker-credential-gcr
* configure gcloud auth for accessing Google Container Registry
  -> gcloud auth configure-docker
  (if gcloud doesn't work) -> docker-credential-gcr configure-docker
* login to gcloud
  -> gcloud auth login
* add project to gcloud
  -> gcloud config set project projectm-238622
* add auth to gcloud (your gmail)
  -> gcloud auth login myaccount@gmail.com
* work with Peter to add your gmail account to GCP storage permissions
  * ?? not sure if necessary
    * CGP > Storage > Browser > artifacts.projectmvue.appspot.com
    * add member (your gmail)
    * assign role: Storage Object Viewer
* launch project using /launchDocker.bat
  * docker may ask for permission to access c:/

### Other software
* Install Discord
  * create an account first, or the join channel flow can be tricky
  * https://discord.gg/GK6Dzjk

### Google Cloud Infrastructure
* Cloud Build trigger
  - trigger type: branch
  - branch: development
  - build configuration: cloud build configuration file
  - cloud build configuration file location: / cloudbuild.yaml
  - substitution variables
    - \_APIROOT: http:/35.190.55.1
    - \_ENV: development
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
  - healthcheck: (projectm-ighealthcheck-development)
    - port: 80
    - timeout: 5s
    - check interval: 10s
    - unhealthy threshold: 3 attempts
  - initial delay: 300

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
docker pull gcr.io/projectm-238622/local:latest
docker run -it -v %cd%:/app -p 80:80 gcr.io/projectm-238622/local:latest
docker build -t gcr.io/projectm-238622/local -f Dockerfile_local .
docker push gcr.io/projectm-238622/local

### to connect to docker container
docker exec -it <container_name> /bin/sh

### ISSUES
- after trying to launch Docker, Yarn says package.json is not found (suggesting -v is not working)
  - Windows Firewall has somehow broken Docker filesharing
