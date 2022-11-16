pipeline {
    agent any

    environment {
        DOTENV = credentials('dotenv-websocket-ihold')
    }

    stages {
        stage('Environments') {
            steps {
                sh "rm -f .env.local"
                sh 'cp $DOTENV .env.local'
            }
        }
        stage('Stop Services') {
            steps {
                sh "docker stop ihold_micro_socket_nginx || true"
                sh "docker stop ihold_micro_socket || true"
            }
        }
        stage('Build and start') {
            steps {
                sh "docker-compose -f docker-compose.staging.yaml up -d --build"
            }
        }
    }
}