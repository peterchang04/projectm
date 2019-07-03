::go to directory
cd C:/projectm

::fetch :latest tag from cloud
docker pull gcr.io/projectm-238622/local:latest

::attempt to remove local images (if exists)
docker rm projectm_local

::start docker container
docker run -it -v %cd%:/app -p 80:80 --name projectm_local gcr.io/projectm-238622/local:latest
