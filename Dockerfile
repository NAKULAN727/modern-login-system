FROM php:8.2-apache

RUN a2enmod rewrite

# Install PHP extensions
RUN apt-get update && apt-get install -y libzip-dev unzip \
    && docker-php-ext-install mysqli

# MongoDB extension
RUN pecl install mongodb \
    && docker-php-ext-enable mongodb

# Copy project files
COPY . /var/www/html/
WORKDIR /var/www/html/

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install

EXPOSE 80
