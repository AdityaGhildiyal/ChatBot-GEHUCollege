// lib/GEHUChatbotData.ts

export const getInitialMessage = () => ({
    role: 'assistant',
    content: `
      **Welcome to the Graphic Era Hill University Chatbot!** 🎓
  
      I am here to assist you with information related to GEHU. Feel free to ask me about the following:
  
      - **Admissions**: Process, eligibility, and deadlines
      - **Courses & Programs**: Undergraduate and postgraduate courses
      - **Campus Life**: Facilities, clubs, and student activities
      - **Fee Structure**: Payment methods, deadlines, and scholarships
      - **Faculty & Staff**: Information about our faculty and departments
      - **Location & Affiliated Websites**: Details about our campus location and official websites
      - **Student Resources**: Scholarships, libraries, career services, and more
      - **Exams & Academic Queries**: Exam schedules, results, academic policies, etc.
  
      *Please note:* If your question is outside the scope of GEHU, I will not be able to assist you.
    `
  });
  
  export const getOutOfScopeResponse = () => ({
    role: 'assistant',
    content: `
      *I am a chatbot related to Graphic Era Hill University (GEHU) and can't answer questions about anything else.* ❌
  
      Please feel free to ask anything specific to the university, and I will be happy to assist you!
    `
  });
  
export const getAdmissionsInfo = () => ({
    role: 'assistant',
    content: `
      **Admissions at Graphic Era Hill University (GEHU):**
  
      - **Undergraduate Programs:**
        - B.Tech programs in Computer Science, Mechanical Engineering, Civil Engineering, etc.
        - Eligibility: 75% in 10+2 and valid JEE Main score.
        - Application Deadline: June 30, 2024.
  
      - **Postgraduate Programs:**
        - MBA with specializations in Banking & Financial Services (BFSI) and Commerce.
        - Eligibility: Graduation degree with at least 50% marks and valid CAT score.
        - Application Period: December 26 to June 30, 2024.
  
      - **Other Programs**: 
        - B.Com (Hons.), B.Pharm, LLB, Media and Mass Communication, and more.
    `
  });
  
  export const getCoursesInfo = () => ({
    role: 'assistant',
    content: `
      **Courses & Programs at GEHU:**
  
      - **Engineering:** B.Tech programs in Computer Science, Mechanical Engineering, Civil Engineering, etc.
      - **Management:** MBA in BFSI, Commerce, and more.
      - **Commerce:** B.Com (Hons.)
      - **Pharmacy:** B.Pharm
      - **Law:** BA + LLB
      - **Design:** Fashion Design, Animation & Gaming
      - **Allied Sciences:** Agriculture, Media, Mass Communication
      - **Polytechnic:** Diploma programs in various engineering disciplines.
    `
  });
  
  export const getCampusLifeInfo = () => ({
    role: 'assistant',
    content: `
      **Campus Life at GEHU:**
  
      - **Facilities:** 
        - Modern classrooms, laboratories, libraries, and sports facilities.
        - Separate hostels for male and female students.
      
      - **Clubs and Societies:**
        - Cultural, technical, and sports clubs for student engagement.
      
      - **Sports:** 
        - Sports facilities and a variety of outdoor and indoor games.
  
      - **Accommodation:**
        - On-campus hostels with all necessary amenities for students.
    `
  });
  
  export const getFeeStructureInfo = () => ({
    role: 'assistant',
    content: `
      **Fee Structure at GEHU:**
  
      - **B.Tech Programs:**
        - First-year fees: ₹1.85 Lakhs to ₹2.76 Lakhs.
  
      - **MBA Programs:**
        - First-year fees: ₹2.37 Lakhs to ₹3.07 Lakhs.
  
      - **B.Com (Hons.):**
        - First-year fees: ₹1.43 Lakhs to ₹1.88 Lakhs.
  
      - **B.Pharm:**
        - First-year fees: ₹1.87 Lakhs.
  
      *Note: These fees may vary slightly based on program and year.*
    `
  });
  
  export const getFacultyInfo = () => ({
    role: 'assistant',
    content: `
      **Faculty & Staff at GEHU:**
  
      - The university has a qualified and experienced faculty across all departments.
      - The faculty members are dedicated to delivering quality education and conducting research in their respective fields.
      - Administrative staff provides full support to students for a smooth academic experience.
    `
  });
  
  export const getLocationAndAffiliatedWebsites = () => ({
    role: 'assistant',
    content: `
      **Location & Affiliated Websites:**
  
      - **Campus Location:** 
        - The Graphic Era Hill University campus is situated in Dehradun, Uttarakhand, India, nestled in the scenic foothills of the Himalayas.
  
      - **Affiliated Websites:** 
        - Official Website: [www.geu.ac.in](http://www.geu.ac.in)
        - Admission Portal: [admissions.geu.ac.in](https://admissions.geu.ac.in)
        - University Alumni: [alumni.geu.ac.in](https://alumni.geu.ac.in)
    `
  });
  
  export const getStudentResources = () => ({
    role: 'assistant',
    content: `
      **Student Resources at GEHU:**
  
      - **Scholarships:** 
        - GEHU offers merit-based scholarships for undergraduate and postgraduate students.
        
      - **Libraries:** 
        - The university has well-equipped libraries with an extensive collection of academic books, journals, and digital resources.
  
      - **Career Services:**
        - The Career Development Cell (CDC) helps students with internships, placements, and career counseling.
  
      - **Other Resources:**
        - Hostel facilities, medical center, and a dedicated student support team.
    `
  });
  
  export const getExamsAndAcademicQueries = () => ({
    role: 'assistant',
    content: `
      **Exams & Academic Queries at GEHU:**
  
      - **Exam Schedules:** 
        - The university follows a semester-based academic calendar with exams scheduled twice a year—mid-semester and end-semester.
  
      - **Results:** 
        - Exam results are declared on the university's official website after the completion of each semester.
  
      - **Academic Policies:** 
        - GEHU has strict academic policies regarding attendance, exam conduct, and plagiarism.
    `
  });
  