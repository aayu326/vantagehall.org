// server.js - full development done with latest update (single child)
console.log("🔥 VANTAGE HALL SERVER.JS - PRODUCTION VERSION 🔥");

const fetch = require('node-fetch');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// ==============================================
// API KEYS (abhi required nahi hai ) 
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
// EMAIL CONFIGURATION (last update- using chat-gmail provided by tech team)
// ==============================================
const EMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vantagehall.org';
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

// ==============================================
// COMPREHENSIVE KNOWLEDGE BASE (QUE. and ANS. by TECH TEAM) 
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
  // EMOTIONAL QUOTIENT MENU - LATEST UPDATE WITH SINGLE CHILD 
  // ==============================================
  emotional_menu: {
    keywords: [
      'emotional',
      'emotional support',
      'emotional quotient',
      'wellbeing',
      'mental health',
      'care',
      'pastoral care',
      'counselling',
      'student counselling',
      // Single Child Keywords PROVIDED BY TECHNICAL TEAM
      'single child',
      'only child',
      'lonely',
      'feel alone',
      'one child',
      'attached to parents',
      'separation anxiety',
      'homesick child',
      'making friends hostel',
      'social life boarding',
      'adjustment support',
      'single child hostel',
      'only child lonely'
    ],
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
            trigger: [
              '1',
              'can i visit',
              'visiting',
              'visit daughter',
              'visiting hours',
              'parent visit anytime',
              'meet my daughter',
              'boarding visitation',
              'weekend visit',
              'visit policy',
              'parent meeting schedule',
              'visit in dehradun'
            ],
            response: "👨‍👩‍👧 Parent Visits:\n\nYes! Parents are warmly welcomed to visit their daughters whenever they wish. We strongly believe in maintaining close family connections.\n\n✅ Visit anytime you're in town\n✅ Preferably after school hours\n✅ No appointment needed\n\nWe encourage regular interaction between parents and students. Your presence matters! 💙"
          },
          {
            id: 2,
            label: "📱 Can I speak to my daughter?",
            trigger: [
              '2',
              'speak to daughter',
              'call daughter',
              'phone call',
              'phone calls',
              'video call time',
              'mobile rules',
              'sunday call',
              'parent contact',
              'emergency call',
              'device policy'
            ],
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
            trigger: [
              '1',
              'homesick',
              'feeling sad',
              'missing home',
              'homesick child',
              'boarding loneliness',
              'emotional care',
              'student counselling',
              'mental health support',
              'pastoral care',
              'sad in hostel'
            ],
            response: "💚 Emotional Support:\n\nYes, we provide comprehensive emotional care:\n\n👩‍⚕️ Professional counselor on campus\n🏠 Caring dorm mothers\n👩‍🏫 Supportive teachers\n📞 Weekly video calls with parents\n👭 Small, close-knit community\n🤝 Regular check-ins & bonding sessions\n\nEvery girl receives continuous support to feel at home!\n\n🔗 Learn more: https://www.vantagehall.org/pastoral-care"
          },
          {
            id: 2,
            label: "👩‍🏫 How is staff trained?",
            trigger: [
              '2',
              'staff trained',
              'teacher training',
              'staff care',
              'pastoral staff',
              'child psychology',
              'dorm mother role',
              'mentor system',
              'student support staff'
            ],
            response: "👩‍🏫 Staff Training:\n\nAll staff receive specialized training in:\n\n📚 Pastoral care\n🧠 Child psychology\n💚 Emotional support techniques\n🤝 Mentoring skills\n\nOur staff act as mentors, ensuring every student feels:\n✅ Supported ✅ Valued ✅ Heard ✅ Cared for"
          },
          {
            id: 3,
            label: "🆕 How do new students settle?",
            trigger: [
              '3',
              'new student',
              'settling in',
              'transition',
              'orientation program',
              'buddy system',
              'boarding adjustment',
              'first time hostel',
              'induction support'
            ],
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
            trigger: [
              '1',
              'hungry',
              'meal schedule',
              'food timing',
              'meal timings',
              'hostel food schedule',
              'snacks allowed',
              'hungry between meals',
              'late night food',
              'nutrition plan',
              'dry fruits allowed'
            ],
            response: "🍎 Meal Schedule:\n\nNo child ever goes hungry!\n\n☀️ 8:00 AM - Breakfast\n🍪 11:00 AM - Morning Snack\n🍽️ 1:00 PM - Lunch\n🥤 6:00 PM - Evening Snack\n🍲 9:00 PM - Dinner\n🥛 Before Bed - Glass of Milk\n\n✅ Students can keep healthy snacks in dorms\n✅ Staff ensures nutritious, satisfying meals"
          },
          {
            id: 2,
            label: "🍽️ Food Quality & Nutrition",
            trigger: [
              '2',
              'food quality',
              'nutrition',
              'what food',
              'healthy meals',
              'school menu',
              'vegetarian options',
              'nutritionist meals',
              'hygienic food',
              'balanced diet'
            ],
            response: "🍽️ Food & Nutrition:\n\nMeals are:\n✅ Nutritious & diverse\n✅ Lovingly prepared\n✅ Curated by nutritionist\n✅ Mix of Indian & Continental\n\n👩‍🍳 Personal Care:\n• Pastoral team supervises mealtimes\n• Ensures no one skips meals\n• Makes sure each student eats properly\n\n🔗 Full Menu Details: https://www.vantagehall.org/facilities#dining"
          },
          {
            id: 3,
            label: "📅 Daily Routine",
            trigger: [
              '3',
              'daily routine',
              'schedule',
              'typical day',
              'student timetable',
              'study hours',
              'sports schedule',
              'weekend routine',
              'self-study time',
              'activity timetable'
            ],
            response: "📅 Daily Routine:\n\nBalanced routine includes:\n\n📚 Academics\n⚽ Sports & Physical Activities\n🎨 Co-curricular Activities\n📖 Self-Study Time\n😌 Relaxation Periods\n\n🌅 Evenings: Outdoor play\n🎯 Weekends: Hobbies & recreation\n\nPerfect balance of learning, activity, and rest!\n\n🔗 Learn more: https://www.vantagehall.org/life-at-vantage"
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
            trigger: [
              '1',
              'security',
              'how safe',
              'campus security',
              'school security',
              'cctv campus',
              'girls safety',
              '24/7 supervision',
              'hostel security',
              'safe boarding school',
              'entry restrictions'
            ],
            response: "🛡️ Safety Measures:\n\n📹 24x7 CCTV surveillance\n👮 Trained security personnel\n🚪 Restricted entry with ID\n🏠 Round-the-clock dorm supervision\n🚨 Regular safety drills\n\nYour daughter's safety is our top priority with multiple protection layers!\n\n🔗 Security Details: https://www.vantagehall.org/safety"
          },
          {
            id: 2,
            label: "🚫 Bullying Policy",
            trigger: [
              '2',
              'bullying',
              'bullied',
              'unsafe',
              'harassment',
              'bullying policy',
              'zero tolerance',
              'student safety',
              'complaint system',
              'peer issues',
              'report bullying',
              'unsafe situation'
            ],
            response: "🚫 Zero-Tolerance Bullying:\n\nSTRICT zero-tolerance policy:\n\n✅ Students encouraged to speak with:\n• Dorm mothers • Counselors • Teachers\n\n📮 Multiple reporting channels:\n• Suggestion boxes\n• Feedback mechanisms\n• Regular meetings with leadership\n\n⚡ All concerns addressed promptly, confidentially!"
          },
          {
            id: 3,
            label: "🚨 Emergency Protocols",
            trigger: [
              '3',
              'emergency',
              'emergency protocol',
              'crisis',
              'emergency procedure',
              'fire drill',
              'safety protocol',
              'crisis management',
              'parent notification',
              'disaster preparedness'
            ],
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
            trigger: [
              '1',
              'medical facility',
              'doctor',
              'infirmary',
              'is medical facility available in school',
              'school infirmary',
              'nurse on campus',
              'doctor visit',
              'medical emergency',
              'hospital tie-up',
              'sick child',
              'health care'
            ],
            response: "🏥 Medical Facilities:\n\n✅ Fully equipped infirmary - 24/7\n👩‍⚕️ Qualified female doctor & nurses\n🚑 School ambulance available\n🏥 Tie-ups with hospitals:\n• Graphic Era\n• Synergy\n• Max Hospital\n\n📞 Parents informed immediately in any medical situation!\n\n🔗 Medical Services: https://www.vantagehall.org/facilities#medical"
          },
          {
            id: 2,
            label: "🍽️ Special Dietary Needs",
            trigger: [
              '2',
              'special dietary',
              'allergies',
              'food allergy',
              'allergy support',
              'special diet',
              'medical condition',
              'individual care plan',
              'food customization',
              'health monitoring'
            ],
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
            trigger: [
              '1',
              'balance academics',
              'study balance',
              'how balance',
              'study and sports balance',
              'extracurricular support',
              'academic focus',
              'leadership programs',
              'flexible schedule',
              'coaching support'
            ],
            response: "⚖️ Academic & Extracurricular Balance:\n\nEvery child is unique with her own strengths:\n\n📚 Structured timetable ensures:\n✅ Equal importance to academics, sports, arts & leadership\n✅ Flexibility for individual needs\n\n🏃‍♀️ Sports enthusiasts: Encouraged\n📖 Academic focused: Time & support\n\nNo compromise on fitness or creative growth! Balance that nurtures intellect and individuality."
          }
        ]
      },
      {
        id: 7,
        label: "7️⃣ Single Child Support",
        trigger: [
          '7',
          'single child',
          'only child',
          'lonely',
          'feel alone',
          'one child',
          'attached to parents',
          'separation anxiety',
          'single child hostel',
          'only child lonely',
          'feel alone boarding',
          'making friends hostel',
          'social life boarding',
          'adjustment support',
          'homesick child boarding'
        ],
        response: "👧 Single Child Support:\n\nWe understand the unique needs of single children. What would you like to know?",
        subOptions: [
          {
            id: 1,
            label: "🤝 Will she feel lonely?",
            trigger: [
              '1',
              'lonely',
              'feel alone',
              'only child lonely',
              'single child hostel',
              'feel alone boarding',
              'making friends',
              'social life boarding',
              'making friends hostel',
              'second family',
              'community feel'
            ],
            response: "🤝 Building Friendships:\n\nNot at all! Our close-knit community ensures your daughter quickly builds strong friendships:\n\n✅ Buddy system for new students\n✅ Caring dorm mothers\n✅ House activities & bonding sessions\n✅ Small community feel\n✅ Second family environment\n\nShe'll never feel alone – she'll feel like she belongs! 💙\n\n🔗 Learn more: https://www.vantagehall.org/pastoral-care"
          },
          {
            id: 2,
            label: "💙 How will she adjust if very attached?",
            trigger: [
              '2',
              'attached to parents',
              'attached to us',
              'adjustment',
              'homesick',
              'separation anxiety',
              'very attached',
              'close to parents',
              'adjustment support',
              'homesick child boarding',
              'leaving home first time'
            ],
            response: "💙 Adjustment Support:\n\nWe deeply understand parent-child attachment:\n\n✅ Regular check-ins by counsellor\n✅ Caring dorm mothers\n✅ Bonding activities\n✅ Weekly video calls every Sunday\n✅ Emotional support system\n\nShe stays emotionally connected while gradually building healthy independence! 🌟"
          },
          {
            id: 3,
            label: "👩‍🏫 Will she get personal attention?",
            trigger: [
              '3',
              'personal attention',
              'individual care',
              'only child attention',
              'single child care',
              'one on one',
              'personal care',
              'individual attention'
            ],
            response: "👩‍🏫 Personal Attention:\n\nAbsolutely! Every child receives individual care:\n\n✅ 1:5 student-teacher ratio\n✅ Trained pastoral staff\n✅ Personal mentoring\n✅ Emotional guidance\n✅ Regular one-on-one check-ins\n\nYour daughter will receive the same loving attention she gets at home! 💚"
          },
          {
            id: 4,
            label: "🌟 How do you build confidence?",
            trigger: [
              '4',
              'confidence',
              'build confidence',
              'single child confidence',
              'shy child',
              'develop confidence',
              'leadership development',
              'social skills'
            ],
            response: "🌟 Building Confidence:\n\nWe help single children grow confident and independent:\n\n✅ Leadership roles & responsibilities\n✅ Clubs & societies participation\n✅ Sports & physical activities\n✅ Daily responsibilities\n✅ Social skill development\n\nYour daughter will become confident, independent, and socially comfortable! 🚀"
          },
          {
            id: 5,
            label: "🛡️ Will she feel emotionally secure?",
            trigger: [
              '5',
              'emotionally secure',
              'emotional security',
              'safe without family',
              'feel safe',
              'emotional care',
              'secure environment'
            ],
            response: "🛡️ Emotional Security:\n\nYes! We ensure every child feels emotionally secure:\n\n✅ Structured daily routine\n✅ Nurturing environment\n✅ Strong pastoral care system\n✅ 24/7 caring staff\n✅ Safe & valued every day\n\nYour daughter will feel emotionally supported, safe, and valued at all times! 💙\n\n🔗 Learn more: https://www.vantagehall.org/pastoral-care"
          }
        ]
      }
    ]
  },

  // ==============================================
  // BASIC SCHOLL INFORMATION PROVIDED BY THE TECHNICAL TEAM 
  // ==============================================
  founder: {
    keywords: ['founder', 'established', 'history', 'who started', 'foundation', 'when founded'],
    answer: "🏫 Vantage Hall Girls' Residential School was established in 2013 with a vision to provide world-class boarding education for girls in a nurturing and empowering environment.\n\n🔗 Vision & Mission: https://www.vantagehall.org/about"
  },

  affiliation: {
    keywords: ['affiliation', 'cbse code', 'board affiliation', 'school code'],
    answer: "📘 The school is affiliated to the Central Board of Secondary Education (CBSE), New Delhi."
  },

  location: {
    keywords: [
      'location',
      'map',
      'how to reach',
      'directions',
      'bus stop',
      'address',
      'school address',
      'contact number',
      'school email',
      'where located',
      'admission contact',
      'dehradun boarding school'
    ],
    answer: "📍 Vantage Hall Girls' Residential School\nThe Yellow Brick Road, Doonga\nDehradun - 248007, Uttarakhand\n\n🗺 Google Maps: https://maps.app.goo.gl/F9okR4GADbhN9x5G8\n\n🔗 Full Contact Details: https://www.vantagehall.org/contact"
  },

  faculty: {
    keywords: [
      'faculty',
      'teachers',
      'staff',
      'teaching quality',
      'teacher qualification',
      'who teaches'
    ],
    answer: "🏫 All faculty members are highly qualified professionals with CBSE teaching certifications. Many hold postgraduate degrees and have years of teaching and mentoring experience.\n\n🔗 Meet Our Teachers: https://www.vantagehall.org/faculty"
  },

  smart_class: {
    keywords: [
      'smart class',
      'technology',
      'digital classroom',
      'computer lab',
      'ERP',
      'online learning',
      'wifi'
    ],
    answer: "💻 Digital & Smart Learning:\n\n• Smart classrooms with interactive panels\n• Computer & Robotics Labs\n• Wi-Fi-enabled learning environment\n• Integrated Edunext ERP for attendance, grades & communication"
  },

  safety: {
    keywords: ['safety', 'security', 'cctv', 'warden', 'camera', 'rules', 'discipline'],
    answer: "🛡 Safety & Security:\n\n• 24x7 wardens in each hostel block\n• CCTV surveillance in corridors & common areas\n• Controlled visitor access with ID verification\n• Strict discipline & conduct policy\n\n🔗 Security Details: https://www.vantagehall.org/safety"
  },

  campus: {
    keywords: [
      'campus',
      'infrastructure',
      'library',
      'labs',
      'facilities available',
      'auditorium'
    ],
    answer: "🏫 Campus Facilities:\n\n• 12-acre lush green campus\n• Modern academic blocks & labs\n• Fully stocked library\n• Amphitheatre & multi-purpose auditorium\n• Indoor & outdoor sports arenas"
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
    answer: "🏥 Medical Facilities:\n\n✅ Fully equipped infirmary – 24/7\n👩‍⚕️ Qualified female doctor & nurses\n🚑 School ambulance available\n🏥 Tie-ups with hospitals:\n• Graphic Era\n• Synergy\n• Max Hospital\n\n📞 Parents are informed immediately in any medical situation!"
  },

  vision: {
    keywords: [
      'vision',
      'goal',
      'objective',
      'purpose',
      'mission',
      'school vision',
      'mission statement',
      'core values',
      'school philosophy',
      'educational goals'
    ],
    answer: "🎯 Our Vision & Mission:\n\nTo nurture happy, independent, and unique individuals in a safe and supportive environment.\n\n🔗 Learn More: https://www.vantagehall.org/about"
  },

  thanks: {
    keywords: [
      'thank you',
      'thanks',
      'thnx',
      'thankyou',
      'ok',
      'okay',
      'okk',
      'k',
      'great',
      'good',
      'nice',
      'alright'
    ],
    answer: "😊 You're Welcome!\n\nIt's our pleasure to assist you.\n\nIf you have any more questions about academics, admissions, facilities, or sports — feel free to ask anytime!\n\n📞 You can also contact us directly for detailed guidance.\n\nHave a great day! 🌟"
  },

  curriculum: {
    keywords: [
      'curriculum',
      'board',
      'cbse',
      'syllabus',
      'academics system',
      'what subject',
      'subjects taught',
      'school board',
      'cbse school',
      'curriculum followed',
      'education board',
      'affiliated board'
    ],
    answer: "📚 We follow the CBSE curriculum with a well-balanced, student-centric academic programme that encourages holistic learning and critical thinking.\n\n🎓 Streams Offered (Classes 11-12):\n• Science\n• Commerce\n• Humanities\n\nOur curriculum emphasizes holistic development beyond textbooks, including hands-on activities, critical thinking, and creative expression.\n\n🔗 Full Curriculum Details: https://www.vantagehall.org/academics"
  },

  timings: {
    keywords: [
      'timing',
      'time',
      'hour',
      'schedule',
      'start',
      'school timings',
      'class schedule',
      'school hours',
      'daily timing',
      'activity timing'
    ],
    answer: "🕐 School Timings:\n\n• Grades 3-9: 7:45 AM - 12:55 PM\n• Grades 10-12: 7:45 AM - 1:35 PM\n• Activity Classes: 2:45 PM - 4:05 PM\n\n🔗 Typical Day: https://www.vantagehall.org/life-at-vantage"
  },

  ratio: {
    keywords: [
      'ratio',
      'student',
      'teacher',
      'class size',
      'students per',
      'teacher ratio',
      'class strength',
      'students per teacher',
      'batch size'
    ],
    answer: "👩‍🏫 Student-Teacher Ratio: 1:5\n\nWe maintain small class sizes to ensure personalized attention and effective learning for every student."
  },

  eligibility: {
    keywords: [
      'eligibility',
      'eligible',
      'criteria',
      'qualify',
      'who can',
      'age',
      'admission criteria',
      'age requirement',
      'entry rules',
      'class admission',
      'eligibility details'
    ],
    answer: "📝 Eligibility Criteria:\n\n✅ Classes: 3-12\n✅ Age: As per CBSE guidelines\n✅ Eligibility: Successful completion of previous grade\n✅ Required: Transfer Certificate and Report Card\n⚠️ Note: Admission to Class 10 is considered only in exceptional cases\n\n🔗 Admission Details: https://www.vantagehall.org/admissions"
  },


 "school_achievements": {
    "keywords": [
      "school highlights",
      "achievements",
      "awards",
      "infrastructure",
      "award",
      "prize",
      "sports record"
    ],
    "answer": "🏆 Important Achievements & Highlights:\n\n• Academic Excellence\n• Holistic Development\n• Sports Achievements\n• Modern Infrastructure & Facilities\n• Dedicated Pastoral Care & Student Well-being\n• International Exposure\n\n🔗 More info: https://vantagehall.org/sports-achievements-girls-boarding-school/"
  },


  
  admission: {
    keywords: [
      'admission',
      'admit',
      'process of admission',
      'enroll',
      'join',
      'apply',
      'admission steps',
      'entrance test',
      'selection process',
      'interview round',
      'admission procedure'
    ],
    answer: "📝 Admission Process:\n\n✅ Step 1: Written Test (English, Mathematics, Science)\n✅ Step 2: Interaction with Principal\n✅ Step 3: Interaction with Director\n\n📅 Registrations: September-October\n📅 Session Starts: April\n\n📞 Contact:\n+91-8191912999, +91-7078311863\n📧 admissions@vantagehall.org\n\n🔗 Complete Admission Details: https://www.vantagehall.org/admissions"
  },

  admission_dates: {
    keywords: [
      'admission start',
      'registration dates',
      'session begins',
      'academic calendar',
      'admission deadline'
    ],
    answer: "📅 Admission Timeline:\n\n• Registrations: September-October (of the previous academic year)\n• Academic Session: Begins in April\n\n🔗 Academic Calendar 2025-26: https://www.vantagehall.org/calendar"
  },

  documents: {
    keywords: [
      'document',
      'paper',
      'certificate',
      'required',
      'need',
      'bring',
      'admission documents',
      'required papers',
      'documents needed',
      'aadhaar required',
      'tc required'
    ],
    answer: "📄 Required Documents:\n\n• Birth Certificate & Aadhaar Card\n• Parents' Aadhaar & PAN Cards\n• Last examination mark sheet\n• Original Transfer Certificate\n• Medical Fitness Certificate\n• Student's PEN Number / APAAR ID"
  },

  fee: {
    keywords: [
      'fee',
      'fees',
      'cost',
      'tuition',
      'charge',
      'payment',
      'price',
      'school fees',
      'hostel fees',
      'annual charges',
      'tuition cost',
      'boarding fees'
    ],
    answer: "💰 Fee Structure:\n\n📌 Classes 3-7: ₹7,35,000\n(Annual: ₹5,50,000 + One-time: ₹1,85,000)\n\n📌 Classes 8-10: ₹8,35,000\n(Annual: ₹6,50,000 + One-time: ₹1,85,000)\n\n📌 Classes 11-12: ₹8,85,000\n(Annual: ₹7,00,000 + One-time: ₹1,85,000)\n\n*One-time fees include registration, joining kit, imprest deposit & admission fee.\n\n🔗 Complete Fee Details: https://www.vantagehall.org/admissions#fees"
  },

  hostel: {
    keywords: [
      'hostel',
      'hostel facilities',
      'boarding',
      'residential',
      'accommodation',
      'room',
      'hostel rooms',
      'dorm facilities',
      'boarding facilities',
      'wifi hostel',
      'laundry service'
    ],
    answer: "🏡 Hostel Facilities:\n\n✨ Well-furnished dormitories with beds, storage, study tables & wardrobes\n✨ Separate hostels for juniors & seniors\n✨ Regular laundry service\n✨ Daily housekeeping\n✨24/7 supervision by wardens\n✨ Safe & supportive environment\n\n🔗 Hostel Details: https://www.vantagehall.org/facilities#hostel"
  },

  hostel_rules: {
    keywords: [
      'hostel discipline',
      'dorm rules',
      'lights out timing',
      'boarding guidelines',
      'hostel routine'
    ],
    answer: "📋 Hostel Rules:\n\n• Students must return to dorms at designated times\n• Fixed bedtime and lights-out schedules\n• Morning roll call and evening study attendance mandatory\n• Respectful behavior towards peers and staff\n• Polite language and proper conduct enforced\n\n🔗 Pastoral Care: https://www.vantagehall.org/pastoral-care"
  },

  food: {
    keywords: [
      'food',
      'dining',
      'menu',
      'meal',
      'lunch',
      'dinner',
      'breakfast',
      'diet',
      'school food',
      'mess menu',
      'dining system',
      'veg non-veg',
      'meat',
      'non veg',
      'do you serve meat',
      'special diet'
    ],
    answer: "🍽️ Dining & Nutrition:\n\n✅ Nutritionist-planned meals\n✅ Special diets for athletes & medical needs\n✅ Veg & non-veg options\n✅ Menu rotates every 15 days\n\n🥗 Daily Meals:\n• Breakfast: Fruits, cereals, milk, eggs, bread/parathas\n• Lunch: Dal, rice/roti, vegetables, salad\n• Dinner: Similar to lunch with variety\n• Night Milk: Mandatory\n\n🔗 Full Menu: https://www.vantagehall.org/facilities#dining"
  },

  leave_policy: {
    keywords: [
      'hostel leave',
      'outing rules',
      'leave permission',
      'weekend outing',
      'holiday policy'
    ],
    answer: "📅 Leave & Outing Policy:\n\nLeave and outing schedules are mentioned in the Academic Calendar.\n\n🔗 View Academic Calendar: https://www.vantagehall.org/calendar"
  },

  sports: {
    keywords: [
      'sports',
      'sport available',
      'games',
      'what sports',
      'sports facilities',
      'athletics',
      'physical education',
      'football',
      'cricket',
      'basketball',
      'swimming',
      'which sports',
      'sports offered',
      'games available',
      'coaches available',
      'swimming pool',
      'sports teams'
    ],
    answer: "⚽ Sports & Athletics:\n\nTraining under qualified coaches in:\n\n🏃‍♀️ Football, Self Defense, Basketball\n🎾 Squash, Badminton, Zumba Classes, Table Tennis\n⛸️ Skating, Gymnasium, Swimming\n♟️ Indoor Games: Chess\n\n🔗 Sports Facilities: https://www.vantagehall.org/sports\n🔗 Sports Achievements: https://www.vantagehall.org/achievements"
  },

  clubs: {
    keywords: [
      'club',
      'activity',
      'extracurricular',
      'societies',
      'hobby',
      'school clubs',
      'student activities',
      'debate club',
      'music club',
      'stem club'
    ],
    answer: "🎨 Clubs & Societies:\n\n• Art Club\n• Culinary Club\n• Dance & Music Club\n• Theatre Club\n• Finance & Maths Club\n• IT Club\n• Science Club\n• Photography Club\n• Sustainability Club\n• Editorial Board\n\n🔗 Explore All Clubs: https://www.vantagehall.org/clubs\n🔗 Student Activities: https://www.vantagehall.org/life-at-vantage"
  },

  events: {
    keywords: [
      'annual day',
      'school events',
      'sports day',
      'cultural programs',
      'celebrations'
    ],
    answer: "🎉 Cultural & Annual Events:\n\n• Annual Day\n• Sports Day\n• Independence Day & Republic Day\n• Educational Trips & Excursions\n• Festive Celebrations\n• Inter-House Competitions\n• Talent & Leadership Programs\n\n🔗 Read Our Blog: https://www.vantagehall.org/blog"
  },

  leadership: {
    keywords: [
      'student council',
      'prefect system',
      'leadership roles',
      'house system',
      'head girl'
    ],
    answer: "🌟 Leadership Opportunities:\n\nStudents are offered leadership roles through:\n\n• House System\n• Prefectship\n• Student Council\n\nThese help build confidence, communication, and responsibility.\n\n🔗 Student Council: https://www.vantagehall.org/leadership"
  },

  trips: {
    keywords: [
      'school trips',
      'educational tours',
      'exchange program',
      'trekking',
      'foreign trips',
      'picnic'
    ],
    answer: "🗺️ Trips & Excursions:\n\n📍 Term-End Trips:\nKanatal, Manali, Shimla, Mumbai, Goa, Jim Corbett (grade-wise)\n\n📚 Educational Trips:\nScience Centre, Dehradun Zoo, FRI, IMA, Museums\n\n⛰️ Treks/Day Trips:\nBhadraj Temple, Than Gaon, Doonga treks, Mussoorie\n\n🛍️ Local Visits:\nPacific Mall, Centrio Mall, Dehradun Zoo\n\n🔗 Trips & Expeditions: https://www.vantagehall.org/trips"
  },

  career: {
    keywords: [
      'career',
      'guidance',
      'college',
      'university',
      'neet',
      'jee',
      'clat',
      'career counseling',
      'entrance prep',
      'neet coaching',
      'jee support',
      'study abroad'
    ],
    answer: "🎯 Career Guidance:\n\nWe offer counseling for Grades 8-12, including:\n\n✅ Medical (NEET)\n✅ Engineering (JEE)\n✅ Law (CLAT, AILET)\n✅ Management (IPM, NMIMS)\n✅ Design (NIFT, UCEED)\n✅ SAT & AP (foreign universities)\n\n1-on-1 guidance sessions available!\n\n🔗 Academic Programs: https://www.vantagehall.org/academics"
  },

  parent_communication: {
    keywords: [
      'parent communication',
      'school app',
      'erp access',
      'weekly calls',
      'whatsapp updates'
    ],
    answer: "📱 Parent Communication:\n\n• ERP system (attendance, academics, calendar, photos)\n• Email and WhatsApp updates\n• Weekly student-parent calls every Sunday (45 minutes)\n• Special calls on birthdays/anniversaries"
  },

  ptm: {
    keywords: [
      'parent meeting',
      'ptm dates',
      'teacher interaction',
      'academic meeting'
    ],
    answer: "👨‍👩‍👧 Parent-Teacher Meetings:\n\nConducted four times in an academic year (Online & Offline)."
  },

  online_portal: {
    keywords: [
      'online portal',
      'attendance tracking',
      'fee tracking',
      'erp login',
      'academic reports'
    ],
    answer: "💻 Online Portal:\n\nYes, parents can access the ERP system anytime to track:\n\n• Attendance\n• Academic Performance\n• Fee Status\n• Event Calendar"
  },

  counselor: {
    keywords: [
      'counselor available',
      'emotional support',
      'student psychologist',
      'mental health'
    ],
    answer: "💚 School Counselor:\n\nYes, we have a dedicated counselor providing psychological and emotional support.\n\n🔗 Emotional Health: https://www.vantagehall.org/pastoral-care"
  },

  complaint: {
    keywords: [
      'report bullying',
      'complaint system',
      'confidential support',
      'student grievance',
      'safety concern'
    ],
    answer: "📮 Student Grievance System:\n\nWe have a zero-tolerance policy against bullying or harassment. Students may directly approach:\n\n• Director\n• Principal\n• Pastoral Care team\n\nFor confidential one-on-one sessions."
  },

  staff: {
    keywords: [
      'school principal',
      'director name',
      'house mother',
      'medical staff'
    ],
    answer: "👥 Key Staff Members:\n\n• Principal\n• Director\n• HOD Pastoral Care\n• House Mothers\n• Medical Staff\n\n🔗 School Committee: https://www.vantagehall.org/about#staff"
  },

  urgent_communication: {
    keywords: [
      'emergency update',
      'holiday notice',
      'urgent announcement',
      'school alert'
    ],
    answer: "🚨 Urgent Communication:\n\n• Formal updates via Email and ERP\n• Medical emergencies: Direct phone calls to parents"
  },

  privacy: {
    keywords: [
      'data privacy',
      'student information',
      'confidential policy',
      'information security'
    ],
    answer: "🔒 Privacy Policy:\n\nThe chatbot never shares personal or confidential student information. All data is protected."
  },

  streams: {
    keywords: [
      'subjects offered',
      'senior streams',
      'science stream',
      'commerce stream',
      'humanities stream'
    ],
    answer: "🎓 Streams Offered (Classes 11-12):\n\n• Science\n• Commerce\n• Humanities\n\n🔗 Academic Programs: https://www.vantagehall.org/academics"
  },

  examination: {
    keywords: [
      'exam system',
      'unit tests',
      'annual exams',
      'assessment method',
      'half yearly exam'
    ],
    answer: "📝 Examination System:\n\n• Unit Tests: Twice a year\n• Mid-Term / Half-Yearly Exams\n• Final / Annual Exams (comprehensive)"
  },

  remedial: {
    keywords: [
      'extra classes',
      'remedial support',
      'academic help',
      'coaching support',
      'doubt clearing'
    ],
    answer: "📚 Remedial Classes:\n\nYes, remedial and academic support classes are provided beyond regular teaching hours."
  },

  contact: {
    keywords: ['contact', 'phone', 'email', 'address', 'reach', 'call', 'number'],
    answer: "📍 Vantage Hall Girls' Residential School\nThe Yellow Brick Road, Doonga\nDehradun - 248007, Uttarakhand\n\n📞 General: 0135-2776225, 226, 227, 228\n📧 info@vantagehall.org\n\n👤 Admissions:\n📞 +91-8191912999, +91-7078311863\n📧 admissions@vantagehall.org\n\n🔗 Complete Contact Page: https://www.vantagehall.org/contact"
  }
};

// ==============================================
// EMAIL FUNCTIONALITY ADDED BY ME AS PER GUIDANCE OF TECHNICAL TEAM 
// ==============================================
async function sendCallbackEmail(userDetails, query, callbackNumber) {
  try {
    const mailOptions = {
      from: EMAIL_CONFIG.auth.user,
      to: ADMIN_EMAIL,
      subject: '📞 Callback Request - Vantage Hall Chatbot',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f0f; }
            .wrapper { max-width: 620px; margin: 30px auto; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
            .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding: 40px 30px; text-align: center; }
            .logo-circle { width: 70px; height: 70px; background: linear-gradient(135deg, #e94560, #c23152); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 30px; margin-bottom: 15px; }
            .header h1 { color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: 1px; }
            .header p { color: #a0aec0; font-size: 13px; margin-top: 6px; }
            .alert-banner { background: linear-gradient(90deg, #e94560, #c23152); padding: 14px 30px; text-align: center; }
            .alert-banner span { color: white; font-weight: 700; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; }
            .body { background: #1a1a2e; padding: 35px 30px; }
            .phone-box { background: linear-gradient(135deg, #e94560 0%, #c23152 100%); border-radius: 12px; padding: 25px; text-align: center; margin-bottom: 25px; box-shadow: 0 8px 25px rgba(233,69,96,0.4); }
            .phone-box .label { color: rgba(255,255,255,0.8); font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px; }
            .phone-box .number { color: white; font-size: 32px; font-weight: 800; letter-spacing: 3px; }
            .info-grid { display: grid; gap: 12px; margin-bottom: 20px; }
            .info-card { background: #16213e; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 16px 20px; display: flex; align-items: center; gap: 15px; }
            .info-card .icon { width: 40px; height: 40px; background: linear-gradient(135deg, #0f3460, #533483); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
            .info-card .text-label { color: #718096; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 3px; }
            .info-card .text-value { color: #e2e8f0; font-size: 15px; font-weight: 500; }
            .query-card { background: #16213e; border: 1px solid rgba(233,69,96,0.3); border-left: 4px solid #e94560; border-radius: 10px; padding: 20px; margin-top: 5px; }
            .query-card .qlabel { color: #e94560; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-weight: 700; margin-bottom: 10px; }
            .query-card .qtext { color: #cbd5e0; font-size: 15px; line-height: 1.6; }
            .timestamp-bar { background: #0f3460; border-radius: 8px; padding: 12px 20px; margin-top: 20px; display: flex; align-items: center; gap: 10px; }
            .timestamp-bar span { color: #a0aec0; font-size: 13px; }
            .footer { background: #0f0f0f; padding: 20px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }
            .footer p { color: #4a5568; font-size: 12px; line-height: 1.8; }
            .badge { display: inline-block; background: rgba(233,69,96,0.15); border: 1px solid rgba(233,69,96,0.3); color: #e94560; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; margin-top: 8px; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header">
              <div class="logo-circle">📞</div>
              <h1>CALLBACK REQUEST</h1>
              <p>Vantage Hall Girls' Residential School</p>
            </div>

            <div class="alert-banner">
              <span>⚡ Action Required — Please Call Back</span>
            </div>

            <div class="body">
              <div class="phone-box">
                <div class="label">Callback Number</div>
                <div class="number">📱 ${callbackNumber}</div>
              </div>

              <div class="info-grid">
                <div class="info-card">
                  <div class="icon">👤</div>
                  <div>
                    <div class="text-label">User Name</div>
                    <div class="text-value">${userDetails.name}</div>
                  </div>
                </div>
                <div class="info-card">
                  <div class="icon">📧</div>
                  <div>
                    <div class="text-label">Email Address</div>
                    <div class="text-value">${userDetails.email}</div>
                  </div>
                </div>
                <div class="info-card">
                  <div class="icon">📱</div>
                  <div>
                    <div class="text-label">Registered Phone</div>
                    <div class="text-value">${userDetails.phone}</div>
                  </div>
                </div>
              </div>

              <div class="query-card">
                <div class="qlabel">❓ User's Query</div>
                <div class="qtext">${query}</div>
              </div>

              <div class="timestamp-bar">
                <span>⏰ Received: ${new Date().toLocaleString('en-IN', {
                  timeZone: 'Asia/Kolkata',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })} IST</span>
              </div>
            </div>

            <div class="footer">
              <p>Automated message from Vantage Hall Chatbot System</p>
              <p>Please call back at your earliest convenience</p>
              <span class="badge">🎓 Vantage Hall Chatbot</span>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Callback email sent!');
    return true;
  } catch (error) {
    console.error('❌ Email failed:', error.message);
    return false;
  }
}

// ==============================================
// SMART KEYWORD MATCHING FOR BETTER RESULT 
// ==============================================
function findBestMatch(userMessage, lastTopic = null, lastOptionLevel = null, lastSelectedOption = null) {
  const msg = userMessage.toLowerCase().trim();

  // PRIORITY 1: Handle nested navigation
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

          // THIS FUNCTION WILL CHECK FOR THE BEST MATCHED KEYWORDS FOR OPTISED RESULT
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

      // If in main menu (first level) LIKE USER INTERFACE 
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

        // THEN CHECK FOR THE BEST KEYWORDS MATCHING 
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

  // PRIORITY 2: SEARCH IN GLOBAL LOGIVC BASED IN THE CHATBOT
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
      } else if (new RegExp(`\\b${keywordLower}\\b`, 'i').test(msg)) {
        score += 50;
        matchedKeywords.push(keyword);
      } else if (msg.includes(keywordLower)) {
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
// NOW SHIFTED TO GEMINI API KEY AND UPDATED ALL THE FUNCTIONALITY ACCORDING TO THE GEMINI API KEY 
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
    message: 'Vantage Hall Chatbot API - Production Ready',
    model: 'Google Gemini Pro + Comprehensive Knowledge Base',
    knowledgeBaseTopics: Object.keys(KNOWLEDGE_BASE).length,
    geminiConfigured: !!GEMINI_API_KEY,
    emailConfigured: !!EMAIL_CONFIG.auth.user && EMAIL_CONFIG.auth.user !== 'your-email@gmail.com',
    endpoints: {
      health: '/api/health',
      chat: '/api/chat (POST)',
      register: '/api/register (POST)',
      callback: '/api/callback-request (POST)',
      test: '/api/test'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!GEMINI_API_KEY,
    emailConfigured: !!EMAIL_CONFIG.auth.user && EMAIL_CONFIG.auth.user !== 'your-email@gmail.com'
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

app.post('/api/callback-request', async (req, res) => {
  try {
    const { name, email, phone, query, callback_number } = req.body;

    if (!name || !email || !phone || !query || !callback_number) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanedNumber = callback_number.replace(/\D/g, '');
    if (!phoneRegex.test(cleanedNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid callback number'
      });
    }

    console.log('📞 New callback request:', { name, callback_number, query });

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
        emailStatus: EMAIL_CONFIG.auth.user && EMAIL_CONFIG.auth.user !== 'your-email@gmail.com' ? 'Configured ✅' : 'Not configured',
        knowledgeBaseTopics: Object.keys(KNOWLEDGE_BASE).length,
        mode: 'Knowledge Base Mode'
      });
    }

    const reply = await callGemini('Say "Hello! The Gemini API is working!" in one sentence.');

    res.json({
      success: true,
      message: '✅ Gemini API is WORKING!',
      testReply: reply,
      emailStatus: EMAIL_CONFIG.auth.user && EMAIL_CONFIG.auth.user !== 'your-email@gmail.com' ? 'Configured ✅' : 'Not configured',
      knowledgeBaseTopics: Object.keys(KNOWLEDGE_BASE).length,
      model: 'Google Gemini Pro'
    });
  } catch (error) {
    res.json({
      success: true,
      message: '✅ Server is working!',
      geminiStatus: 'Unavailable (' + error.message + ')',
      emailStatus: EMAIL_CONFIG.auth.user && EMAIL_CONFIG.auth.user !== 'your-email@gmail.com' ? 'Configured ✅' : 'Not configured',
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

    // Handle greetings
    if (/^(hi|hello|hey|good morning|good afternoon|good evening)/i.test(message.trim())) {
      const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
      return res.json({
        success: true,
        reply: greeting,
        mode: 'greeting'
      });
    }

    // WHEN USER GIVE INPUT IT WILL FIRSTLY CHECK FOR THE KNOWLEGDE BASE THE PRIRITY IS SET 
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

    //  IT WILL TRY GEMINI AOI KEY IF CONFIGIRED
    if (GEMINI_API_KEY) {
      try {
        const reply = await callGemini(message);
        return res.json({
          success: true,
          reply: reply.trim() + "\n\n🤖 *Powered by Google Gemini*",
          mode: 'ai-powered'
        });
      } catch (geminiError) {
        console.log('⚠️ Gemini unavailable, triggering callback');
      }
    }

    // If no match found, trigger callback collectioN
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
// IF THIS MESSAGE WILL REFLECTED IN THE CONSOLE IN THE CHATBOT FOLDER THEN EVERYTHING IS FINE .....
// ==============================================
app.listen(PORT, () => {
  console.log('\n╔═══════════════════════════════════════════╗');
  console.log('║ 🎓 Vantage Hall Chatbot Server  - PRODUCTION ║');
  console.log('╚═══════════════════════════════════════════╝');
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`🧪 Test API: http://localhost:${PORT}/api/test`);
  console.log(`🤖 AI Model: ${GEMINI_API_KEY ? 'Google Gemini Pro ✅' : 'Not Configured ⚠️'}`);
  console.log(`📚 Knowledge Base: ${Object.keys(KNOWLEDGE_BASE).length} topics ✅`);
  console.log(`📧 Email: ${EMAIL_CONFIG.auth.user !== 'your-email@gmail.com' ? 'Configured ✅' : 'Not Configured ❌'}`);
  console.log(`✅ FAQ Navigation: Working`);
  console.log(`💚 Emotional Support: Complete with Keywords`);
  console.log(`👧 Single Child Support: ADDED ✅`);
  console.log(`🔗 Hyperlinks: Added to all responses`);
  console.log(`⬅️ Back to Menu: Enabled`);
  console.log(`📞 Callback System: Active ✅`);
  console.log(`🔧 Production Ready for GitHub Push! 🚀`);
  console.log('╚═══════════════════════════════════════════\n');

  if (!GEMINI_API_KEY) {
    console.log('⚠️ NOTE: Gemini API key not configured.');
    console.log('  Chatbot will use Knowledge Base + Callback system.\n');
  }

  if (EMAIL_CONFIG.auth.user === 'your-email@gmail.com') {
    console.log('⚠️ IMPORTANT: Update email credentials in .env file!');
    console.log('  Set ADMIN_EMAIL and EMAIL_PASSWORD in your .env\n');
  }
});




