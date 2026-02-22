## Description

Community is a platform designed to support local communities through digital tools and services.

The platform provides functionality to:
* Create and manage communities
* Invite and manage community members
* Share notices and event schedules
* Connect members through skills sharing and help requests
* Facilitate community communication via chat

## Solution Architecture

This solution consists of multiple components:
* **Community Web API**: REST API backend service built with NestJS
* **Database**: PostgreSQL for data persistence
* **Future Components**: Web frontend, mobile app, and additional services

## Project Goals
* Build a comprehensive community management platform
* Support local community organization and engagement
* Provide scalable, maintainable architecture for community services
* Demonstrate modern development practices and patterns

## Configuration

### Dev Container Environment Variables (.env.secrets)

The dev container requires environment variables for local development. Create a `.env.secrets` file in the **parent directory** (one level up from the project root) to avoid accidentally committing it to version control.

```bash
# Create the file at: /workspaces/.env.secrets (parent directory)
# This keeps secrets outside the project repository

# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=community_db
```

**Important**: 
- The `.env.secrets` file is used exclusively by the dev container
- Place it in the parent directory to prevent accidental commits to version control
- The dev container will automatically load these variables during development

## Business flows

* Each instance of Community portal should have own Portal Admin
* The Portal Admin creates a new community
* The Portal Admin becomes an Community admin for the community
* Portal Admin Invite a new Member to the community
* The member accept invitation and fill contact information
* The Portal Admin assigns the member as Community admin
* The community admin invites a new member