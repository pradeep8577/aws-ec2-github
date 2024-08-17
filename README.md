---

# Automated Deployment to AWS EC2 with GitHub Actions

This guide walks you through the process of automatically testing, building, and deploying a Node.js application to an AWS EC2 instance using GitHub Actions. 

## Prerequisites

- AWS account with EC2 access.
- GitHub repository for your project.
- Basic knowledge of Linux command-line interface.

## Steps

### Step 1: Launch an EC2 Instance

1. Log in to your AWS Console.
2. Navigate to the EC2 Dashboard and launch a new EC2 instance.
3. Choose an Ubuntu Server 20.04 LTS AMI or any preferred Linux distribution.
4. Configure instance details, add storage, configure security groups (allow HTTP, HTTPS, and SSH), and launch the instance.

### Step 2: Access the EC2 Instance

1. Use SSH to log in to your EC2 instance:
   ```bash
   ssh -i "your-key.pem" ubuntu@your-ec2-public-ip
   ```

### Step 3: Install Node.js and Nginx

1. Update your package lists:
   ```bash
   sudo apt update
   ```
2. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
3. Install Nginx:
   ```bash
   sudo apt-get install -y nginx
   ```

### Step 4: Push Your Project to GitHub

1. Ensure your project is committed and pushed to your GitHub repository.

### Step 5: Create GitHub Action Workflow

1. In your GitHub repository, create a directory called `.github/workflows/`.
2. Inside that directory, create a YAML file (e.g., `deploy.yml`).
3. Edit the YAML file according to your project’s needs. Below is an example template:

   ```yaml
   name: CI/CD Pipeline

   on:
     push:
       branches:
         - main

   jobs:
     build:
       runs-on: ubuntu-latest

       steps:
         - name: Checkout code
           uses: actions/checkout@v2

         - name: Set up Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '14'

         - name: Install dependencies
           run: npm install

         - name: Test
           run: npm test

         - name: Deploy to EC2
           run: |
             ssh -o StrictHostKeyChecking=no -i "your-key.pem" ubuntu@your-ec2-public-ip << 'EOF'
               cd /path-to-your-project
               git pull origin main
               npm install
               pm2 restart server.js
             EOF
   ```

### Step 6: Set Up GitHub Action on EC2

1. After configuring GitHub Actions, run the following commands on your EC2 instance:
   ```bash
   sudo ./svc.sh install
   sudo ./svc.sh start
   ```

### Step 7: Install PM2 and Run Backend in Background

1. Install PM2 globally:
   ```bash
   npm install pm2 -g
   ```
2. Start your application with PM2:
   ```bash
   pm2 start server.js
   ```

### Step 8: Update GitHub Action to Restart Application on Each Commit

1. Add the following command to your GitHub Action YAML file to restart the application after each commit:
   ```yaml
   - run: sudo pm2 restart server.js
   ```

### Step 9: Configure Nginx

1. Navigate to the Nginx configuration directory:
   ```bash
   cd /etc/nginx/sites-available
   ```
2. Edit the default configuration file:
   ```bash
   sudo nano default
   ```
3. Update the file with the following configuration to proxy requests to your Node.js application:
   ```nginx
   location /api/ {
       proxy_pass http://localhost:8000/;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
   }
   ```
4. Save the file and exit the editor.
5. Restart Nginx to apply the changes:
   ```bash
   sudo systemctl restart nginx
   ```

## Conclusion

You have now set up an automated CI/CD pipeline that tests, builds, and deploys your application to an AWS EC2 instance using GitHub Actions. Every time a commit is made to the `main` branch, your application will be automatically deployed to your EC2 instance.

---

This `README.md` should cover the necessary steps and serve as a guide for deploying Node.js applications to AWS EC2 using GitHub Actions.
