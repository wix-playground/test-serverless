FROM docker-repo.wixpress.com/wix-bootstrap-monorepo:stable

# Install Tini to prevent orphans, zombies, etc...
USER root
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /opt/tini
RUN chmod +x /opt/tini
ENTRYPOINT ["/opt/tini", "--"]


USER deployer

ENV AMBASSADOR_EXPERIMENT_GRPC_EXPERIMENTAL_SUPPORT true
ENV AMBASSADOR_SINGLE_INSTANCE true
ENV WNP_FT_HIST_ZEROS true
ENV UV_THREADPOOL_SIZE 16
ENV NODE_OPTIONS="--unhandled-rejections=warn"
ENV WNP_FT_EXPRESS_ABORT_ON_ERROR_WITH_PARTIAL_RESPONSE true
ENV DISABLE_MYSQL_DATASTORE true
ENV DOCKER_MODE true
ENV DEBUG wix:*

RUN npm config set registry https://npm.dev.wixpress.com && \
    rm /templates/wix-bootstrap-mysql.xml.erb && \
    sed --in-place 's/@artifact_id/\"com.wixpress.platform.serverless-runtime-server\"/g' /templates/wix-bootstrap-s2s-signer.json.erb

CMD ["wix-cluster-runner", "./node_modules/@wix/serverless-runtime-server", ">", ">(tee -a /logs/stdout.log)", "2>", ">(tee -a /logs/stderr.log", ">&2"]
