// Converted from data.ts to plain JS (types removed)

export const EDUCATION_OPTIONS = ['B.E','B.Tech','BCA','B.Sc','MCA','Diploma','Other'];

export const DEPARTMENT_OPTIONS = ['Computer Science','IT','Electronics','Mechanical','Civil','Commerce','Other'];

export const STATUS_OPTIONS = ['Student','Fresher','Working Professional'];

export const POPULAR_SKILLS = ['Python','HTML','CSS','JavaScript','React','SQL','Java','AI','C++','TypeScript','Node.js','Git & GitHub','Machine Learning','Tailwind CSS','Figma','AWS','Docker','PostgreSQL','C#','Swift','UI/UX'];

export const POPULAR_INTERESTS = ['Web Development','AI','Cyber Security','Data Science','Cloud','UI/UX','Mobile App Development','Hardware & IoT','Game Development','Automation & Scripting','Product Design','Finance & FinTech','Robotics','DevOps'];

export const DEPT_TYPICAL_SKILLS = {
  'Computer Science': [
    { skill: 'Python', concept: 'Backend, AI & Automation', description: 'Excellent general-purpose programming language widely used in AI, scripting, and backend routing.' },
    { skill: 'HTML & CSS', concept: 'Frontend Web Pages', description: 'The structural skeleton and design paint of all websites across the digital internet.' },
    { skill: 'SQL', concept: 'Database Management', description: 'Query language to retrieve, structure, and manipulate relational data storage securely.' },
  ],
  'IT': [
    { skill: 'JavaScript', concept: 'Web Interactions & Routing', description: 'Interactive scripting used extensively on browsers and server environments like Node.js.' },
    { skill: 'SQL', concept: 'Database Systems & Queries', description: 'The absolute backbone for client-server database applications and systems.' },
    { skill: 'Python', concept: 'Scripting & Automation', description: 'Automates network sweeps, data parsers, and regular system backups seamlessly.' },
  ],
  'Electronics': [
    { skill: 'C / C++', concept: 'Microcontrollers & Firmware', description: 'Low-level programming directly compiled to interface with microprocessors, RAM, and hardware chips.' },
    { skill: 'Python', concept: 'IoT & Scripting', description: 'Ideal for IoT hubs, data logging, and connecting hardware units to cloud networks.' },
    { skill: 'MATLAB / Verilog', concept: 'Hardware Design & Logic', description: 'Enables logic synthesis for circuit board layouts and rigorous analog/digital signaling simulations.' },
  ],
  'Mechanical': [
    { skill: 'AutoCAD & SolidWorks', concept: '3D Mechanical Modeling', description: 'Parametric CAD design to model high-fidelity industrial mechanical components and assemblies.' },
    { skill: 'Python', concept: 'Engineering Simulations & FEA', description: 'Enables custom mechanical scripting to automate structural load checks and thermal stress analyses.' },
    { skill: 'MATLAB', concept: 'Numerical Computing', description: 'Matrix operations and dynamic system control analysis for automated machinery.' },
  ],
  'Civil': [
    { skill: 'Revit & AutoCAD Civil 3D', concept: 'Structural Drafting & Building modeling', description: 'Industry-standard drafting to construct high-accuracy architectural site layouts and concrete templates.' },
    { skill: 'Excel & VBA', concept: 'Cost Estimation & Project Schedules', description: 'Automates quantity surveys, structural bills of materials, and Gantt charts for master schedule planning.' },
    { skill: 'GIS Mapping', concept: 'Geographical Analytics', description: 'Leveraged to assess soil coordinates, topological contours, and regional mapping parameters.' },
  ],
  'Commerce': [
    { skill: 'Excel (Advanced)', concept: 'Financial Analysis & Ledgers', description: 'Core spreadsheet manipulation using Pivot tables, VLOOKUP, and cashflow modeling calculations.' },
    { skill: 'SQL', concept: 'Financial Databases & Tallies', description: 'Enables querying transacted debit/credit logs in accounting databases directly.' },
    { skill: 'Python', concept: 'Quantitative & Algorithmic Trading', description: 'Used to fetch live market charts, forecast stock metrics, and clean portfolio asset sheets.' },
  ],
  'Other': [
    { skill: 'HTML & CSS', concept: 'Digital Presence', description: 'Enables building custom personal portfolios or small business pages online.' },
    { skill: 'Python', concept: 'Automation & Utilities', description: 'Automates tedious manual reporting, web scrapers, and file management sheets.' },
    { skill: 'Excel / Sheets', concept: 'Information Organization', description: 'Organizes workflows, simple budgets, client records, and inventory metrics.' },
  ],
};

// Careers Database (Rich, polished data to satisfy specific requirements)
export const CAREERS_DATABASE = [
  {
    id: 'frontend-engineer',
    name: 'Frontend Engineer',
    description: 'Brings user interfaces to life by crafting responsive web layouts, interactive components, and elegant animations.',
    salary: '₹6,00,000 - ₹18,00,000 /yr',
    growth: 'Exceptional (18% YoY)',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Tailwind CSS'],
    interests: ['Web Development', 'UI/UX', 'Product Design'],
    departments: ['Computer Science', 'IT', 'Electronics', 'Other'],
    whyItMatches: 'Your combination of web styling interests and developer skills is a perfect fit for engineering modern client-side apps.',
    detailedRole: 'As a Frontend Engineer, you bridge the gap between design and development. You will utilize custom reactive states, manage animations, compile modular packages, and interface directly with backend server nodes to deliver pristine, responsive layouts that run fluidly in the browser.',
    roadmap: {
      skills: [
        {
          id: 'fe-1',
          title: 'HTML & CSS Mastery',
          description: 'Learnsemantic layouts, modern CSS layouts (Flexbox/Grid), and basic styling.',
          importance: 'Required Foundation',
          resources: {
            name: 'HTML & CSS',
            youtube: 'https://www.youtube.com/results?search_query=html+css+crash+course+for+beginners',
            w3schools: 'https://www.w3schools.com/html/default.asp',
            officialDocs: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
            practiceSite: 'https://codepen.io/'
          }
        },
        {
          id: 'fe-2',
          title: 'Modern JavaScript (ES6+)',
          description: 'Understand asynchronous operations, callbacks, promises, closures, and browser APIs.',
          importance: 'Core Logic',
          resources: {
            name: 'JavaScript',
            youtube: 'https://www.youtube.com/results?search_query=javascript+es6+tutorial',
            w3schools: 'https://www.w3schools.com/js/default.asp',
            officialDocs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
            practiceSite: 'https://jsfiddle.net/'
          }
        },
        {
          id: 'fe-3',
          title: 'React Framework & State',
          description: 'Learn component rendering, custom hooks, React hooks like useEffect, and performance optimization.',
          importance: 'Modern Web Industry Standard',
          resources: {
            name: 'React JS',
            youtube: 'https://www.youtube.com/results?search_query=react+js+tutorial+for+beginners',
            w3schools: 'https://www.w3schools.com/react/default.asp',
            officialDocs: 'https://react.dev/',
            practiceSite: 'https://codesandbox.io/s/react-new'
          }
        }
      ],
      projects: [
        {
          title: 'Responsive Design Portfolio',
          description: 'Build a highly polished, interactive developer portfolio featuring responsive grid items and dark/light modes.',
          difficulty: 'Beginner',
          milestones: ['Setup semantic markup', 'Apply Tailwind custom layouts', 'Add motion reveal animations', 'Deploy on Vercel']
        },
        {
          title: 'Interactive Agile Project Board',
          description: 'A React Trello-clone featuring persistent tasks state, column categorization, search filtering, and custom task dragging animations.',
          difficulty: 'Intermediate',
          milestones: ['Design boards state', 'Implement local storage persistence', 'Form validation for new tasks', 'Smooth entry animations']
        }
      ]
    }
  }
  ,
  {
    id: 'ai-ml-engineer',
    name: 'AI / Machine Learning Engineer',
    description: 'Designs, trains, and deploys predictive models, deep neural networks, and pipelines leveraging Large Language Models (LLMs).',
    salary: '₹8,00,000 - ₹25,00,000 /yr',
    growth: 'Explosive (32% YoY)',
    requiredSkills: ['Python', 'AI', 'Machine Learning', 'SQL', 'Java', 'C++'],
    interests: ['AI', 'Data Science', 'Automation & Scripting', 'Robotics'],
    departments: ['Computer Science', 'IT', 'Electronics'],
    whyItMatches: 'Your focus on Python programming and affinity for AI makes you an outstanding fits for modern algorithm training and model inference pipelines.',
    detailedRole: 'As an AI/ML Engineer, you work with huge vector matrices, preprocess training datasets, construct deep neural nodes, and leverage major state-of-the-art models like Gemini to build conversational agents, automation scrapers, and computer vision utilities.',
    roadmap: {
      skills: [
        {
          id: 'ai-1',
          title: 'Advanced Python Coding & NumPy',
          description: 'Learn matrix algebra, array manipulations, data slicing, and object-oriented Py coding.',
          importance: 'Required Foundation',
          resources: {
            name: 'Python for AI',
            youtube: 'https://www.youtube.com/results?search_query=python+for+machine+learning',
            w3schools: 'https://www.w3schools.com/python/default.asp',
            officialDocs: 'https://docs.python.org/3/',
            practiceSite: 'https://www.hackerrank.com/domains/python'
          }
        },
        {
          id: 'ai-2',
          title: 'Scikit-Learn & Machine Learning Algorithms',
          description: 'Master linear regressions, decision classification trees, random forests, and validation scoring.',
          importance: 'Core Machine Learning Logic',
          resources: {
            name: 'Machine Learning Basics',
            youtube: 'https://www.youtube.com/results?search_query=scikit+learn+tutorial',
            w3schools: 'https://www.w3schools.com/python/python_ml_getting_started.asp',
            officialDocs: 'https://scikit-learn.org/stable/',
            practiceSite: 'https://www.kaggle.com/'
          }
        },
        {
          id: 'ai-3',
          title: 'Deep Learning & LLM Integration',
          description: 'Learn neural network basics using PyTorch and interface with generative AI SDKs like the Google GenAI SDK.',
          importance: 'Cutting Edge AI',
          resources: {
            name: 'Google GenAI SDK & PyTorch',
            youtube: 'https://www.youtube.com/results?search_query=generative+ai+api+tutorial',
            w3schools: 'https://www.w3schools.com/python/python_ml_linear_regression.asp',
            officialDocs: 'https://ai.google.dev/gemini-api/docs',
            practiceSite: 'https://colab.research.google.com/'
          }
        }
      ],
      projects: [
        {
          title: 'Salary Predictor Model',
          description: 'Clean real-world labor surveys and train a regression model estimating tech sector earnings based on skills, degree, and region.',
          difficulty: 'Beginner',
          milestones: ['Collect and clean null rows', 'Normalize and scale continuous skills vectors', 'Train gradient boosting tree', 'Evaluate error metrics']
        },
        {
          title: 'Intelligent Career Agent using Gemini',
          description: 'Deploy a server-side app connected to Gemini to chat with graduates and offer custom career counseling.',
          difficulty: 'Advanced',
          milestones: ['Set up server-side proxy route', 'Secure Gemini API key', 'Implement conversational memory', 'Create beautiful client chat interface']
        }
      ]
    }
  }
];


export function getFallbackRecommendation(department, status) {
  const filtered = CAREERS_DATABASE.filter((c) => c.departments.includes(department));
  if (filtered.length > 0) return filtered;
  return CAREERS_DATABASE.slice(0, 3);
}

export function calculateCareerMatches(selectedSkills, selectedInterests, department) {
  const lowercaseSkills = selectedSkills.map((s) => s.toLowerCase());
  const lowercaseInterests = selectedInterests.map((i) => i.toLowerCase());

  const scored = CAREERS_DATABASE.map((career) => {
    let score = 30;

    const skillMatches = career.requiredSkills.filter((s) =>
      lowercaseSkills.some((ls) => ls.includes(s.toLowerCase()) || s.toLowerCase().includes(ls)),
    );
    const skillOverlapCount = skillMatches.length;
    score += skillOverlapCount * 15;

    const interestMatches = career.interests.filter((i) =>
      lowercaseInterests.some((li) => li.includes(i.toLowerCase()) || i.toLowerCase().includes(li)),
    );
    const interestOverlapCount = interestMatches.length;
    score += interestOverlapCount * 20;

    if (career.departments.includes(department)) score += 15;

    const finalScore = Math.min(99, Math.max(45, Math.round(score)));

    let matchExplanation = '';
    if (skillOverlapCount > 0 && interestOverlapCount > 0) {
      matchExplanation = `Perfect alignment! Your expertise in \"${skillMatches.slice(0, 3).join(', ')}\" combined with physical interest in \"${interestMatches.slice(0, 2).join(', ')}\" directly mirrors this role's prerequisites.`;
    } else if (interestOverlapCount > 0) {
      matchExplanation = `Strong Interest fit: Your target interest inside \"${interestMatches.join(', ')}\" is the core driving motor of this profession. Let's learn the required tech stack!`;
    } else if (skillOverlapCount > 0) {
      matchExplanation = `Excellent Technical fit: You already know \"${skillMatches.slice(0, 2).join(', ')}\" which stands for ${Math.round((skillOverlapCount / career.requiredSkills.length) * 100)}% of this role's programming criteria.`;
    } else {
      matchExplanation = `Strategic Domain alignment: Graduates in your ${department} curriculum typically excel at modeling, programming, or planning this career domain.`;
    }

    return { ...career, matchScore: finalScore, whyItMatches: matchExplanation };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore);
}

