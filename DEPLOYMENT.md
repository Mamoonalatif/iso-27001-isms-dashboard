# ISO 27001 ISMS Dashboard - Deployment Guide

## Local Development

### Prerequisites
- Node.js 16 or higher
- npm package manager

### Quick Start
```bash
git clone <repository-url>
cd iso27001-isms-dashboard
npm install
npm start
```

### Environment Variables
Create a `.env` file in the root directory:
```
NODE_ENV=development
PORT=3000
SESSION_SECRET=your-secret-key-here
```

## Production Deployment

### Option 1: Heroku Deployment

1. **Install Heroku CLI**
2. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SESSION_SECRET=your-production-secret
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 2: Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - SESSION_SECRET=your-secret-here
    restart: unless-stopped
```

Deploy:
```bash
docker-compose up -d
```

### Option 3: VPS Deployment

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Application Deployment**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd iso27001-isms-dashboard
   
   # Install dependencies
   npm ci --only=production
   
   # Start with PM2
   pm2 start server.js --name "isms-dashboard"
   pm2 startup
   pm2 save
   ```

3. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring and Maintenance

### PM2 Monitoring
```bash
# View logs
pm2 logs isms-dashboard

# Monitor performance
pm2 monit

# Restart application
pm2 restart isms-dashboard

# Update application
git pull origin main
npm ci --only=production
pm2 restart isms-dashboard
```

### Health Checks
```bash
# Check application status
curl -f http://localhost:3000/api/dashboard-stats || echo "Application is down"
```

## Security Considerations

### Production Security Checklist
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Set strong SESSION_SECRET
- [ ] Configure firewall (only ports 22, 80, 443)
- [ ] Regular security updates
- [ ] Enable fail2ban for SSH protection
- [ ] Regular database backups
- [ ] Monitor logs for security events
- [ ] Implement proper user authentication
- [ ] Configure CSP headers properly
- [ ] Enable rate limiting in production

### Environment Hardening
```bash
# UFW Firewall
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable

# Fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Database Migration (Future)

When moving from in-memory to persistent database:

### PostgreSQL Setup
```sql
-- Create database
CREATE DATABASE isms_dashboard;

-- Create user
CREATE USER isms_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE isms_dashboard TO isms_user;
```

### Environment Variables
```bash
DATABASE_URL=postgresql://isms_user:secure_password@localhost:5432/isms_dashboard
```

## Backup Strategy

### Automated Backups
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
rm backup_$DATE.sql
```

### Cron Schedule
```bash
# Daily backups at 2 AM
0 2 * * * /path/to/backup.sh
```

## Performance Optimization

### Production Optimizations
- Enable gzip compression
- Implement Redis for session storage
- Use CDN for static assets
- Database connection pooling
- Implement caching strategy
- Monitor application performance

### Nginx Optimizations
```nginx
# Gzip compression
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

2. **PM2 not starting**
   ```bash
   pm2 kill
   pm2 start server.js --name "isms-dashboard"
   ```

3. **SSL certificate issues**
   ```bash
   sudo certbot renew --dry-run
   ```

4. **High memory usage**
   ```bash
   pm2 restart isms-dashboard
   ```

### Log Analysis
```bash
# Application logs
pm2 logs isms-dashboard

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

## Support and Maintenance

### Regular Maintenance Tasks
1. **Weekly**: Check application logs
2. **Monthly**: Update dependencies
3. **Quarterly**: Security audit
4. **Annually**: Certificate renewal

### Update Process
```bash
# 1. Backup current version
cp -r iso27001-isms-dashboard iso27001-isms-dashboard-backup

# 2. Pull latest changes
git pull origin main

# 3. Install dependencies
npm ci --only=production

# 4. Restart application
pm2 restart isms-dashboard

# 5. Verify deployment
curl -f http://localhost:3000/
```
