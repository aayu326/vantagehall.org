// server.js - UPDATED WITH EMAIL CALLBACK FEATURE ✅
console.log("🔥 THIS SERVER.JS IS RUNNING 🔥");


const fetch = require('node-fetch');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// ==============================================
// API KEYS - UPDATED FOR GEMINI
// ==============================================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini
let genAI = null;
if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  console.log('✅ Gemini API initialized');
} else {
  console.log('⚠️ Gemini API key not found - using Knowledge Base only');
}

// ==============================================
// ✅ NEW: EMAIL CONFIGURATION FOR CALLBACK
// ==============================================
const EMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL || 'bhk295826@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'hcis fdlh lbta gotv'
  }
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vantagehall.org';
const transporter = nodemailer.createTransport(EMAIL_CONFIG);



// ==============================================
// COMPREHENSIVE KNOWLEDGE BASE WITH FAQ + EMOTIONAL QUOTIENT
// ==============================================
const KNOWLEDGE_BASE = {
  // ==============================================
  // FAQ MENU (IT & Gadgets)
  // ==============================================
  faq_menu: {
    keywords: ['faq', 'faqs', 'frequently asked', 'common questions', 'questions'],
    answer: "🟢 FAQ - IT & Gadgets Policies:\n\nChoose a topic:",
    hasOptions: true,
    isFAQMenu: true,
    options: [
      {
        id: 1,
        label: "1️⃣ Internet Use & Safety",
        trigger: ['1', 'internet', 'internet safety', 'online safety'],
        response: "🛡️ Internet Use & Safety:\n\nWhat would you like to know?",
        subOptions: [
          {
            id: 1,
            label: "🔒 How is browsing monitored?",
            trigger: ['1', 'monitoring', 'monitored', 'supervised'],
            response: "👀 Monitoring:\n\nAll online activity is supervised to ensure student safety. There's no expectation of privacy on school devices or Wi-Fi because safety comes first.\n\n✅ All browsing is logged\n✅ Supervised sessions only\n✅ Regular monitoring by staff\n\nAnything else you'd like to know?"
          },
          {
            id: 2,
            label: "🌐 What sites are restricted?",
            trigger: ['2', 'restricted', 'blocked sites', 'banned'],
            response: "🚫 Restricted Websites:\n\nHarmful or inappropriate websites are automatically blocked. Students cannot access unsafe or unsuitable content.\n\n✅ Content filtering active\n✅ Safe browsing environment\n✅ Educational sites prioritized\n\nWant to know about downloading rules?"
          },
          {
            id: 3,
            label: "📥 Downloading rules",
            trigger: ['3', 'download', 'downloading', 'install'],
            response: "📥 Downloading Policy:\n\nStudents cannot download any non-approved apps or software. This helps protect devices and ensures learning stays the focus.\n\n❌ No games or entertainment apps\n❌ No unknown software\n❌ No unauthorized downloads\n\nOnly approved educational software is permitted!"
          }
        ]
      },
      {
        id: 2,
        label: "2️⃣ Downloading & Apps",
        trigger: ['2', 'download', 'apps', 'install', 'software'],
        response: "📥 Downloading & Apps Policy:\n\nWhat would you like to know?",
        subOptions: [
          {
            id: 1,
            label: "✅ Can students download apps?",
            trigger: ['1', 'can download', 'allowed', 'permitted'],
            response: "🚫 Download Policy:\n\nStudents cannot download any non-approved apps or software. This helps protect devices and ensures learning stays focused.\n\n✅ Only pre-approved apps\n✅ IT team manages installations\n✅ Educational apps prioritized"
          },
          {
            id: 2,
            label: "❌ What is not allowed?",
            trigger: ['2', 'not allowed', 'prohibited', 'banned'],
            response: "⛔ Prohibited Downloads:\n\nAnything unsafe, unnecessary, or unrelated to academics isn't allowed:\n\n❌ Games\n❌ Movies/Entertainment\n❌ Social media apps\n❌ Unknown software\n❌ Streaming apps\n\nThis policy protects both students and school devices!"
          }
        ]
      },
      {
        id: 3,
        label: "3️⃣ Gadgets (Phones/Laptops)",
        trigger: ['3', 'gadget', 'phone', 'laptop', 'device'],
        response: "📱 Gadgets Policy:\n\nWhat would you like to know?",
        subOptions: [
          {
            id: 1,
            label: "📱 Mobile Phones",
            trigger: ['1', 'mobile', 'phone', 'smartphone'],
            response: "📱 Mobile Phone Policy:\n\nStudents can bring phones, but they must be submitted to the staff and are only given back during:\n\n✅ Travel/Holidays\n✅ Approved events\n✅ Sunday video calls with parents\n\nThis ensures students stay focused on academics and campus activities!"
          },
          {
            id: 2,
            label: "💻 Laptops/Tablets",
            trigger: ['2', 'laptop', 'tablet', 'computer'],
            response: "💻 Laptop/Tablet Policy:\n\nYes, students may bring learning devices, but they are issued only for:\n\n✅ Academic work\n✅ Research projects\n✅ Exam preparation\n✅ With permission from staff\n\nDevices must be used responsibly for educational purposes only!"
          },
          {
            id: 3,
            label: "🎧 Gadgets Not Allowed",
            trigger: ['3', 'not allowed', 'prohibited', 'banned gadgets'],
            response: "⛔ Prohibited Gadgets:\n\nSome gadgets are not permitted:\n\n❌ Speakers\n❌ Smartwatches\n❌ Wireless headphones\n❌ Gaming devices\n\nIf brought, they're taken into safe custody and returned to parents at term-end only."
          }
        ]
      },
      {
        id: 4,
        label: "4️⃣ Device Storage & Access",
        trigger: ['4', 'storage', 'access', 'when use', 'kept where'],
        response: "🗄️ Device Storage & Access:\n\nWhat would you like to know?",
        subOptions: [
          {
            id: 1,
            label: "📍 Where are devices kept?",
            trigger: ['1', 'where', 'kept', 'stored'],
            response: "🗄️ Device Storage:\n\nDevices are stored safely with:\n\n✅ House staff\n✅ Admin team\n✅ Secure storage areas\n\nStudents are responsible for maintaining their devices in good condition!"
          },
          {
            id: 2,
            label: "📝 How to get device issued?",
            trigger: ['2', 'get device', 'issue', 'request'],
            response: "📝 Device Issue Process:\n\nDevices are issued only:\n\n✅ For study purposes\n✅ With staff permission\n✅ During approved times\n✅ With advance request\n\nProper authorization ensures responsible usage!"
          },
          {
            id: 3,
            label: "⏰ When can devices be used?",
            trigger: ['3', 'when', 'timing', 'usage time'],
            response: "⏰ Device Usage Timing:\n\nDevices are used during:\n\n✅ Approved study hours\n✅ Research time\n✅ School activities\n\n❌ Not during:\n• Free time\n• Dorm hours\n• Without supervision\n\nThis maintains a healthy balance between study and rest!"
          }
        ]
      },
      {
        id: 5,
        label: "5️⃣ Rules & Consequences",
        trigger: ['5', 'rules', 'consequences', 'punishment', 'misuse'],
        response: "⚖️ Rules & Consequences:\n\nWhat would you like to know?",
        subOptions: [
          {
            id: 1,
            label: "⚠️ What counts as misuse?",
            trigger: ['1', 'misuse', 'what counts', 'violation'],
            response: "⚠️ Misuse Includes:\n\n❌ Accessing unsafe sites\n❌ Using gadgets without permission\n❌ Downloading unapproved material\n❌ Misusing someone else's device\n❌ Breaking safety protocols\n\nFollowing these rules keeps everyone safe!"
          },
          {
            id: 2,
            label: "🚨 What are the consequences?",
            trigger: ['2', 'consequences', 'punishment', 'what happens'],
            response: "🚨 Consequences of Rule Violation:\n\nMisuse can lead to:\n\n⚠️ Withdrawal of gadget access\n⚠️ Withdrawal of Internet access\n⚠️ Formal warnings\n⚠️ Further disciplinary action if needed\n\nWe believe in fair consequences that help students learn and maintain a safe environment!"
          }
        ]
      }
    ]
  },

  // ==============================================
  // EMOTIONAL QUOTIENT MENU (NEW SECTION)
  // ==============================================
  emotional_menu: {
    keywords: ['emotional', 'emotional support', 'emotional quotient', 'wellbeing', 'mental health', 'care'],
    answer: "💚 Emotional Support & Wellbeing:\n\nChoose a topic:",
    hasOptions: true,
    isEmotionalMenu: true,
    options: [
      {
        id: 1,
        label: "1️⃣ Parent Visits & Communication",
        trigger: ['1', 'visit', 'parent visit', 'communication'],
        response: "👨‍👩‍👧 Parent Visits & Communication:\n\nWhat would you like to know?",
        subOptions: [
          {
            id: 1,
            label: "🏫 Can I visit my daughter?",
            trigger: ['1', 'can i visit', 'visiting', 'visit daughter'],
            response: "👨‍👩‍👧 Parent Visits:\n\nYes! Parents are warmly welcomed to visit their daughters whenever they wish. We strongly believe in maintaining close family connections.\n\n✅ Visit anytime you're in town\n✅ Preferably after school hours\n✅ No appointment needed\n\nWe encourage regular interaction between parents and students. Your presence matters! 💙"
          },
          {
            id: 2,
            label: "📱 Can I speak to my daughter?",
            trigger: ['2', 'speak to daughter', 'call daughter', 'phone call'],
            response: "📱 Parent-Student Communication:\n\n📞 Regular Calls:\n• Every Sunday: 1 hour device access for video/phone calls\n\n🚨 Emergency Communication:\n• Pastoral team ensures immediate contact\n• Front desk available 24/7\n• Parents informed instantly in emergencies\n\nWe ensure you stay connected while maintaining a healthy campus life balance!"
          }
        ]
      },
      {
        id: 2,
        label: "2️⃣ Emotional Support System",
        trigger: ['2', 'emotional support', 'homesick', 'sad', 'counseling'],
        response: "💚 Emotional Support System:\n\nWhat would you like to know?",
        subOptions: [
          {
            id: 1,
            label: "💙 What if daughter feels homesick?",
            trigger: ['1', 'homesick', 'feeling sad', 'missing home'],
            response: "💚 Emotional Support:\n\nYes, we provide comprehensive emotional care:\n\n👩‍⚕️ Professional counselor on campus\n🏠 Caring dorm mothers\n👩‍🏫 Supportive teachers\n📞 Weekly video calls with parents\n👭 Small, close-knit community\n🤝 Regular check-ins & bonding sessions\n\nEvery girl receives continuous support to feel at home!"
          },
          {
            id: 2,
            label: "👩‍🏫 How is staff trained?",
            trigger: ['2', 'staff trained', 'teacher training', 'staff care'],
            response: "👩‍🏫 Staff Training:\n\nAll staff receive specialized training in:\n\n📚 Pastoral care\n🧠 Child psychology\n💚 Emotional support techniques\n🤝 Mentoring skills\n\nOur staff act as mentors, ensuring every student feels:\n✅ Supported ✅ Valued ✅ Heard ✅ Cared for"
          },
          {
            id: 3,
            label: "🆕 How do new students settle?",
            trigger: ['3', 'new student', 'settling in', 'transition'],
            response: "🎒 Helping New Students:\n\nWe know boarding life transition can be emotional:\n\n🤝 Support System:\n✅ Buddy pairing\n✅ Personal mentor assigned\n✅ Caring dorm mother\n✅ Orientation sessions\n✅ Interactive activities\n\nEvery child feels at home, understood, and cared for from day one!"
          }
        ]
      },
      {
        id: 3,
        label: "3️⃣ Food & Daily Routine",
        trigger: ['3', 'food', 'meal', 'routine', 'schedule'],
        response: "🍽️ Food & Daily Routine:\n\nWhat would you like to know?",
        subOptions: [
          {
            id: 1,
            label: "🍎 Meal Schedule",
            trigger: ['1', 'hungry', 'meal schedule', 'food timing'],
            response: "🍎 Meal Schedule:\n\nNo child ever goes hungry!\n\n☀️ 8:00 AM - Breakfast\n🍪 11:00 AM - Morning Snack\n🍽️ 1:00 PM - Lunch\n🥤 6:00 PM - Evening Snack\n🍲 9:00 PM - Dinner\n🥛 Before Bed - Glass of Milk\n\n✅ Students can keep healthy snacks in dorms\n✅ Staff ensures nutritious, satisfying meals"
          },
          {
            id: 2,
            label: "🍽️ Food Quality & Nutrition",
            trigger: ['2', 'food quality', 'nutrition', 'what food'],
            response: "🍽️ Food & Nutrition:\n\nMeals are:\n✅ Nutritious & diverse\n✅ Lovingly prepared\n✅ Curated by nutritionist\n✅ Mix of Indian & Continental\n\n👩‍🍳 Personal Care:\n• Pastoral team supervises mealtimes\n• Ensures no one skips meals\n• Makes sure each student eats properly"
          },
          {
            id: 3,
            label: "📅 Daily Routine",
            trigger: ['3', 'daily routine', 'schedule', 'typical day'],
            response: "📅 Daily Routine:\n\nBalanced routine includes:\n\n📚 Academics\n⚽ Sports & Physical Activities\n🎨 Co-curricular Activities\n📖 Self-Study Time\n😌 Relaxation Periods\n\n🌅 Evenings: Outdoor play\n🎯 Weekends: Hobbies & recreation\n\nPerfect balance of learning, activity, and rest!"
          }
        ]
      },
      {
        id: 4,
        label: "4️⃣ Safety & Security",
        trigger: ['4', 'safety', 'secure', 'bullying', 'protection'],
        response: "🛡️ Safety & Security:\n\nWhat would you like to know?",
        subOptions: [
          {
            id: 1,
            label: "🛡️ Security Measures",
            trigger: ['1', 'security', 'how safe', 'campus security'],
            response: "🛡️ Safety Measures:\n\n📹 24x7 CCTV surveillance\n👮 Trained security personnel\n🚪 Restricted entry with ID\n🏠 Round-the-clock dorm supervision\n🚨 Regular safety drills\n\nYour daughter's safety is our top priority with multiple protection layers!"
          },
          {
            id: 2,
            label: "🚫 Bullying Policy",
            trigger: ['2', 'bullying', 'bullied', 'unsafe', 'harassment'],
            response: "🚫 Zero-Tolerance Bullying:\n\nSTRICT zero-tolerance policy:\n\n✅ Students encouraged to speak with:\n• Dorm mothers • Counselors • Teachers\n\n📮 Multiple reporting channels:\n• Suggestion boxes\n• Feedback mechanisms\n• Regular meetings with leadership\n\n⚡ All concerns addressed promptly, confidentially!"
          },
          {
            id: 3,
            label: "🚨 Emergency Protocols",
            trigger: ['3', 'emergency', 'emergency protocol', 'crisis'],
            response: "🚨 Emergency Protocols:\n\nWell-defined procedures:\n\n✅ Trained staff & pastoral team\n✅ Handled with:\n• Utmost care\n• Calm approach\n• Empathy\n\n📞 Parents informed immediately\n\nYour child's safety is our top priority!"
          }
        ]
      },
      {
        id: 5,
        label: "5️⃣ Medical & Special Needs",
        trigger: ['5', 'medical', 'health', 'special needs', 'dietary'],
        response: "🏥 Medical & Special Needs:\n\nWhat would you like to know?",
        subOptions: [
          {
            id: 1,
            label: "🏥 Medical Facilities",
            trigger: ['1', 'medical facility', 'doctor', 'infirmary' ,'is medical facility available in school', ],
            response: "🏥 Medical Facilities:\n\n✅ Fully equipped infirmary - 24/7\n👩‍⚕️ Qualified female doctor & nurses\n🚑 School ambulance available\n🏥 Tie-ups with hospitals:\n• Graphic Era\n• Synergy\n• Max Hospital\n\n📞 Parents informed immediately in any medical situation!"
          },
          {
            id: 2,
            label: "🍽️ Special Dietary Needs",
            trigger: ['2', 'special dietary', 'allergies', 'food allergy'],
            response: "🏥 Special Dietary Needs:\n\nEvery child's well-being is personally attended:\n\n✅ Parents share:\n• Medical conditions\n• Allergies\n• Dietary preferences\n\n🍽️ Customized Care:\n• Meals tailored individually\n• Care plans personalized\n• Same attention as home\n\nYour daughter receives exactly what she needs!"
          }
        ]
      },
      {
        id: 6,
        label: "6️⃣ Academic Balance",
        trigger: ['6', 'balance', 'academics', 'extracurricular', 'holistic'],
        response: "⚖️ Academic Balance:\n\nWhat would you like to know?",
        subOptions: [
          {
            id: 1,
            label: "⚖️ How is balance maintained?",
            trigger: ['1', 'balance academics', 'study balance', 'how balance'],
            response: "⚖️ Academic & Extracurricular Balance:\n\nEvery child is unique with her own strengths:\n\n📚 Structured timetable ensures:\n✅ Equal importance to academics, sports, arts & leadership\n✅ Flexibility for individual needs\n\n🏃‍♀️ Sports enthusiasts: Encouraged\n📖 Academic focused: Time & support\n\nNo compromise on fitness or creative growth! Balance that nurtures intellect and individuality."
          }
        ]
      }
    ]
  },

  // ==============================================
  // OTHER SCHOOL INFORMATION
  // ==============================================

  founder: {
    keywords: ['founder', 'established', 'history', 'who started', 'foundation', 'when founded'],
    answer: "🏫 Vantage Hall Girls' Residential School was established in 2013 with a vision to provide world-class boarding education for girls in a nurturing and empowering environment."
  },

  affiliation: {
    keywords: ['affiliation', 'cbse code', 'board affiliation', 'school code'],
    answer: "📘 The school is affiliated to the Central Board of Secondary Education (CBSE), New Delhi."
  },

  location: {
    keywords: ['location', 'map', 'how to reach', 'directions', 'bus stop', 'address'],
    answer: "📍 Vantage Hall is located in Doonga, Dehradun — about 10 km from the city centre. Easily accessible via Sahaspur Road & Rajpur Road.\n🗺 Google Maps: https://maps.app.goo.gl/F9okR4GADbhN9x5G8"
  },

  faculty: {
    keywords: ['faculty', 'teachers', 'staff', 'teaching quality', 'teacher qualification'],
    answer: `🏫 All faculty members are highly qualified professionals with CBSE teaching certifications. Many hold postgraduate degrees and have years of teaching and mentoring experience.\n🔗 Learn more: <a href='https://vantagehall.org/teachers-bio/' target='_blank'>vantagehall.org/teachers-bio</a>`
  },
  
  smart_class: {
    keywords: ['smart class', 'technology', 'digital classroom', 'computer lab', 'ERP', 'online learning'],
    answer: "💻 Digital & Smart Learning:\n• Smart classrooms with interactive panels\n• Computer & Robotics Labs\n• Wi-Fi-enabled learning environment\n• Integrated Edunext ERP for attendance, grades & communication"
  },

  safety: {
    keywords: ['safety', 'security', 'cctv', 'warden', 'camera', 'rules'],
    answer: "🛡 Safety & Security:\n• 24x7 wardens in each hostel block\n• CCTV surveillance in corridors & common areas\n• Controlled visitor access with ID verification\n• Strict discipline & conduct policy"
  },

  campus: {
    keywords: ['campus', 'infrastructure', 'library', 'labs', 'facilities available', 'auditorium'],
    answer: "🏫 Campus Facilities:\n• 12-acre lush green campus\n• Modern academic blocks & labs\n• Fully stocked library\n• Amphitheatre & multi-purpose auditorium\n• Indoor & outdoor sports arenas"
  },


  medical: {
  keywords: [
    'medical',
    'medical facilities',
    'health',
    'doctor',
    'hospital',
    'infirmary',
    'ambulance'
  ],
  answer: "🏥 <a href='https://vantagehall.org/medical-services-boarding-school-dehradun/' target='_blank'>Medical Facilities</a>:\n\n✅ Fully equipped infirmary – 24/7\n👩‍⚕️ Qualified female doctor & nurses\n🚑 School ambulance available\n🏥 Tie-ups with hospitals:\n• Graphic Era\n• Synergy\n• Max Hospital\n\n📞 Parents are informed immediately in any medical situation!"
},

  vision: {
    keywords: ['vision', 'goal', 'objective', 'purpose', 'mission'],
    answer: "🎯 Our Vision & Mission:\n\nTo nurture happy, independent, and unique individuals in a safe and supportive environment."
  },

  curriculum: {
    keywords: ['curriculum', 'board', 'cbse', 'syllabus', 'academics system', 'what subject', 'subjects taught'],
    answer: "📚 We follow the CBSE curriculum with a well-balanced, student-centric academic programme that encourages holistic learning and critical thinking.<br><br>🎓 Streams Offered (Classes 11-12):<br>• Science<br>• Commerce<br>• Humanities<br><br>Our curriculum emphasizes holistic development beyond textbooks, including hands-on activities, critical thinking, and creative expression. For full information, visit: <a href='https://vantagehall.org/curriculum/' target='_blank'>Curriculum</a>"
  },

  timings: {
    keywords: ['timing', 'time', 'hour', 'schedule', 'start'],
    answer: "🕐 School Timings:\n\n• Grades 3-9: 7:45 AM - 12:55 PM\n• Grades 10-12: 7:45 AM - 1:35 PM\n• Activity Classes: 2:45 PM - 4:05 PM"
  },

  ratio: {
    keywords: ['ratio', 'student', 'teacher', 'class size', 'students per'],
    answer: "👩‍🏫 Student-Teacher Ratio: 1:5\n\nWe maintain small class sizes to ensure personalized attention and effective learning for every student."
  },

  eligibility: {
    keywords: ['eligibility', 'eligible', 'criteria', 'qualify', 'who can', 'age'],
    answer: "📝 Eligibility Criteria:\n\n✅ Classes: 3-12\n✅ Age: As per CBSE guidelines\n✅ Eligibility: Successful completion of previous grade\n✅ Required: Transfer Certificate and Report Card\n⚠️ Note: Admission to Class 10 is considered only in exceptional cases"
  },

  admission: {
    keywords: ['admission', 'admit', 'process of admission', 'enroll', 'join', 'apply'],
    answer: "📝 Admission Process:<br><br>✅ Step 1: Written Test (English, Mathematics, Science)<br>✅ Step 2: Interaction with Principal<br>✅ Step 3: Interaction with Director<br><br>📅 Registrations: September-October<br>📅 Session Starts: April<br><br>📞 Contact:<br>+91-8191912999, +91-7078311863<br>📧 admissions@vantagehall.org<br>🔗 <a href='https://vantagehall.org/admission-procedure/' target='_blank'>Admission Procedure</a> for complete details"
  },

  documents: {
    keywords: ['document', 'paper', 'certificate', 'required', 'need', 'bring'],
    answer: "📄 Required Documents:\n\n• Birth Certificate & Aadhaar Card\n• Parents' Aadhaar & PAN Cards\n• Last examination mark sheet\n• Original Transfer Certificate\n• Medical Fitness Certificate\n• Student's PEN Number / APAAR ID"
  },

  fee: {
    keywords: ['fee', 'fees', 'cost', 'tuition', 'charge', 'payment', 'price'],
    answer: "💰 Fee Structure:<br><br>📌 Classes 3-7: ₹7,35,000 (Annual: ₹5,50,000 + One-time: ₹1,85,000)<br><br>📌 Classes 8-10: ₹8,35,000 (Annual: ₹6,50,000 + One-time: ₹1,85,000)<br><br>📌 Classes 11-12: ₹8,85,000 (Annual: ₹7,00,000 + One-time: ₹1,85,000)<br><br>*One-time fees include registration, joining kit, imprest deposit & admission fee.<br><br>For full details, visit: <a href='https://vantagehall.org/fee-structure/' target='_blank'>Fee Structure</a>"
  },

  hostel: {
    keywords: ['hostel', 'hostel facilities', 'boarding', 'residential', 'accommodation', 'room'],
    answer: "🏡 Hostel Facilities:\n\n✨ Well-furnished dormitories with beds, storage, study tables & wardrobes\n✨ Separate hostels for juniors & seniors\n✨ Regular laundry service\n✨ Daily housekeeping\n✨ 24/7 supervision by wardens\n✨ Safe & supportive environment"
  },

  food: {
    keywords: ['food', 'dining', 'menu', 'meal', 'lunch', 'dinner', 'breakfast', 'diet'],
    answer: "🍽️ Dining & Nutrition:\n\n✅ Nutritionist-planned meals\n✅ Special diets for athletes & medical needs\n✅ Veg & non-veg options\n✅ Menu rotates every 15 days\n\n🥗 Daily Meals:\n• Breakfast: Fruits, cereals, milk, eggs, bread/parathas\n• Lunch: Dal, rice/roti, vegetables, salad\n• Dinner: Similar to lunch with variety\n• Night Milk: Mandatory"
  },

  sports: {
    keywords: ['sports', 'sport available', 'games', 'what sports', 'sports facilities', 'athletics', 'physical education', 'football', 'cricket', 'basketball', 'swimming', 'which sports'],
    answer: "⚽ Sports & Athletics:<br><br>Training under qualified coaches in:<br><br>🏃‍♀️ Football, Self Defense, Basketball,<br>🎾 Squash, Badminton, Zumba Classes, Table Tennis<br>⛸️ Skating, Gymnasium, Swimming<br>♟️ Indoor Games: Chess<br><br>For full details, visit: <a href='https://vantagehall.org/sports-facilities/' target='_blank'>Sports Facilities</a>"
  },

  clubs: {
    keywords: ['club', 'activity', 'extracurricular', 'societies', 'hobby'],
    answer: "🎨 Clubs & Societies:<br><br>• Art Club<br>• Culinary Club<br>• Dance & Music Club<br>• Theatre Club<br>• Finance & Maths Club<br>• IT Club<br>• Science Club<br>• Photography Club<br>• Sustainability Club<br>• Editorial Board<br><br>Explore more activities at: <a href='https://vantagehall.org/clubs/' target='_blank'>Clubs & Activities</a>"
  },

  career: {
    keywords: ['career', 'guidance', 'college', 'university', 'neet', 'jee', 'clat'],
    answer: "🎯 Career Guidance:\n\nWe offer counseling for Grades 8-12, including:\n\n✅ Medical (NEET)\n✅ Engineering (JEE)\n✅ Law (CLAT, AILET)\n✅ Management (IPM, NMIMS)\n✅ Design (NIFT, UCEED)\n✅ SAT & AP (foreign universities)\n\n1-on-1 guidance sessions available!"
  },

  contact: {
    keywords: ['contact', 'phone', 'email', 'address', 'reach', 'call', 'number'],
    answer: "📍 Vantage Hall Girls' Residential School\nThe Yellow Brick Road, Doonga\nDehradun - 248007, Uttarakhand\n📞 General: <a href='tel:01352776225'>0135-2776225</a>, <a href='tel:01352776226'>226</a>, <a href='tel:01352776227'>227</a>, <a href='tel:01352776228'>228</a>\n📧 <a href='mailto:info@vantagehall.org'>info@vantagehall.org</a>\n\n👤 Admissions:\n📞 <a href='tel:+918191912999'>+91-8191912999</a>, <a href='tel:+917078311863'>+91-7078311863</a>\n📧 <a href='mailto:admissions@vantagehall.org'>admissions@vantagehall.org</a>\n🔗 Contact page: <a href='https://vantagehall.org/contact-us' target='_blank'>vantagehall.org/contact-us</a>"
  }
};

// ==============================================
// ✅ NEW: EMAIL SENDING FUNCTION
// ==============================================
async function sendCallbackEmail(userDetails, query, callbackNumber) {
  try {
    const mailOptions = {
      from: EMAIL_CONFIG.auth.user,
      to: ADMIN_EMAIL,
      subject: '🔔 Callback Request - Vantage Hall Chatbot',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 30px auto;
              background-color: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #1a3a52 0%, #0d2436 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 30px;
            }
            .info-row {
              margin: 15px 0;
              padding: 15px;
              background-color: #f9f9f9;
              border-left: 4px solid #1a3a52;
              border-radius: 4px;
            }
            .label {
              font-weight: bold;
              color: #1a3a52;
              font-size: 14px;
              margin-bottom: 5px;
            }
            .value {
              color: #333;
              font-size: 16px;
            }
            .callback-number {
              background-color: #d4536c;
              color: white;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              margin: 20px 0;
            }
            .callback-number .number {
              font-size: 28px;
              font-weight: bold;
              letter-spacing: 2px;
            }
            .query-box {
              background-color: #fff3cd;
              border: 1px solid #ffc107;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              background-color: #f9f9f9;
              color: #666;
              font-size: 12px;
            }
            .timestamp {
              color: #999;
              font-size: 12px;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📞 New Callback Request</h1>
              <p>From Vantage Hall Chatbot</p>
            </div>
            
            <div class="content">
              <div class="callback-number">
                <div class="label">CALLBACK NUMBER</div>
                <div class="number">📱 ${callbackNumber}</div>
              </div>
              
              <div class="info-row">
                <div class="label">👤 User Name</div>
                <div class="value">${userDetails.name}</div>
              </div>
              
              <div class="info-row">
                <div class="label">📧 Email Address</div>
                <div class="value">${userDetails.email}</div>
              </div>
              
              <div class="info-row">
                <div class="label">📱 Registered Phone</div>
                <div class="value">${userDetails.phone}</div>
              </div>
              
              <div class="query-box">
                <div class="label">❓ User's Query</div>
                <div class="value" style="margin-top: 10px;">${query}</div>
              </div>
              
              <div class="timestamp">
                ⏰ Received: ${new Date().toLocaleString('en-IN', { 
                  timeZone: 'Asia/Kolkata',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            
            <div class="footer">
              <p>This is an automated message from Vantage Hall Chatbot System</p>
              <p>Please call back at your earliest convenience</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Callback email sent successfully!');
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return false;
  }
}

// ==============================================
// SMART KEYWORD MATCHING - UPDATED
// ==============================================
function findBestMatch(userMessage, lastTopic = null, lastOptionLevel = null, lastSelectedOption = null) {
  const msg = userMessage.toLowerCase().trim();
  
  // PRIORITY 1: Handle nested navigation (FAQ/Emotional) with proper context
  if (lastTopic && KNOWLEDGE_BASE[lastTopic]) {
    const topicData = KNOWLEDGE_BASE[lastTopic];
    
    if (topicData.hasOptions) {
      // If in sub-menu (second level)
      if (lastOptionLevel === 'sub' && lastSelectedOption !== null && lastSelectedOption !== undefined) {
        const mainOption = topicData.options[lastSelectedOption];
        if (mainOption && mainOption.subOptions) {
          // Check for EXACT matches in sub-options FIRST
          for (const subOption of mainOption.subOptions) {
            for (const trigger of subOption.trigger) {
              if (msg === trigger.toLowerCase()) {
                console.log(`✅ Sub-option exact match: ${trigger}`);
                return {
                  answer: subOption.response,
                  topic: lastTopic,
                  hasOptions: false,
                  selectedOption: null,
                  optionLevel: null,
                  isFAQMenu: topicData.isFAQMenu || false,
                  isEmotionalMenu: topicData.isEmotionalMenu || false
                };
              }
            }
          }
          
          // Then check for keyword matches
          for (const subOption of mainOption.subOptions) {
            for (const trigger of subOption.trigger) {
              if (trigger.toLowerCase().length > 1 && msg.includes(trigger.toLowerCase())) {
                console.log(`✅ Sub-option keyword match: ${trigger}`);
                return {
                  answer: subOption.response,
                  topic: lastTopic,
                  hasOptions: false,
                  selectedOption: null,
                  optionLevel: null,
                  isFAQMenu: topicData.isFAQMenu || false,
                  isEmotionalMenu: topicData.isEmotionalMenu || false
                };
              }
            }
          }
        }
      }
      
      // If in main menu (first level)
      if (lastOptionLevel === 'main' || !lastOptionLevel) {
        // Check for EXACT matches FIRST
        for (let i = 0; i < topicData.options.length; i++) {
          const option = topicData.options[i];
          for (const trigger of option.trigger) {
            if (msg === trigger.toLowerCase()) {
              console.log(`✅ Main option exact match: ${trigger} (index: ${i})`);
              if (option.subOptions) {
                return {
                  answer: option.response,
                  topic: lastTopic,
                  hasOptions: true,
                  options: option.subOptions,
                  selectedOption: i,
                  optionLevel: 'sub',
                  isFAQMenu: topicData.isFAQMenu || false,
                  isEmotionalMenu: topicData.isEmotionalMenu || false
                };
              }
              return {
                answer: option.response,
                topic: lastTopic,
                hasOptions: false,
                selectedOption: null,
                optionLevel: null,
                isFAQMenu: topicData.isFAQMenu || false,
                isEmotionalMenu: topicData.isEmotionalMenu || false
              };
            }
          }
        }
        
        // Then check for keyword matches
        for (let i = 0; i < topicData.options.length; i++) {
          const option = topicData.options[i];
          for (const trigger of option.trigger) {
            if (trigger.toLowerCase().length > 1 && msg.includes(trigger.toLowerCase())) {
              console.log(`✅ Main option keyword match: ${trigger} (index: ${i})`);
              if (option.subOptions) {
                return {
                  answer: option.response,
                  topic: lastTopic,
                  hasOptions: true,
                  options: option.subOptions,
                  selectedOption: i,
                  optionLevel: 'sub',
                  isFAQMenu: topicData.isFAQMenu || false,
                  isEmotionalMenu: topicData.isEmotionalMenu || false
                };
              }
              return {
                answer: option.response,
                topic: lastTopic,
                hasOptions: false,
                selectedOption: null,
                optionLevel: null,
                isFAQMenu: topicData.isFAQMenu || false,
                isEmotionalMenu: topicData.isEmotionalMenu || false
              };
            }
          }
        }
      }
    }
  }
  
  // PRIORITY 2: Search in global knowledge base
  let bestMatch = null;
  let highestScore = 0;
  
  for (const [topic, data] of Object.entries(KNOWLEDGE_BASE)) {
    let score = 0;
    let matchedKeywords = [];
    
    for (const keyword of data.keywords) {
      const keywordLower = keyword.toLowerCase();
      
      if (msg === keywordLower) {
        score += 100;
        matchedKeywords.push(keyword);
      }
      else if (new RegExp(`\\b${keywordLower}\\b`, 'i').test(msg)) {
        score += 50;
        matchedKeywords.push(keyword);
      }
      else if (msg.includes(keywordLower)) {
        score += 10;
        matchedKeywords.push(keyword);
      }
    }
    
    if (score > highestScore && score > 0) {
      highestScore = score;
      bestMatch = {
        answer: data.answer,
        topic: topic,
        score: score,
        matchedKeywords: matchedKeywords,
        hasOptions: data.hasOptions || false,
        options: data.options || null,
        isFAQMenu: data.isFAQMenu || false,
        isEmotionalMenu: data.isEmotionalMenu || false,
        selectedOption: null,
        optionLevel: data.hasOptions ? 'main' : null
      };
    }
  }
  
  if (bestMatch && bestMatch.score >= 10) {
    console.log(`✅ Best Match: ${bestMatch.topic} (Score: ${bestMatch.score})`);
    return bestMatch;
  }
  
  return null;
}

// ==============================================
// EMAIL NOTIFICATION FOR REGISTRATION
// ==============================================
async function sendAdminEmail(userDetails) {
  try {
    const mailOptions = {
      from: EMAIL_CONFIG.auth.user,
      to: ADMIN_EMAIL,
      subject: '🔔 New Chatbot User Registration - Vantage Hall',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-row { margin: 15px 0; padding: 12px; background: #f0f0f0; border-radius: 6px; }
            .label { font-weight: bold; color: #667eea; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🎓 New User Started Chat</h2>
              <p>Vantage Hall Chatbot</p>
            </div>
            <div class="content">
              <h3>User Details:</h3>
              <div class="info-row"><span class="label">👤 Name:</span><br>${userDetails.name}</div>
              <div class="info-row"><span class="label">📧 Email:</span><br>${userDetails.email}</div>
              <div class="info-row"><span class="label">📱 Phone:</span><br>${userDetails.phone}</div>
              <div class="info-row"><span class="label">🕐 Time:</span><br>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
            </div>
            <div class="footer">
              <p>This is an automated notification from Vantage Hall Chatbot System</p>
              <p>© ${new Date().getFullYear()} Vantage Hall Girls' Residential School</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to admin successfully!');
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return false;
  }
}

// ==============================================
// GOOGLE GEMINI API CALL - UPDATED
// ==============================================
async function callGemini(prompt) {
  if (!genAI) {
    throw new Error('Gemini API not initialized - API key missing');
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const systemContext = `You are a friendly assistant for Vantage Hall Girls' Residential School, Dehradun. 

School Information:
- Location: Doonga, Dehradun - 248007
- Phone: 0135-2776225
- Email: info@vantagehall.org
- Admissions: +91-8191912999, +91-7078311863

Guidelines:
- Answer ONLY questions about Vantage Hall school
- Keep responses friendly, warm, and concise
- For unrelated questions, politely redirect to school-related topics
- Use emojis appropriately to keep responses engaging
- If you don't know specific details, suggest contacting the school

User question: ${prompt}`;

    const result = await model.generateContent(systemContext);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('No response from Gemini');
    }

    console.log('✅ Gemini API responded successfully');
    return text;

  } catch (error) {
    console.error('❌ Gemini Error:', error.message);
    throw error;
  }
}

// ==============================================
// ENDPOINTS
// ==============================================
app.get('/', (req, res) => {
  res.json({
    status: '✅ Server Running',
    message: 'Vantage Hall Chatbot API - WITH EMAIL CALLBACK ✅',
    model: 'Google Gemini Pro (FREE) + Email Notifications',
    knowledgeBaseTopics: Object.keys(KNOWLEDGE_BASE).length,
    geminiConfigured: !!GEMINI_API_KEY,
    emailConfigured: !!EMAIL_CONFIG.auth.user,
    endpoints: {
      health: '/api/health',
      chat: '/api/chat (POST)',
      register: '/api/register (POST)',
      callback: '/api/callback-request (POST)', // ✅ NEW
      test: '/api/test'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    geminiConfigured: !!GEMINI_API_KEY,
    emailConfigured: !!EMAIL_CONFIG.auth.user
  });
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: 'All fields (name, email, phone) are required'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, '').slice(-10))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number'
      });
    }

    console.log('📝 New user registration:', { name, email, phone });
    const emailSent = await sendAdminEmail({ name, email, phone });

    res.json({
      success: true,
      message: 'Registration successful! You can now start chatting.',
      emailSent: emailSent
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed. Please try again.'
    });
  }
});

// ==============================================
// ✅ NEW: CALLBACK REQUEST ENDPOINT
// ==============================================
app.post('/api/callback-request', async (req, res) => {
  try {
    const { name, email, phone, query, callback_number } = req.body;

    if (!name || !email || !phone || !query || !callback_number) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Validate callback number
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanedNumber = callback_number.replace(/\D/g, '');
    if (!phoneRegex.test(cleanedNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid callback number'
      });
    }

    console.log('📞 New callback request:', { name, callback_number, query });
    
    // Send email
    const emailSent = await sendCallbackEmail(
      { name, email, phone },
      query,
      cleanedNumber
    );

    if (emailSent) {
      res.json({
        success: true,
        message: 'Callback request received successfully'
      });
    } else {
      res.json({
        success: false,
        message: 'Failed to send email notification'
      });
    }

  } catch (error) {
    console.error('❌ Callback request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process callback request'
    });
  }
});

app.get('/api/test', async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.json({
        success: true,
        message: '✅ Server is working!',
        geminiStatus: 'Not configured (using Knowledge Base only)',
        emailStatus: EMAIL_CONFIG.auth.user ? 'Configured ✅' : 'Not configured',
        knowledgeBaseTopics: Object.keys(KNOWLEDGE_BASE).length,
        mode: 'Knowledge Base Mode'
      });
    }

    const reply = await callGemini('Say "Hello! The Gemini API is working!" in one sentence.');
    res.json({ 
      success: true, 
      message: '✅ Gemini API is WORKING!',
      testReply: reply,
      emailStatus: EMAIL_CONFIG.auth.user ? 'Configured ✅' : 'Not configured',
      knowledgeBaseTopics: Object.keys(KNOWLEDGE_BASE).length,
      model: 'Google Gemini Pro'
    });
  } catch (error) {
    res.json({ 
      success: true, 
      message: '✅ Server is working!',
      geminiStatus: 'Unavailable (' + error.message + ')',
      emailStatus: EMAIL_CONFIG.auth.user ? 'Configured ✅' : 'Not configured',
      fallbackMode: 'Using comprehensive Knowledge Base',
      knowledgeBaseTopics: Object.keys(KNOWLEDGE_BASE).length
    });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, lastTopic, lastOptionLevel, lastSelectedOption } = req.body;

    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    console.log(`📩 User: ${message}`);
    if (lastTopic) {
      console.log(`📌 Context - Topic: ${lastTopic}, Level: ${lastOptionLevel || 'main'}, Selected: ${lastSelectedOption}`);
    }

    const GREETINGS = [
      "Hello! 👋 Welcome to Vantage Hall Girls' Residential School. How can I help you today?",
      "Hi there! I'm here to answer your questions about Vantage Hall. What would you like to know?"
    ];

    const GENERAL_FALLBACK = [
      "For better assistance, we recommend connecting with us directly. 📞\n\nPlease feel free to contact our organization using the details below:\n\n📞 Phone: 0135-2776225\n📱 Mobile: +91-8191912999\n📧 Email: info@vantagehall.org\n\nOur team will be happy to assist you.",
      "We believe direct communication works best. 😊\n\nKindly reach out to our organization through the contact details mentioned below:\n\n📞 0135-2776225\n📱 +91-8191912999\n📧 info@vantagehall.org\n\nWe look forward to assisting you."
    ];

    // Handle greetings
    if (/^(hi|hello|hey|good morning|good afternoon|good evening)/i.test(message.trim())) {
      const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
      return res.json({ 
        success: true, 
        reply: greeting,
        mode: 'greeting'
      });
    }

    // Try knowledge base first
    const knowledgeMatch = findBestMatch(message, lastTopic, lastOptionLevel, lastSelectedOption);
    
    if (knowledgeMatch) {
      console.log(`✅ Knowledge Base Match - Topic: ${knowledgeMatch.topic}`);
      
      let reply = knowledgeMatch.answer;
      
      if (knowledgeMatch.hasOptions && knowledgeMatch.options) {
        reply += "\n\n";
        knowledgeMatch.options.forEach(opt => {
          reply += `${opt.label}\n`;
        });
      }
      
      return res.json({ 
        success: true, 
        reply: reply,
        mode: 'knowledge-base',
        hasOptions: knowledgeMatch.hasOptions,
        options: knowledgeMatch.options || null,
        currentTopic: knowledgeMatch.topic,
        optionLevel: knowledgeMatch.optionLevel || null,
        selectedOption: knowledgeMatch.selectedOption,
        isFAQMenu: knowledgeMatch.isFAQMenu || false,
        isEmotionalMenu: knowledgeMatch.isEmotionalMenu || false
      });
    }

    // Try Gemini API if configured
    if (GEMINI_API_KEY) {
      try {
        const reply = await callGemini(message);
        
        return res.json({ 
          success: true, 
          reply: reply.trim() + "\n\n🤖 *Powered by Google Gemini*",
          mode: 'ai-powered'
        });
        
      } catch (geminiError) {
        console.log('⚠️ Gemini unavailable, triggering callback'); // ✅ UPDATED
      }
    }

    // ✅ NEW: If no match found, trigger callback collection
    console.log('🔄 No match found - triggering callback collection');
    return res.json({ 
      success: true, 
      reply: "I apologize, but I don't have specific information about that right now. 😊\n\nWould you like me to have someone from our team call you back to answer your question?\n\nIf yes, please provide your contact number below:",
      mode: 'callback-request',
      requiresCallback: true,
      userQuery: message
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    res.json({
      success: true,
      reply: `I can help you with Vantage Hall information! 😊\n\nFor detailed assistance:\n📞 Call: 0135-2776225\n📧 Email: info@vantagehall.org\n📱 Admissions: +91-8191912999`,
      mode: 'emergency-fallback'
    });
  }
});

// ==============================================
// START SERVER
// ==============================================
app.listen(PORT, () => {
  console.log('\n╔═══════════════════════════════════════════╗');
  console.log('║   🎓 Vantage Hall Chatbot Server            ║');
  console.log('╚═══════════════════════════════════════════╝');
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`🧪 Test API: http://localhost:${PORT}/api/test`);
  console.log(`🤖 AI Model: ${GEMINI_API_KEY ? 'Google Gemini Pro ✅' : 'Not Configured ⚠️'}`);
  console.log(`📚 Knowledge Base: ${Object.keys(KNOWLEDGE_BASE).length} topics ✅`);
  console.log(`📧 Email: ${EMAIL_CONFIG.auth.user !== 'your-email@gmail.com' ? 'Configured ✅' : 'Not Configured ❌'}`);
  console.log(`✅ FAQ Navigation: Working`);
  console.log(`💚 Emotional Quotient: Added`);
  console.log(`⬅️ Back to Menu: Enabled`);
  console.log(`📞 Callback System: Active ✅`); // ✅ NEW
  console.log(`🔧 Fallback Mode: ${GEMINI_API_KEY ? 'Gemini Primary → Callback' : 'Knowledge Base → Callback'}`);
  console.log('╚═══════════════════════════════════════════\n');
  console.log('🚀 Ready to chat with email callback support!\n');
  
  if (!GEMINI_API_KEY) {
    console.log('⚠️ NOTE: Gemini API key not configured.');
    console.log('   Chatbot will use Knowledge Base + Callback system.\n');
  }
  
  if (EMAIL_CONFIG.auth.user === 'your-email@gmail.com') {
    console.log('⚠️ IMPORTANT: Update email credentials in .env file!');
    console.log('   Callback emails will not be sent until configured.\n');
  }
});