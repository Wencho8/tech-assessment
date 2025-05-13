FROM ruby:3.2.8
LABEL description="AceUp Tech assessment backend docker image"
LABEL version="1.0"
LABEL mantainer="Alejandro Gurovich <alex@rocket-house.com>"

# Install essential dependencies
RUN apt-get update -qq && \
    apt-get install -y \
    build-essential \
    libpq-dev \
    nodejs \
    postgresql-client \
    dos2unix

# Set working directory
WORKDIR /rails

# Copy Gemfile and Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Copy the environment variables
COPY .env ./

# Install gems
RUN bundle install

# Install foreman
RUN gem install foreman

# Copy the entrypoint script and make it executable
COPY bin/docker-entrypoint /docker-entrypoint
RUN dos2unix /docker-entrypoint && chmod +x /docker-entrypoint

ENTRYPOINT ["/docker-entrypoint"]
EXPOSE 3000