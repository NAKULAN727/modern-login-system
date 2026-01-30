FROM php:8.2-apache

# Install PHP extensions
RUN docker-php-ext-install mysqli

# Install Redis & MongoDB extensions
RUN pecl install redis mongodb \
    && docker-php-ext-enable redis mongodb

# Enable Apache rewrite
RUN a2enmod rewrite

# Copy project files
COPY . /var/www/html/

EXPOSE 80
