const initialCategories = [
  {
    _id: 'cat-1',
    name: 'Software Development',
    slug: 'software-development',
    description: 'Modern architectures, design patterns, clean code practices, and system engineering.',
    color: 'emerald',
    icon: 'code',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-2',
    name: 'Artificial Intelligence & Machine Learning',
    slug: 'artificial-intelligence-and-machine-learning',
    description: 'LLMs, deep learning models, generative AI architectures, and neural algorithms.',
    color: 'violet',
    icon: 'cpu',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-3',
    name: 'Web and Mobile App Development',
    slug: 'web-and-mobile-app-development',
    description: 'Full stack development with React, Node.js, Next.js, Flutter, and cross-platform UX.',
    color: 'blue',
    icon: 'globe',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-4',
    name: 'Technology & Innovation',
    slug: 'technology-and-innovation',
    description: 'Breakthrough innovations, quantum computing, robotics, and emerging digital frontiers.',
    color: 'amber',
    icon: 'zap',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-5',
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    description: 'Zero trust security, cryptography, vulnerability assessment, and threat mitigation.',
    color: 'rose',
    icon: 'shield',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-6',
    name: 'Cloud Computing',
    slug: 'cloud-computing',
    description: 'Serverless architectures, Kubernetes, AWS/Azure/GCP scaling, and DevOps pipelines.',
    color: 'sky',
    icon: 'cloud',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-7',
    name: 'Industry Insights',
    slug: 'industry-insights',
    description: 'Tech career trajectories, engineering leadership, tech market trends, and startup analysis.',
    color: 'indigo',
    icon: 'trending-up',
    createdAt: new Date().toISOString(),
  },
];

const initialPosts = [
  {
    _id: 'post-1',
    title: 'Architecting Scalable Microservices with Node.js and Event-Driven Systems',
    slug: 'architecting-scalable-microservices-with-nodejs-and-event-driven-systems',
    summary: 'Discover how to decouple high-throughput distributed systems using asynchronous message queues, CQRS, and Node.js best practices.',
    content: `Distributed microservice architectures require deliberate communication patterns to avoid the anti-pattern of distributed monoliths. In this deep dive, we explore how to build resilient systems using event choreography and message brokers like RabbitMQ and Kafka.

### Why Event-Driven Architecture Matters
Traditional REST-based synchronous HTTP communication between internal microservices introduces tight coupling, latency cascading, and brittle failure domains. If service A calls service B, which calls service C, any failure or network hiccup halts the entire transaction.

Event-driven architecture changes this paradigm:
1. **Decoupled Producers and Consumers**: Services emit domain events (e.g., \`OrderPlaced\`, \`PaymentCaptured\`) without caring which services listen.
2. **Asynchronous Backpressure**: Message brokers buffer spikes in traffic, preventing cascading database timeouts.
3. **High Fault Tolerance**: If a consuming service crashes, the message remains safely in the queue until the service restarts.

### Handling Idempotency
One critical requirement in asynchronous event processing is idempotency. Network retries mean consumers will occasionally receive duplicate messages.

\`\`\`javascript
// Example idempotency guard in Express & Redis
async function processOrderEvent(event) {
  const isDuplicate = await redisClient.set(
    \`event:\${event.id}\`, 
    'processed', 
    { NX: true, EX: 86400 }
  );
  if (!isDuplicate) {
    console.log(\`Skipping already processed event: \${event.id}\`);
    return;
  }
  await executeBusinessLogic(event.payload);
}
\`\`\`

### Key Takeaways
When architecting modern Node.js services, start by identifying bounded contexts. Keep shared dependencies minimal, log with structured JSON tracing (such as OpenTelemetry), and build resilient circuit breakers for any inevitable external failure.`,
    category: 'Software Development',
    categorySlug: 'software-development',
    author: 'Rohit Sharma',
    authorRole: 'Principal Systems Architect',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    tags: ['Node.js', 'Microservices', 'Architecture', 'Backend'],
    readTime: 6,
    published: true,
    featured: true,
    views: 1420,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    _id: 'post-2',
    title: 'The Rise of Small Language Models (SLMs) in Enterprise Edge Computing',
    slug: 'the-rise-of-small-language-models-slms-in-enterprise-edge-computing',
    summary: 'Why compact, quantized models running on localized devices are transforming privacy, latency, and operational costs in modern AI deployment.',
    content: `While frontier models with hundreds of billions of parameters dominate the headlines, a quieter revolution is occurring at the edge: Small Language Models (SLMs). Models ranging from 1B to 8B parameters, when fine-tuned on specialized domain knowledge, are delivering remarkable efficiency.

### Advantages of SLMs over Cloud-Gated LLMs
1. **Ultra-Low Latency**: Processing prompts directly on local hardware eliminates network roundtrips, allowing sub-50ms token generation.
2. **Absolute Data Privacy**: Sensitive health records, proprietary source code, and banking data never leave on-premise infrastructure.
3. **Fractional Operational Cost**: Running quantized 4-bit weights on local GPUs or modern NPUs costs virtually nothing compared to million-token API tariffs.

### Quantization Techniques: GGUF & AWQ
Quantization reduces the precision of neural network weights from 16-bit floating point to 4-bit or 8-bit integers with negligible loss in semantic coherence. This allows high-performing models to run directly on laptops, mobile phones, and IoT gateways.

Organizations in 2026 are adopting hybrid setups: deploying SLMs for real-time triage and local categorization, while delegating only multi-hop reasoning tasks to larger cloud LLMs.`,
    category: 'Artificial Intelligence & Machine Learning',
    categorySlug: 'artificial-intelligence-and-machine-learning',
    author: 'Dr. Priya Mehta',
    authorRole: 'AI Research Scientist',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    tags: ['AI', 'Machine Learning', 'Edge Computing', 'SLM'],
    readTime: 5,
    published: true,
    featured: false,
    views: 890,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    _id: 'post-3',
    title: 'Building Modern React Applications with Tailwind CSS and Server Components',
    slug: 'building-modern-react-applications-with-tailwind-css-and-server-components',
    summary: 'A practical guide to structuring performant component hierarchies, maintaining clean state, and writing responsive styling with utility-first CSS.',
    content: `Front-end engineering has matured significantly. Today's web applications must deliver instantaneous first-contentful-paint metrics, seamless client-side reactivity, and responsive design systems across any screen size.

### Why Tailwind CSS Accelerates Development
Tailwind CSS provides low-level utility classes that eliminate context switching between JSX and separate CSS files:
- **No Class Name Fatigue**: You don't have to invent names like \`.blog-card-container-inner-wrapper\`.
- **Tiny Production Bundles**: Modern bundlers purge unused classes, leaving CSS bundles that are typically smaller than 15KB.
- **Consistent Design Tokens**: Spacing, typography, and color scales are locked to intentional variables, preserving visual harmony.

\`\`\`jsx
export function PostCard({ title, category, date }) {
  return (
    <article className="group rounded-2xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-teal-500 transition-all duration-300">
      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-teal-50 text-teal-700">
        {category}
      </span>
      <h3 className="mt-3 text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-500">{date}</p>
    </article>
  );
}
\`\`\`

### Clean State Management
Prefer local React state (\`useState\`, \`useReducer\`) and React Context for application-wide concerns like authentication or theme toggling. Keep your components modular, testable, and focused on single responsibilities.`,
    category: 'Web and Mobile App Development',
    categorySlug: 'web-and-mobile-app-development',
    author: 'Rohit Sharma',
    authorRole: 'Frontend Lead',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
    tags: ['React', 'Tailwind CSS', 'Frontend', 'JavaScript'],
    readTime: 4,
    published: true,
    featured: false,
    views: 1120,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    _id: 'post-4',
    title: 'Zero Trust Architecture: Securing Enterprise Cloud Infrastructure in 2026',
    slug: 'zero-trust-architecture-securing-enterprise-cloud-infrastructure-in-2026',
    summary: 'Never trust, always verify: implementing continuous authentication, micro-segmentation, and ephemeral credentials for modern security.',
    content: `Perimeter-based castle-and-moat security is obsolete. With remote engineering teams, distributed cloud workloads, and multi-tenant SaaS tools, the internal network must be treated as hostile as the public internet.

### The Three Pillars of Zero Trust
1. **Explicit Verification**: Authenticate and authorize based on all available data points—user identity, device health, location, data classification, and anomalies.
2. **Principle of Least Privilege**: Limit user and service access with Just-In-Time (JIT) and Just-Enough-Access (JEA) policies.
3. **Assume Breach**: Minimize the blast radius by segmenting networks, encrypting end-to-end data in transit and at rest, and leveraging continuous audit logging.

### Implementing Mutual TLS (mTLS) in Service Meshes
In Kubernetes clusters, services should authenticate each other using cryptographic identity certificates rotated every few hours via tools like Istio or Linkerd.

By shifting security from the perimeter to individual identities and connections, organizations protect mission-critical data against lateral movement attacks.`,
    category: 'Cybersecurity',
    categorySlug: 'cybersecurity',
    author: 'Alexandre Dubois',
    authorRole: 'Chief Information Security Officer',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    tags: ['Cybersecurity', 'Zero Trust', 'Cloud Security', 'DevSecOps'],
    readTime: 6,
    published: true,
    featured: false,
    views: 745,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    _id: 'post-5',
    title: 'Mastering Kubernetes Multi-Cluster Management and GitOps with ArgoCD',
    slug: 'mastering-kubernetes-multi-cluster-management-and-gitops-with-argocd',
    summary: 'How declarative Git repositories become the single source of truth for automated deployments across hybrid cloud environments.',
    content: `Managing individual Kubernetes clusters through manual \`kubectl\` commands is error-prone and unscalable. Modern cloud engineering relies on GitOps to synchronize infrastructure state with declarative version control.

### What is GitOps?
GitOps is an operational framework where:
- The entire desired state of the cluster is defined declaratively in Git.
- Pull requests serve as the approval gate for infrastructure changes.
- An automated agent (such as ArgoCD) detects configuration drift and reconciles the cluster state with Git.

### Multi-Region High Availability
By defining clusters with Kustomize or Helm charts, platform teams can replicate identical production clusters in North America, Europe, and Asia-Pacific within minutes, ensuring zero downtime even during regional cloud outages.`,
    category: 'Cloud Computing',
    categorySlug: 'cloud-computing',
    author: 'Elena Rostova',
    authorRole: 'Site Reliability Engineering Lead',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    tags: ['Cloud', 'Kubernetes', 'DevOps', 'GitOps'],
    readTime: 5,
    published: true,
    featured: false,
    views: 980,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
  {
    _id: 'post-6',
    title: 'The Evolution of Software Engineering Roles in the Age of Autonomous AI Agents',
    slug: 'the-evolution-of-software-engineering-roles-in-the-age-of-autonomous-ai-agents',
    summary: 'From writing repetitive boilerplate code to systems orchestration: how developers are leveling up their engineering impact.',
    content: `Generative AI and agentic coding workflows are not replacing developers—they are dramatically raising the abstraction ceiling. Where engineers previously spent hours wiring boilerplate CRUD endpoints and writing regex patterns, agents now handle these tasks in seconds.

### The New Core Skills for Engineers
1. **System Design & Verification**: Designing fault-tolerant distributed architectures, evaluating trade-offs, and defining precise acceptance criteria.
2. **Context Engineering**: Crafting clear domain models, OpenAPI schemas, and documentation that autonomous tools can reason about accurately.
3. **Security and Edge-Case Rigor**: Catching subtle race conditions, auth bypasses, and performance bottlenecks that statistical models miss.

Software engineering is evolving from typing lines of code into directing and verifying software synthesis. Those who understand deep fundamentals will build systems at speeds unimaginable a decade ago.`,
    category: 'Industry Insights',
    categorySlug: 'industry-insights',
    author: 'Rohit Sharma',
    authorRole: 'Technology Director',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Careers', 'AI Agents', 'Future of Work', 'Leadership'],
    readTime: 5,
    published: true,
    featured: false,
    views: 1650,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    _id: 'post-7',
    title: 'Quantum Advantage: Navigating Practical Quantum Computing Milestones',
    slug: 'quantum-advantage-navigating-practical-quantum-computing-milestones',
    summary: 'A look into how superconducting qubits, neutral atoms, and quantum error correction are moving from academic labs to commercial viability.',
    content: `Quantum computing is transitioning from physics experimentation to systems engineering. As physical qubit counts cross into the thousands and logical qubits become resilient via surface codes, commercial applications in chemistry, materials science, and optimization are within reach.

### Overcoming Quantum Decoherence
The primary obstacle in quantum computers has been environmental noise causing decoherence. In 2026, advances in fault-tolerant quantum error correction (QEC) allow error suppression by grouping physical qubits into protected logical qubits.

### Practical Horizons
- **Molecular Simulation**: Accelerating battery chemistry discoveries and pharmaceutical drug candidates.
- **Logistics Optimization**: Solving high-dimensional routing problems that require exponential compute on classical silicon.
- **Post-Quantum Cryptography (PQC)**: Migrating standard RSA keys to NIST-approved lattice-based encryption algorithms like ML-KEM.`,
    category: 'Technology & Innovation',
    categorySlug: 'technology-and-innovation',
    author: 'Dr. Priya Mehta',
    authorRole: 'AI & Quantum Researcher',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
    tags: ['Quantum', 'Innovation', 'Deep Tech', 'Hardware'],
    readTime: 4,
    published: true,
    featured: false,
    views: 610,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
];

module.exports = {
  initialCategories,
  initialPosts,
};
