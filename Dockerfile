FROM       jackhu/jenkins-deploy-nodejs:7
LABEL MAINTAINER Jack Hu <hello@jackhu.top>

EXPOSE  8800

CMD ["npm","run","pm2-start"]