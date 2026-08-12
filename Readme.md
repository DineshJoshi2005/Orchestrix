# Orchestrix — Multi-Agent AI Platform

Orchestrix is a production-oriented **multi-agent AI platform** that combines Large Language Models (LLMs), LangChain, LangGraph, Retrieval-Augmented Generation (RAG), Redis-based conversational memory, and a microservices backend to provide specialized AI capabilities through a unified interface.

The platform is designed around modular AI agents, stateful workflows, persistent conversation context, and independently deployable backend services.

## 🚀 Live Demo

**Frontend:**  
https://orchestrix-frontend.vercel.app

---

## ✨ Features

- 🤖 Multi-agent AI architecture
- 🧠 LangGraph-based stateful AI workflows
- 🔗 LangChain LLM integration
- 📚 Retrieval-Augmented Generation (RAG)
- 🧠 Redis-based conversational context and memory
- 💬 Persistent conversations and chat history
- 💻 AI-powered code generation
- 📄 AI-powered PDF generation
- 📦 Generated artifacts and files
- 🔐 Authentication and authorization
- 💳 Credit-based usage / billing system
- 🧩 Microservices backend architecture
- 🌐 RESTful APIs
- 🐳 Dockerized backend services
- ☁️ AWS ECS/Fargate deployment
- 📦 Amazon ECR container registry
- 🔄 GitHub Actions CI/CD
- ⚛️ React frontend
- 🗃️ Redux state management
- 🚀 Vercel frontend deployment

---

# 🏗️ Architecture

Orchestrix follows a modular **microservices architecture** where individual backend responsibilities are separated into independently deployable services.

```text
                         ┌─────────────────────┐
                         │      React App      │
                         │      + Redux        │
                         └──────────┬──────────┘
                                    │
                                    │ HTTPS
                                    ▼
                         ┌─────────────────────┐
                         │       Gateway       │
                         │    Express.js       │
                         └──────────┬──────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐──────────────────────┐
             │                      │                      │                      │
             ▼                      ▼                      ▼                      ▼
     ┌──────────────┐       ┌──────────────┐       ┌──────────────┐      ┌─────────────────────┐
     │ Auth Service │       │ Chat Service │       │ Agent Service│      │  Billing Service    │
     └──────────────┘       └──────────────┘       └───────┬──────┘      └─────────────────────┘
                                                            │
                                                            ▼
                                                   ┌─────────────────┐
                                                   │   LangGraph     │
                                                   │    Workflow     │
                                                   └────────┬────────┘
                                                            │
                              ┌─────────────────────────────┼──────────────────┐
                              │                             │                  │
                              ▼                             ▼                  ▼
                       ┌────────────┐              ┌────────────┐       ┌────────────┐
                       │ LangChain  │              │    RAG     │       │   Redis    │
                       │    LLM     │              │ Pipeline   │       │   Memory   │
                       └────────────┘              └────────────┘       └────────────┘


                                         AWS ECS / Fargate + Amazon ECR
```
# 🤖 Multi-Agent AI System

The core of Orchestrix is a LangGraph-based agent workflow.Instead of sending every user request directly to a single LLM, Orchestrix uses specialized AI agents to process different types of tasks.

Examples include:

Coding Agent
PDF Agent
Other specialized AI agents

A simplified workflow looks like:
```text
                    User Request
                         │
                         ▼
                 ┌───────────────┐
                 │ Agent Workflow│
                 │   LangGraph   │
                 └───────┬───────┘
                         │
            ┌────────────┼─────────────┐
            │            │             │
            ▼            ▼             ▼
       Coding Agent   PDF Agent    Other Agents
            │            │             │
            └────────────┼─────────────┘
                         ▼
                    LLM Response
```
Each agent is responsible for specialized AI processing and can interact with the shared workflow state.

# 🧠 LangGraph Workflow

LangGraph is used to build stateful AI workflows.

The workflow maintains application state while different nodes perform specialized operations.

A simplified flow:
```text
                    User Request
                        │
                        ▼
                    Initialize State
                        │
                        ▼
                    Determine Agent
                        │
     ├───────────────┬───────────────┬───────────────┐
     │               │               │               │
     ▼               ▼               ▼               ▼
Coding Agent      PDF Agent       RAG Agent      Other Agent
     │               │               │               │
     ▼               ▼               ▼               ▼
LLM Processing   LLM Processing   LLM Processing   LLM Processing
     │               │               │               │
     └───────────────┴───────────────┴───────────────┘
                         │
                         ▼
                   Update State
                         │
                         ▼
                   Save Context
                         │
                         ▼
                  Return Response
```
# 🔗 LangChain and LLM Integration

Orchestrix uses LangChain to integrate Large Language Models into the agent workflows.

LangChain is used as the LLM interaction layer while LangGraph handles the workflow and state orchestration.

The general flow is:
```text
                User Request
                    │
                    ▼
                LangGraph Workflow
                    │
                    ▼
                Specialized Agent
                    │
                    ▼
                LangChain
                    │
                    ▼
                    LLM
                    │
                    ▼
                AI Response     
```
# 📚 Retrieval-Augmented Generation (RAG)

Orchestrix uses Retrieval-Augmented Generation (RAG) to allow users to upload PDFs and provide external data as additional knowledge for the AI. The uploaded information is processed and relevant context is retrieved when required, allowing the LLM to generate responses grounded in the user's provided data.

# 🧠 Redis Context Memory

Redis is used for maintaining AI-related conversational context and memory.

The general flow is:
```text
        User Message
            │
            ▼
        Retrieve Context from Redis
            │
            ▼
        LangGraph State
            │
            ▼
        LLM / Agent
            │
            ▼
        Updated Context
            │
            ▼
           Redis
```
# 🧩 Backend Architecture

The backend follows a microservices architecture with independently deployable services.
```text
backend/
│
├── gateway/
│
└── services/
    │
    ├── auth/
    │
    ├── chat/
    │
    ├── agent/
    │
    └── billing/
```
**Gateway Service**

The Gateway acts as the entry point for frontend API requests and routes requests to the appropriate backend service.

**Authentication Service**

Responsible for authentication-related functionality including:

User registration
Login


**Chat Service**

Responsible for:

Conversations
Messages
Chat history
Persisting AI interactions

**Agent Service**

The AI processing layer responsible for:

Agent routing
LangGraph workflows
LangChain LLM integration
AI context
Specialized AI agents
Artifact generation
RAG-based processing

**Billing Service**

Responsible for:

Credit management
Usage tracking
Agent limits
Credit deduction


# ⚛️ Frontend Architecture

The frontend is built using React with Redux for centralized state management.

The frontend manages:

Authentication state
Conversations
Messages
Selected conversations
AI responses
Generated artifacts
Loading states
Application state

A simplified frontend flow:
```text
                    React Application
                           │
                           ▼
                    Redux Store
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
     Conversations      Messages        Artifacts
          │                │                │
          └────────────────┼────────────────┘
                           ▼
                       UI Updates
```                       
# 🐳 Docker

Each backend service is containerized independently using Docker.
```text
Auth Service
     │
     ▼
Docker Image
     │
     ▼
Amazon ECR
     │
     ▼
AWS ECS/Fargate
```
The same deployment model is used for the other backend services.

Containerization provides isolated and reproducible environments for each microservice.

# ☁️ AWS Deployment

The backend services are deployed using Amazon ECS with AWS Fargate.

Docker images are stored in Amazon ECR.

The deployment architecture is:
```text
GitHub
   │
   ▼
GitHub Actions
   │
   ▼
Docker Build
   │
   ▼
Amazon ECR
   │
   ▼
AWS ECS/Fargate
   │
   ├── Gateway
   ├── Auth
   ├── Chat
   ├── Agent
   └── Billing
```
**AWS services and infrastructure used include:**

Amazon ECS
AWS Fargate
Amazon ECR
Amazon S3
Redis
VPC
Security Groups
IAM


# 🔄 CI/CD Pipeline

Orchestrix uses GitHub Actions for automated backend deployment.

The deployment process includes:
```text
Git Push
   │
   ▼
GitHub Actions
   │
   ▼
Build Docker Image
   │
   ▼
Tag Docker Image
   │
   ▼
Push Image to Amazon ECR
   │
   ▼
Update ECS Service
   │
   ▼
Deploy New Container
```
The CI/CD workflow uses path-based deployment so backend services can be deployed independently when their corresponding code changes.

For example:
```text
Agent code changes
        │
        ▼
Agent deployment workflow
        │
        ▼
Build Agent image
        │
        ▼
Push Agent image to ECR
        │
        ▼
Deploy Agent ECS service
```
This avoids unnecessarily redeploying unrelated services.

# 📄 AI-Generated Artifacts

Orchestrix can generate artifacts as part of AI workflows.

For example, the PDF Agent can:
```text
User Request
     │
     ▼
PDF Agent
     │
     ▼
    LLM
     │
     ▼
Structured Content
     │
     ▼
PDF Generation
     │
     ▼
Amazon S3
     │
     ▼
Temporary Download URL
```
Generated files can then be accessed through the application.

# 🔐 Authentication

Orchestrix uses **Firebase Authentication** to provide secure user authentication and social sign-in.

The platform currently supports:

- Google Sign-In
- Firebase Authentication
- Authenticated user sessions
- Secure authentication state management
- Backend authentication verification


Sensitive credentials and secrets are managed using environment variables and deployment secrets rather than being committed to the repository.

# 💳 Credit-Based Usage System

Orchestrix implements a credit-based usage system for controlling AI agent consumption.

The billing service manages:
```text
User
 │
 ▼
Agent Request
 │
 ▼
Check Agent Limit
 │
 ▼
Execute AI Workflow
 │
 ▼
Deduct Credits
 │
 ▼
Store Usage
```
This allows different AI capabilities to be controlled based on user credits and usage limits.

# 🛠️ Technology Stack

**Frontend**
React
Redux
JavaScript
HTML
CSS

**Backend**
Node.js
Express.js
REST APIs
Microservices Architecture

**AI / Generative AI**
Large Language Models (LLMs)
LangChain
LangGraph
Retrieval-Augmented Generation (RAG)
Multi-Agent AI
AI Agent Workflows
Prompt Engineering
Stateful AI Workflows

**Data / Memory / Storage**
Redis
MongoDB
Amazon S3

**DevOps / Cloud**
Docker
Amazon ECS
AWS Fargate
Amazon ECR
GitHub Actions
Vercel
AWS VPC
AWS Security Groups
IAM

# 📂 Project Structure
```text
Orchestrix/
│
├── frontend/
│   │
│   ├── src/
│   ├── components/
│   ├── features/
│   └── redux/
│
├── backend/
│   │
│   ├── gateway/
│   │
│   └── services/
│       │
│       ├── auth/
│       ├── chat/
│       ├── agent/
│       └── billing/
│
├── .github/
│   └── workflows/
│
├── docker-compose.yml
│
└── README.md
```

# 🔒 Security

Sensitive configuration is not committed to the repository.

Environment variables and deployment secrets are used for sensitive configuration such as:

LLM API keys
Database credentials
Redis credentials
AWS credentials
Authentication secrets



# 📈 Engineering Concepts Demonstrated

Orchestrix demonstrates practical implementation of:

Multi-Agent AI Systems
Large Language Model Integration
AI Agent Orchestration
LangGraph State Management
LangChain
Retrieval-Augmented Generation
Conversational AI Memory
Redis
Microservices Architecture
REST API Design
Authentication
Credit-Based Billing
State Management with Redux
Containerization
Docker
Cloud Deployment
AWS ECS/Fargate
Amazon ECR
Amazon S3
GitHub Actions
CI/CD
Vercel Deployment
Cloud Networking
Service Isolation
Independent Microservice Deployment

# 🚀 Future Improvements

Potential future improvements for Orchestrix include:

Infrastructure as Code using Terraform
Kubernetes deployment
Automated observability and monitoring
Distributed tracing
Centralized logging
Advanced RAG pipelines
Agent evaluation and monitoring
Automated testing pipelines
Automatic service scaling
Asynchronous message processing
Production-grade API Gateway
Improved AI agent routing
Advanced AI usage analytics


# 🌐 Live Application

Try Orchestrix:

https://orchestrix-frontend.vercel.app

# 👨‍💻 Author

**Dinesh Joshi**

