export interface Project {
  title: string;
  techStack: string[];
  description: string[];
  link?: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  location: string;
  details?: string[];
}

export const resumeData = {
  personalInfo: {
    name: "Daya Lokesh Duddupudi",
    email: "duddupudidayalokesh@gmail.com",
    phone: "+353 894140764",
    location: "Dublin, Ireland",
    linkedin: "LinkedIn", // Placeholder, would need actual URL if available
    role: "Software Engineer | Backend Specialist | Distributed Systems",
    summary: "Master of Science in Computer Science from Trinity College Dublin with a strong foundation in distributed systems, backend architecture, and cloud computing. Experienced in building scalable microservices, IoT systems, and privacy-preserving machine learning frameworks using Python, FastAPI, and AWS/Azure."
  },
  projects: [
    {
      title: "Distributed Road Capacity Booking System",
      techStack: ["Python", "FastAPI", "PostgreSQL", "PostGIS", "SQLAlchemy"],
      description: [
        "Engineered distributed microservices architecture with central coordinator and regional managers, enabling scalable road capacity booking across multiple geographical regions with 99.5% consistency.",
        "Implemented two-phase commit protocol (reserve/confirm) ensuring ACID properties for cross-region transactions, handling 1,000+ concurrent booking requests with zero data corruption.",
        "Integrated geospatial database (PostgreSQL/PostGIS) with GeoAlchemy2 and Shapely, optimising road segment queries by 60% through spatial indexing and reducing average query time to under 200ms.",
        "Deployed Open Source Routing Machine (OSRM) API for dynamic route calculations, processing real-world road networks with 150,000+ segments."
      ]
    },
    {
      title: "Cloud-Architected IoT System for Wildfire Detection",
      techStack: ["C++", "ESP32", "LoRa", "Azure", "FastAPI"],
      description: [
        "Prototyped distributed IoT network with 8 heterogeneous edge devices for real-time wildfire detection, integrating temperature (AM2302), smoke (MQ-2) sensors, and ESP32-EYE cameras.",
        "Developed embedded firmware in C++/Arduino for ESP32 microcontrollers, implementing dual-communication strategy using Wi-Fi and LoRa mesh network, achieving 2km+ range in remote areas.",
        "Architected event-driven Azure backend with IoT Hub, Event Hubs, and Functions for scalable data ingestion, designed to process 10,000+ sensor readings per minute.",
        "Designed automated alerting pipeline using Azure Notification Hubs, enabling real-time emergency response triggers."
      ]
    },
    {
      title: "LEO Satellite Network Simulation for Offshore Wind Telemetry",
      techStack: ["Python", "Flask", "RSA", "NumPy", "Leaflet.js"],
      description: [
        "Simulated Low Earth Orbit satellite constellation with 12 satellites relaying offshore wind farm data, modelling realistic propagation delays, signal noise, and network topology changes.",
        "Implemented dynamic routing algorithm using weighted Dijkstra's approach, optimising data paths based on real-time link quality (SNR/BER) and reducing average latency by 35%.",
        "Secured data transmission with 2048-bit RSA encryption and Hamming (7,4) forward error correction, achieving 99.8% data integrity across simulated 500km+ transmission distances.",
        "Built Flask web dashboard with Leaflet.js and Chart.js visualisations."
      ]
    },
    {
      title: "Sustainable City Management Platform",
      techStack: ["Django", "PostgreSQL", "Docker", "AWS", "Nginx", "Celery", "Redis"],
      description: [
        "Deployed full-stack platform on AWS EC2 with Docker containerisation and Nginx reverse proxy, implementing SSL/TLS protocols for end-to-end encryption and serving 500+ concurrent users.",
        "Architected automated bus rerouting algorithm and RESTful API processing real-time congestion data, reducing average commute times by 18% across 200+ bus routes.",
        "Engineered asynchronous data aggregation pipeline using Celery and Redis, processing 100,000+ transit data points hourly and reducing dashboard load times by 55%.",
        "Developed interactive heatmap visualisations and trend analysis dashboard with Django and PostgreSQL."
      ]
    }
  ] as Project[],
  experience: [
    {
      company: "National Institute of Technology Arunachal Pradesh",
      role: "Research Intern",
      period: "03/2023 - 04/2023",
      location: "Jote, India",
      description: [
        "Architected privacy-preserving machine learning framework using Federated Learning and Blockchain schemas, enabling verifiable model training across 50+ distributed nodes without exposing sensitive medical data.",
        "Co-authored IEEE publication on Homomorphic Re-encryption techniques, reducing data exposure risk by 85% while maintaining 94% model accuracy for medical diagnosis applications."
      ]
    },
    {
      company: "Anna University",
      role: "Research Intern",
      period: "12/2022 - 01/2023",
      location: "Chennai, India",
      description: [
        "Developed Convolutional Neural Network (CNN) model achieving 89% accuracy in signature forgery detection, processing 5,000+ signature samples.",
        "Optimised deep learning architecture through hyperparameter tuning and data augmentation, reducing false positive rate by 32%.",
        "Implemented preprocessing pipeline using OpenCV and NumPy, accelerating training time by 40% through efficient image normalisation."
      ]
    }
  ] as Experience[],
  education: [
    {
      institution: "Trinity College Dublin",
      degree: "Master of Science in Computer Science, Future Networked Systems",
      period: "09/2024 - Present",
      location: "Dublin, Ireland",
    },
    {
      institution: "National Institute of Technology, Arunachal Pradesh",
      degree: "Bachelors of Technology, Computer Science and Engineering",
      period: "12/2020 - 05/2024",
      location: "Jote, India",
      details: ["Graduated with 8.00/10.00 GPA"]
    }
  ] as Education[],
  skills: {
    languages: ["Python", "C/C++", "SQL", "JavaScript", "HTML/CSS", "Matlab"],
    frameworks: ["FastAPI", "Django", "Flask", "React", "TensorFlow", "Keras", "Scikit-learn"],
    developerTools: ["Git", "Docker", "AWS", "Azure", "Google Cloud", "Linux", "Nginx", "VS Code"],
    libraries: ["NumPy", "pandas", "SQLAlchemy", "GeoAlchemy2", "Shapely", "OpenCV", "Matplotlib", "Celery", "Redis"]
  },
  publications: [
    "Privacy-Preserving Sensitive Data on Medical Diagnosis using Federated Learning and Homomorphic Re-encryption, IEEE (06/2023)",
    "Privacy-Preserving and Verifiable Decentralised Federated Learning, IEEE (06/2023)"
  ]
};
