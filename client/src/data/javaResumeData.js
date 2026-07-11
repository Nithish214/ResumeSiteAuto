/**
 * Java-focused version of the resume content, shown at /java. Same person,
 * same underlying facts as data/resumeData.js - different emphasis, aimed
 * at Java/backend-focused roles rather than Cloud Ops/SRE roles.
 *
 * education, certifications and navLinks are identical between both
 * versions, so they're imported and re-exported here rather than
 * duplicated - one source of truth for the parts that don't change.
 */
import { education, certifications, navLinks } from "./resumeData.js";

export { education, certifications, navLinks };

export const profile = {
  name: "Nithish Kumar",
  headline: "Java Software Engineer",
  location: "Dublin, Ireland",
  email: "nithish21kumar04@gmail.com",
  phone: "+353 089 985 3696",
  resumeFile: "/resume-java.pdf", // drop your Java-focused PDF into client/public/resume-java.pdf
  heroSummary:
    "I build and ship scalable backend services, APIs, and event-driven systems in Java and Spring Boot - four-plus years turning complex distributed-systems problems into reliable, production-ready software for high-load, real-time platforms.",
  about:
    "Java Software Engineer with 4+ years of focused experience building and supporting scalable backend services, APIs and SaaS platforms in cloud and distributed environments. Strong background in Java and Spring Boot, with hands-on experience in event-driven systems, microservices and service-oriented architectures powering high-load, real-time workflows. Applies OOP, design patterns and close attention to detail to diagnose complex problems, participate in technical analysis, conduct code reviews, and deliver implementations from estimation through production release. Comfortable across relational and document-oriented databases, CI/CD, Docker, Kubernetes, AWS and GCP, with automated testing and mocking frameworks used to maintain quality throughout continuous integration and delivery. Collaborative and proactive, partnering with product teams, analysts and engineers to deliver reliable solutions for global users in fast-paced, agile environments.",
};

export const stats = [
  { label: "Years Experience", value: "4+" },
  { label: "Microservices Shipped", value: "15+" },
  { label: "Latency Reduced", value: "25%" },
  { label: "Production Uptime", value: "99.95%" },
];

export const experience = [
  {
    company: "Jabil",
    role: "Support Engineer - Backend & Distributed Systems",
    location: "Dublin, Ireland",
    dates: "May 2025 – Present",
    current: true,
    points: [
      "Engineered backend capabilities and internal web-facing components for enterprise systems in a fast-paced agile environment.",
      "Designed core data structures and service logic for high-traffic, low-latency distributed systems, cutting average request latency by 25% while preserving correctness under load.",
      "Modernised existing applications by simplifying complex code paths and removing technical debt, reinforcing long-term maintainability.",
      "Strengthened unit, integration and regression coverage with JUnit, lowering defect escape rate by 40% across multiple sprints.",
      "Delivered changes through CI/CD pipelines, coordinating deployments across Dev, Test and Production and cutting rollback frequency by 20%.",
      "Contributed to technical analysis and solution design discussions shaping architecture and performance decisions for new and existing services.",
      "Reviewed code against team standards, identifying defects early and reinforcing consistent version control and branching practices.",
      "Resolved production issues across Linux-based services, TCP/IP networking and distributed dependencies, contributing to 99.95% uptime.",
      "Produced architecture diagrams, deployment instructions and runbooks that improved onboarding and knowledge sharing.",
      "Built internal utilities in Go and Python to automate diagnostics, cutting manual investigation time by 35%.",
    ],
    stack: ["Java", "Distributed Systems", "JUnit", "CI/CD", "Golang", "Linux"],
  },
  {
    company: "Rapid Data Technologies Pvt Ltd",
    role: "Associate Software Engineer - Java & Cloud Services",
    location: "India",
    dates: "August 2020 – October 2023",
    current: false,
    points: [
      "Developed backend features using Java and Spring Boot, owning new features from technical analysis through development, testing and production release.",
      "Built 15+ RESTful microservices with Java Spring Boot, improving system efficiency by roughly 10% and cutting response times by roughly 15% through performance-focused design and query optimisation.",
      "Architected event-driven workflows and asynchronous communication using AWS Lambda, SQS and Kafka, enabling scalable, high-load service integrations.",
      "Worked across PostgreSQL, MySQL, Oracle IMS/RMS, MongoDB and DynamoDB to design schemas, indexes and queries supporting reliable high-volume data flows.",
      "Implemented CI/CD pipelines with Jenkins and GitHub Actions, automating build, test and deployment steps.",
      "Applied OOP principles and design patterns to build maintainable, extensible services, reducing defect rates.",
      "Integrated external APIs including PagerDuty and ServiceNow to support monitoring, incident management and business workflows.",
      "Containerised services with Docker and deployed to Kubernetes (AWS EKS), improving environment consistency by 40%.",
      "Wrote JUnit unit tests and Selenium functional tests, achieving 85%+ coverage on key modules and cutting regressions by 30%.",
      "Partnered with senior engineers on code reviews, refactors and redesigns of core modules to improve performance and scalability.",
    ],
    stack: ["Java", "Spring Boot", "Kafka", "AWS Lambda", "Docker", "Kubernetes"],
  },
];

export const skillGroups = [
  {
    title: "Languages & Paradigms",
    skills: [
      "Java",
      "JavaScript",
      "TypeScript",
      "Python",
      "Golang (utilities)",
      "SQL",
      "C++ (exposure)",
      "Object-oriented design",
      "SOLID principles",
      "Design patterns",
    ],
  },
  {
    title: "Backend & APIs",
    skills: [
      "Java Spring Boot",
      "Node.js",
      "FastAPI",
      "RESTful API design",
      "GraphQL",
      "Microservices",
      "Service-oriented architecture",
      "Event-driven architecture",
      "Kafka",
      "AWS SQS / Lambda",
    ],
  },
  {
    title: "Databases",
    skills: [
      "PostgreSQL",
      "MySQL",
      "Oracle IMS/RMS",
      "MongoDB",
      "DynamoDB",
      "Data modelling",
      "Query optimisation",
      "Performance tuning",
    ],
  },
  {
    title: "Cloud & Infrastructure",
    skills: [
      "AWS (Lambda, API Gateway, SQS, SNS, Batch, EC2, EKS, ECS, S3, Step Functions, Parameter Store, EFS)",
      "Docker",
      "Kubernetes (AWS EKS)",
      "Distributed systems",
      "Cloud-native deployment models",
    ],
  },
  {
    title: "Quality, Testing & CI/CD",
    skills: [
      "Unit testing (JUnit)",
      "Functional/integration testing (Selenium)",
      "TDD",
      "BDD-style validation",
      "Mocking frameworks",
      "Jenkins",
      "GitHub Actions",
      "YAML-based automation",
    ],
  },
  {
    title: "Collaboration & Process",
    skills: [
      "Git & GitHub",
      "Code reviews",
      "Technical analysis & estimation",
      "Agile/Scrum delivery",
      "Jira / ServiceNow",
      "Stakeholder communication",
      "Cross-functional collaboration",
    ],
  },
];

export const projects = [
  {
    name: "Incident Management System",
    tagline: "Java Spring Boot & MySQL",
    description:
      "A Spring Boot application integrating the PagerDuty and ServiceNow APIs to merge and transform incident data according to business rules, storing results in MySQL.",
    points: [
      "Automated previously manual incident reporting and analytics.",
      "Improved accuracy and timeliness of operational data for stakeholders.",
    ],
    stack: ["Java", "Spring Boot", "MySQL", "PagerDuty API", "ServiceNow API"],
  },
  {
    name: "SAMS",
    tagline: "Simple Async Messaging Service - AWS Serverless",
    description:
      "An asynchronous messaging system built on AWS SQS, Lambda, EventBridge, API Gateway and SNS to simplify and scale communication between microservices.",
    points: [
      "Improved decoupling, resiliency and cost efficiency of interservice communication.",
      "Designed around event-driven architecture principles.",
    ],
    stack: ["AWS SQS", "Lambda", "EventBridge", "API Gateway", "SNS"],
  },
  {
    name: "Omni",
    tagline: "AI Digital Memory App (MVP)",
    description:
      "An MVP application using Retrieval-Augmented Generation (RAG) to store user documents, extract insights and answer questions with grounded, source-backed responses.",
    points: [
      "Implemented backend services and APIs in Node.js and Python.",
      "Supported secure search, query and analytics workflows.",
    ],
    stack: ["RAG", "Node.js", "Python", "API Design"],
  },
  {
    name: "Note Extraction API",
    tagline: "Extracting Musical Notes - Python & FastAPI",
    description:
      "A REST API using FastAPI and Python to process audio files and dynamically select the best algorithm for extracting musical notes for each input.",
    points: [
      "Refactored the solution into a reusable Python library.",
      "Published the library on PyPI as a well-packaged, testable component.",
    ],
    stack: ["Python", "FastAPI", "PyPI", "Audio Processing"],
  },
];
