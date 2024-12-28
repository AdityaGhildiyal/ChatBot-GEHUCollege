import { NextRequest, NextResponse } from 'next/server';

interface ChatResponse {
  role: string;
  content: string;
}

const KEYWORDS = {
  initial: ['hi', 'hello', 'hey', 'start', 'help', 'welcome'],
  admissions: ['admission', 'admissions', 'apply', 'eligibility', 'application', 'entrance', 'enroll', 'registration'],
  courses: ['course', 'courses', 'program', 'programs', 'degree', 'degrees', 'btech', 'mba', 'bcom'],
  campus: ['campus', 'facility', 'facilities', 'hostel', 'accommodation', 'sports', 'club', 'activities'],
  fees: ['fee', 'fees', 'cost', 'payment', 'scholarship', 'financial', 'charges'],
  faculty: ['faculty', 'professor', 'teacher', 'staff', 'department', 'departments'],
  location: ['location', 'address', 'place', 'where', 'website', 'contact'],
  resources: ['resource', 'library', 'scholarship', 'career', 'placement', 'support'],
  exams: ['exam', 'test', 'result', 'grade', 'academic', 'semester'],
};

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

function findBestMatch(query: string, keywords: string[], threshold: number = 0.75): string | null {
  let bestMatch: string | null = null;
  let highestSimilarity = 0;

  keywords.forEach(keyword => {
    const similarity = calculateSimilarity(query, keyword);
    if (similarity > highestSimilarity && similarity >= threshold) {
      highestSimilarity = similarity;
      bestMatch = keyword;
    }
  });

  return bestMatch;
}

function findTopic(input: string): string {
  input = input.toLowerCase();
  const words = input.split(/\s+/); 

  let bestMatch: string | null = null;
  let matchedTopic: string = 'unknown'; 

  for (const word of words) {
    for (const [topic, keywords] of Object.entries(KEYWORDS)) {
      const exactMatch = keywords.includes(word);
      if (exactMatch) {
        matchedTopic = topic; 
        return matchedTopic;
      }

      const bestSimilarityMatch = findBestMatch(word, keywords);
      if (bestSimilarityMatch) {
        bestMatch = bestSimilarityMatch;
        matchedTopic = topic; 
      }
    }
  }

  return matchedTopic; 
}

// Function to get the response based on the detected topic
function getResponseContent(topic: string): string {
  const responses: { [key: string]: string } = {
    initial: `Welcome to GEHU Chatbot! 🎓\n\n
    I can help you with:\n
    - Admissions & eligibility\n
    - Courses & programs\n
    - Campus facilities\n
    - Fees & scholarships\n
    - Faculty information\n
    - Location & contacts\n
    - Resources for students\n
    - exam schedules\n\n
    How may I assist you today?\n`,

    admissions: `GEHU Admissions Information 📚
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
    - Media & Mass Communication`,

    courses: `GEHU Courses Information 🎓
    - B.Tech (Various specializations): 4 years program
    - MBA (Various specializations): 2 years program
    - B.Com (Hons): 3 years program
    - B.Pharm: 4 years program
    - LLB: 3 years program
    - Media & Mass Communication: 3 years program
    - Contact us for more information on course structures, eligibility, and more.`,

    campus: `GEHU Campus Facilities 🏫
    - Spacious hostels with Wi-Fi
    - Sports complex
    - Library with a wide range of resources
    - Cafeteria with healthy food options
    - Laboratories and computer labs for practical training
    - Active student clubs and extracurricular activities`,

    fees: `GEHU Fees Information 💰
    B.Tech Fees: Approx ₹ 1,50,000 per year
    MBA Fees: Approx ₹ 2,00,000 per year
    B.Com Fees: Approx ₹ 1,00,000 per year
    B.Pharm Fees: Approx ₹ 1,50,000 per year
    Financial aid and scholarships are available for eligible students.`,

    faculty: `GEHU Faculty Information 👨‍🏫
    GEHU has highly qualified and experienced faculty members across all departments, including:
    - Computer Science
    - Electronics & Communication
    - Civil Engineering
    - MBA
    - Media Studies
    Our faculty are involved in research, mentorship, and industry collaboration.`,

    location: `GEHU Location 📍
    Address: GEHU, 10th Mile Stone, Dehradun Road, Shivalik Nagar, Haridwar, Uttarakhand, India
    For more details, visit: [GEHU Website](https://www.gehu.ac.in)
    Contact: +91 9876543210 | admissions@gehu.ac.in`,

    resources: `GEHU Resources for Students 📚
    - Access to online journals and resources
    - Career guidance and placement support
    - Scholarships for deserving students
    - Library with books, e-books, and research papers
    - Counseling and student support services`,

    exams: `GEHU Exams Information 📅
    - Semester exams are held twice a year.
    - Examination schedules are announced in advance on the student portal.
    - Results are available online on the official website.
    - In case of any query, please reach out to the Exam Controller Office.`,

    unknown: `I am specialized in GEHU-related topics. Please ask about:
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
  return responses[topic] || responses['unknown'];
}

// Named export for GET method
export async function GET(req: NextRequest) {
  // Extract the 'type' query parameter from the request
  const query = req.url.split('?')[1]?.split('=')[1];

  // Handle cases where the query parameter is missing or invalid
  if (!query || typeof query !== 'string') {
    return NextResponse.json(
      {
        role: 'assistant',
        content: 'Please provide a valid query related to GEHU.',
      },
      { status: 400 }
    );
  }

  // Find the topic based on the input query
  const topic = findTopic(query);
  const content = getResponseContent(topic);

  // Send the response back with the appropriate content
  return NextResponse.json({
    role: 'assistant',
    content,
  });
}
