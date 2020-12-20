pipeline {

  agent none

  environment {
    DOCKER_IMAGE = "ziga/ziga_tool_v2"
  }

  stages {

    stage("build") {
      agent { node {label 'master'}}
      environment {
        DOCKER_TAG="${GIT_BRANCH.tokenize('/').pop()}-${GIT_COMMIT.substring(0,7)}"
      }
      steps {
        sh "docker rmi ${DOCKER_IMAGE}:build || true"
        sh "docker build -t ${DOCKER_IMAGE}:build ."
      }
    }


    stage("deploy") {
      agent { node {label 'master'}}
      environment {
        DOCKER_TAG="${GIT_BRANCH.tokenize('/').pop()}-${GIT_COMMIT.substring(0,7)}"
        SSH_AUTH="allstaging@103.130.218.177"
        CONNECT="ssh -o StrictHostKeyChecking=no ${SSH_AUTH}"
        DIR="~/ziga_tool"
      }
      steps {
        sshagent(credentials : ['SSH_ALL_STAGING']) {
          sh "${CONNECT} 'mkdir -p ${DIR}' || true"
          sh "scp -r -o StrictHostKeyChecking=no \"${env.WORKSPACE}/docker-compose.yml\" ${SSH_AUTH}:${DIR}"
          sh "scp -r -o StrictHostKeyChecking=no \"${env.WORKSPACE}/bash-deploy.sh\" ${SSH_AUTH}:${DIR}"

          sh "${CONNECT} 'cd ${DIR} && chmod u+x ./bash-deploy.sh'"
          sh "${CONNECT} 'cd ${DIR} && ./bash-deploy.sh'"
        }
      }
    }
  }

  post {
    success {
      echo "SUCCESSFUL"
    }
    failure {
      echo "FAILED"
    }
  }
}
