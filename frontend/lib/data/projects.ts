export const PROJECT_CATEGORIES = {
  dashboard: {
    label: 'DASHBOARD',
    projects: [] // Dikosongkan karena dashboard punya tampilan visual khusus
  },
  data_engineering: {
    label: 'DATA ENGINEERING',
    projects: [
      { id: 'job_market', title: 'Regional Job Market Pipeline', type: 'PyMongo / NoSQL', size: 'large', metrics: 'Processed regional demand data workflows' },
      { id: 'ats', title: 'ATS Screening System', type: 'Python OOP', size: 'normal', metrics: 'Skill mapping & GPA filtering' },
    ]
  },
  software_dev: {
    label: 'SOFTWARE DEVELOPMENT',
    projects: [
      { id: 'geospatial', title: 'Geospatial 3D Map', type: 'PHP / TypeScript / DeckGL', size: 'large', metrics: 'Interactive system mapping' },
      { id: 'currency', title: 'Real-time Currency Tracker', type: 'Next.js 15 / React', size: 'normal', metrics: 'Un-cached API aggregation' },
      { id: 'flask_workspace', title: 'Daily Record Workspace', type: 'Flask / MongoDB', size: 'normal', metrics: 'Individualized auth routing' },
    ]
  },
  machine_learning: {
    label: 'MACHINE LEARNING',
    projects: [
      { id: 'burnout', title: 'Corporate Burnout Analysis', type: 'Linear Regression', size: 'large', metrics: 'Google Colab model training' },
      { id: 'montecarlo', title: 'Asset Backtesting System', type: 'Monte Carlo Simulation', size: 'normal', metrics: 'Event-driven architecture' },
    ]
  },
  generative_agentic_ai: {
    label: 'GEN AI & AGENTIC',
    projects: [
      { id: 'llm', title: 'LLM Workflow Automation', type: 'LangChain', size: 'large', metrics: 'Deployment pending' },
    ]
  },
  bioinformatics: {
    label: 'BIOINFORMATICS',
    projects: [
      { id: 'genomic', title: 'Genomic Sequence Analyzer', type: 'Computational Biology', size: 'large', metrics: 'Research phase' },
    ]
  }
};