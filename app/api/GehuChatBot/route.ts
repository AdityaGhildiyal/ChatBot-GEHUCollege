import { NextRequest, NextResponse } from 'next/server';

interface ChatResponse {
  role: string;
  content: string;
}

const KEYWORDS = {
  initial: ['hi', 'hello', 'hey', 'start', 'help', 'welcome'],
  admissions: {
    keywords: ['admission', 'admissions', 'apply', 'eligibility', 'application', 'entrance', 'enroll', 'registration'],
    patterns: ['how to apply', 'how can i apply', 'admission process', 'what is the eligibility', 'when can i apply', 'tell me about admission']
  },
  courses: {
    keywords: ['course', 'courses', 'program', 'programs', 'degree', 'degrees', 'btech', 'mba', 'bcom'],
    patterns: ['what courses', 'which programs', 'tell me about courses', 'available courses', 'course information', 'what programs']
  },
  campus: {
    keywords: ['campus', 'facility', 'facilities', 'hostel', 'accommodation', 'sports', 'club', 'activities'],
    patterns: ['campus facilities', 'what facilities', 'tell me about campus', 'hostel facilities', 'what accommodation']
  },
  fees: {
    keywords: ['fee', 'fees', 'cost', 'payment', 'scholarship', 'financial', 'charges'],
    patterns: ['how much is the fee', 'what is the cost', 'tell me about fees', 'scholarship details', 'fee structure']
  },
  faculty: {
    keywords: ['faculty', 'professor', 'teacher', 'staff', 'department', 'departments'],
    patterns: ['tell me about faculty', 'who are the professors', 'department information', 'teaching staff']
  },
  location: {
    keywords: ['location', 'address', 'place', 'where', 'website', 'contact'],
    patterns: ['where is', 'what is the location', 'how to reach', 'where is gehu located', 'address of', 'directions to']
  },
  resources: {
    keywords: ['resource', 'library', 'scholarship', 'career', 'placement', 'support'],
    patterns: ['what resources', 'tell me about resources', 'placement details', 'career support', 'library facilities']
  },
  exams: {
    keywords: ['exam', 'test', 'result', 'grade', 'academic', 'semester'],
    patterns: ['when are exams', 'exam schedule', 'how are results', 'grading system', 'tell me about exams']
  }
};

function containsPattern(input: string, patterns: string[]): boolean {
  return patterns.some(pattern => 
    input.toLowerCase().includes(pattern.toLowerCase()) ||
    calculateSimilarity(input.toLowerCase(), pattern.toLowerCase()) > 0.8
  );
}

function levenshteinDistance(a: string, b: string): number {
  const tmp: number[][] = [];

  for (let i = 0; i <= a.length; i++) {
    tmp[i] = [i];
  }

  for (let j = 0; j <= b.length; j++) {
    tmp[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + cost
      );
    }
  }

  return tmp[a.length][b.length];
}

function calculateSimilarity(a: string, b: string): number {
  const distance = levenshteinDistance(a, b);
  const maxLength = Math.max(a.length, b.length);
  return (1 - distance / maxLength);
}

function findTopic(input: string): string {
  input = input.toLowerCase();
  
  for (const [topic, data] of Object.entries(KEYWORDS)) {
    if (topic === 'initial') continue;
    
    const patterns = (data as { patterns: string[] }).patterns;
    if (patterns && containsPattern(input, patterns)) {
      return topic;
    }
  }

  const words = input.split(/\s+/);
  let bestMatch: string | null = null;
  let highestSimilarity = 0;

  for (const [topic, data] of Object.entries(KEYWORDS)) {
    const keywords = topic === 'initial' ? data as string[] : (data as { keywords: string[] }).keywords;
    
    for (const word of words) {
      if (keywords.includes(word)) {
        return topic;
      }

      keywords.forEach(keyword => {
        const similarity = calculateSimilarity(word, keyword);
        if (similarity > highestSimilarity && similarity >= 0.75) {
          highestSimilarity = similarity;
          bestMatch = topic;
        }
      });
    }
  }

  return bestMatch || 'unknown';
}

function getResponseContent(topic: string, query: string): string {
  const responses: { [key: string]: string | ((query: string) => string) } = {
    initial: `Welcome to GEHU Chatbot! 🎓
    I can help you with:
    - Admissions & eligibility
    - Courses & programs
    - Campus facilities
    - Fees & scholarships
    - Faculty information
    - Location & contacts
    - Resources for students
    - Exam schedules
    How may I assist you today?`,

    admissions: (query: string) => {
      if (query.includes('process') || query.includes('how')) {
        return `GEHU Admission Process 📝
        1. Fill online application form at gehu.ac.in
        2. Submit required documents
        3. Pay application fee
        4. Attend entrance exam/interview if required
        5. Await selection list
        
        For B.Tech:
        - Eligibility: 50% in 10+2 + JEE Main score
        - Deadline: June 30, 2024
        
        For MBA:
        - Eligibility: 50% in graduation + CAT score
        - Period: Dec 26 - June 30, 2024`;
      }
      return `GEHU Admissions Information 📚
      B.Tech Programs:
      - Eligibility: 75% in 10+2 + JEE Main score
      - Deadline: June 30, 2024
      MBA Programs:
      - Eligibility: 50% in graduation + CAT score
      - Period: Dec 26 - June 30, 2024
      Other Programs:
      - B.Com (Hons)
      - B.Pharm
      - LLB
      - Media & Mass Communication`;
    },

    courses: (query: string) => {
      if (query.includes('btech') || query.includes('engineering')) {
        return `GEHU B.Tech Programs 🎓
        - Computer Science Engineering
        - Mechanical Engineering
        - Civil Engineering
        - Electronics & Communication
        Duration: 4 years
        Eligibility: 75% in 10+2 with PCM`;
      }
      return `GEHU Courses Information 🎓
      - B.Tech (Various specializations): 4 years program
      - MBA (Various specializations): 2 years program
      - B.Com (Hons): 3 years program
      - B.Pharm: 4 years program
      - LLB: 3 years program
      - Media & Mass Communication: 3 years program
      Contact us for more information on course structures, eligibility, and more.`;
    },

    campus: (query: string) => {
      if (query.includes('hostel') || query.includes('accommodation')) {
        return `GEHU Hostel Facilities 🏢
        - Separate hostels for boys and girls
        - 24/7 Wi-Fi connectivity
        - Air-conditioned rooms available
        - Mess with nutritious meals
        - 24-hour security
        - Recreation rooms
        - Laundry service
        Contact hostel administration for booking and fees.`;
      }
      return `GEHU Campus Facilities 🏫
      - Spacious hostels with Wi-Fi
      - Sports complex
      - Library with a wide range of resources
      - Cafeteria with healthy food options
      - Laboratories and computer labs
      - Active student clubs
      - 24/7 security
      - Medical facility
      - Transportation service`;
    },

    fees: (query: string) => {
      if (query.includes('scholarship')) {
        return `GEHU Scholarship Information 🎯
        Merit-based scholarships:
        - 90% and above: 50% fee waiver
        - 85-90%: 30% fee waiver
        - 80-85%: 20% fee waiver
        
        Sports Excellence Scholarship
        Research Scholarship
        Need-based Financial Aid
        
        Contact financial aid office for more details.`;
      }
      return `GEHU Fees Information 💰
      B.Tech Fees: Approx ₹1,50,000 per year
      MBA Fees: Approx ₹2,00,000 per year
      B.Com Fees: Approx ₹1,00,000 per year
      B.Pharm Fees: Approx ₹1,50,000 per year
      
      Financial aid and scholarships available
      Easy installment options
      Education loan assistance`;
    },

    faculty: `GEHU Faculty Information 👨‍🏫
    Our faculty includes:
    - 200+ PhD holders
    - Industry experts
    - Research scholars
    
    Departments:
    - Computer Science
    - Electronics & Communication
    - Civil Engineering
    - MBA
    - Media Studies
    
    Our faculty actively participates in:
    - Research projects
    - Industry collaborations
    - Student mentoring
    - Professional development`,

    location: (query: string) => {
      if (query.includes('reach') || query.includes('direction')) {
        return `GEHU Location & Directions 🗺️
        Address: GEHU, 
        Clement Town,Shubhash Nagar, 
        Dehradun, Uttarakhand, India
        
        How to reach:
        - By Bus: Regular buses from Dehradun & Haridwar
        - By Train: Nearest station - Haridwar Junction (10km)
        - By Air: Nearest airport - Dehradun Airport (35km)
        
        Campus Navigation:
        - Main Gate: Dehradun Road entrance
        - Administrative Block: Right from main gate
        - Academic Blocks: Central campus area
        
        Contact: +91 9876543210 | admissions@gehu.ac.in`;
      }
      return `GEHU Location 📍
      Address:GEHU, 
        Clement Town,Shubhash Nagar, 
        Dehradun, Uttarakhand, India
      
      Website: www.gehu.ac.in
      Contact: +91 9876543210
      Email: admissions@gehu.ac.in`;
    },

    resources: (query: string) => {
      if (query.includes('placement') || query.includes('career')) {
        return `GEHU Placement Services 💼
        - 500+ companies visit annually
        - Average package: 6 LPA
        - Highest package: 56 LPA
        - Pre-placement training
        - Mock interviews
        - Resume building workshops
        - Industry interactions
        
        Top Recruiters:
        - Microsoft
        - Amazon
        - Infosys
        - TCS
        Contact placement cell for more details.`;
      }
      return `GEHU Student Resources 📚
      - Digital library access
      - Online journals and databases
      - Career counseling
      - Placement assistance
      - Mental health support
      - Technical workshops
      - Skill development programs
      - Research facilities`;
    },

    exams: (query: string) => {
      if (query.includes('result') || query.includes('grade')) {
        return `GEHU Results System 📊
        - Results published on student portal
        - Grade system: A+ to F
        - Minimum passing grade: D
        - CGPA calculation available
        - Result grievance cell
        
        For result queries:
        Email: exam@gehu.ac.in
        Phone: +91 9876543210`;
      }
      return `GEHU Examination System 📝
      - Semester exams: Twice a year
      - Continuous assessment
      - Internal marks: 30%
      - External marks: 70%
      - Online result portal
      - Supplementary exams
      
      Check student portal for detailed schedule.`;
    },

    unknown: `I'm specialized in GEHU-related topics. Please ask about:
    - Admissions
    - Courses
    - Campus
    - Fees
    - Faculty
    - Location
    - Resources
    - Exams
    How can I assist you with these topics?`
  };

  const response = responses[topic];
  if (typeof response === 'function') {
    return response(query);
  }
  return response as string;
}

export async function GET(req: NextRequest) {
  try {
    const query = req.url.split('?')[1]?.split('=')[1];

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        {
          role: 'assistant',
          content: 'Please provide a valid query related to GEHU.',
        },
        { status: 400 }
      );
    }

    const decodedQuery = decodeURIComponent(query);
    const topic = findTopic(decodedQuery);
    const content = getResponseContent(topic, decodedQuery);

    return NextResponse.json({
      role: 'assistant',
      content,
    });
  } catch (error) {
    return NextResponse.json(
      {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try rephrasing your question.',
      },
      { status: 500 }
    );
  }
}