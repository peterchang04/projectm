cd C:/projectm
docker run -it -v %cd%:/app -p 80:80 gcr.io/projectmvue/local:latest
