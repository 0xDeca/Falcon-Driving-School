export type Role = "student" | "instructor" | "admin";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: Role;
  suspended?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  phone: string;
  address: string;
  profile_photo_url: string | null;
  enrollment_date: string;
  users?: User;
}

export interface Instructor {
  id: string;
  user_id: string;
  certification: string;
  years_experience: number;
  bio: string;
  users?: User;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  duration_hours: number;
  price: number;
  requirements: string;
  archived: boolean;
  created_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  enrollment_date: string;
  status: "active" | "completed" | "cancelled";
  courses?: Course;
  students?: Student;
}

export interface Lesson {
  id: string;
  enrollment_id: string;
  instructor_id: string;
  vehicle_id: string;
  scheduled_date: string;
  duration_minutes: number;
  attendance_status: "scheduled" | "present" | "absent" | "cancelled";
  start_time?: string;
  end_time?: string;
  enrollments?: Enrollment;
  instructors?: Instructor;
  vehicles?: Vehicle;
}

export interface LessonEvaluation {
  id: string;
  lesson_id: string;
  steering_score: number;
  parking_score: number;
  reverse_parking_score: number;
  road_awareness_score: number;
  confidence_score: number;
  strengths_text: string;
  improvements_text: string;
  comments_text: string;
  lessons?: Lesson;
}

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  plate_number: string;
  transmission_type: "automatic" | "manual";
  insurance_expiry: string;
  maintenance_schedule: string;
  status: "available" | "maintenance" | "retired";
  created_at: string;
}

export interface Payment {
  id: string;
  student_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  transaction_id: string;
  status: "pending" | "completed" | "failed" | "refunded";
  created_at: string;
  students?: Student;
}

export interface Certificate {
  id: string;
  student_id: string;
  course_id: string;
  certificate_number: string;
  completion_date: string;
  generated_at: string;
  students?: Student;
  courses?: Course;
}

export interface CertificateRecommendation {
  id: string;
  student_id: string;
  instructor_id: string;
  status: "pending" | "approved" | "rejected";
  remarks: string;
  created_at: string;
  students?: Student;
  instructors?: Instructor;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image_url: string | null;
  category_id: string;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  created_at: string;
  updated_at: string;
  categories?: BlogCategory;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

export const COURSES_DATA = [
  {
    id: 1,
    name: "2-Week Beginners Course",
    description: "Vehicle control, virtual simulation, traffic rules, and basic driving maneuvers.",
    duration: "2 weeks",
    duration_hours: 16,
    price: 95000,
    requirements: "Must be 18 years or older.",
    icon: "Car",
    features: [],
    category: "training",
  },
  {
    id: 2,
    name: "2-Week Beginners Course + Learners Permit & 5yr Drivers License",
    description: "Everything in the Beginners Course plus Learners Permit and Drivers License processing.",
    duration: "2 weeks",
    duration_hours: 16,
    price: 145000,
    requirements: "Must be 18 years or older. Valid identification documents.",
    icon: "FileCheck",
    features: [],
    category: "training",
  },
  {
    id: 3,
    name: "1-Week Refresher Course",
    description: "For experienced drivers refreshing skills or preparing for a road test.",
    duration: "1 week",
    duration_hours: 8,
    price: 75000,
    requirements: "Valid driver's license required.",
    icon: "RefreshCw",
    features: [],
    category: "training",
  },
  {
    id: 4,
    name: "1-Week Defensive Driving Course",
    description: "Hazard awareness, accident prevention, and defensive driving techniques.",
    duration: "1 week",
    duration_hours: 8,
    price: 75000,
    requirements: "Valid driver's license. Minimum 1 year driving experience.",
    icon: "Shield",
    features: [],
    category: "training",
  },
  {
    id: 5,
    name: "3-Week Training Course",
    description: "Extended training program with deeper road practice and advanced maneuvers.",
    duration: "3 weeks",
    duration_hours: 24,
    price: 115000,
    requirements: "Must be 18 years or older.",
    icon: "Car",
    features: [],
    category: "advanced",
  },
  {
    id: 6,
    name: "3-Week Training Course + Learners Permit & 5yr Drivers License",
    description: "Extended training plus Learners Permit and Drivers License processing.",
    duration: "3 weeks",
    duration_hours: 24,
    price: 165000,
    requirements: "Must be 18 years or older.",
    icon: "FileCheck",
    features: [],
    category: "advanced",
  },
  {
    id: 7,
    name: "Special Training + Learners Permit & 5yr Drivers License",
    description: "Instructor comes to your house or office. Includes Learners Permit and Drivers License.",
    duration: "2 weeks",
    duration_hours: 16,
    price: 265000,
    requirements: "Must be 18 years or older. Abuja residents only.",
    icon: "Home",
    features: [],
    category: "advanced",
  },
  {
    id: 8,
    name: "Executive Training + Learners Permit & 5yr Drivers License",
    description: "Premium concierge training. Instructor comes to your house or office. Includes Learners Permit and Drivers License.",
    duration: "3 weeks",
    duration_hours: 24,
    price: 350000,
    requirements: "Must be 18 years or older. Abuja residents only.",
    icon: "Award",
    features: [],
    category: "advanced",
  },
];

export const FAQ_DATA = [
  {
    question: "How do I enroll in a driving course?",
    answer: "You can enroll by visiting our Courses page, selecting your preferred program, and clicking the Enroll Now button. You'll need to create an account and complete the registration form. Alternatively, you can visit our office in person or call us for assistance.",
  },
  {
    question: "What is the minimum age requirement?",
    answer: "You must be at least 18 years old to enroll in our driving programs. For the Driver License Assistance program, you must have valid identification documents proving your age.",
  },
  {
    question: "How long does it take to complete a course?",
    answer: "Course duration varies by program. Our Automatic Driving Lessons run for 6 weeks, Manual Driving Lessons for 8 weeks, and Defensive Driving for 4 weeks. Refresher courses are 3 weeks, and our comprehensive Driver License Assistance program spans 4 weeks.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept OPay transfers, debit/credit cards (Visa, Mastercard), bank transfers, and cash payments at our office. We also offer flexible installment plans for most courses.",
  },
  {
    question: "Can I reschedule a lesson?",
    answer: "Yes, you can reschedule lessons up to 24 hours before the scheduled time without any penalty. Rescheduling within 24 hours may incur a fee. You can manage rescheduling through your student portal or by contacting our office.",
  },
  {
    question: "Do you provide a vehicle for the driving test?",
    answer: "Yes, we provide our training vehicles for your driving test at no additional cost. Our vehicles are well-maintained and equipped with dual controls for safety.",
  },
  {
    question: "What happens if I fail the road test?",
    answer: "If you don't pass your road test, we offer additional practice sessions at a discounted rate. Our instructors will work with you on the areas that need improvement before you retake the test.",
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a full refund within 7 days of enrollment if no lessons have been taken. After that, refunds are prorated based on lessons completed. Please see our Terms and Conditions for complete details.",
  },
  {
    question: "How are instructors assigned?",
    answer: "Students are assigned to instructors based on availability, expertise, and learning needs. You can request a change of instructor if needed, subject to availability.",
  },
  {
    question: "Do you offer corporate training packages?",
    answer: "Yes, we provide corporate driving training packages for organizations. Our corporate program includes fleet driver assessment, customized training modules, and detailed progress reports. Contact us for a customized quote.",
  },
];

export const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: "Chinedu Okonkwo",
    text: "I started Falcon as a total novice — couldn't even tell the brake from the accelerator. Two weeks later I was driving from Wuse to Maitama on my own. Instructor was patient, calm, and the dual-control car made me feel safe. Worth every naira.",
    course: "2-Week Beginners Course",
  },
  {
    id: 2,
    name: "Aisha Bello",
    text: "As a woman who'd put off learning for years, I was nervous. Falcon's instructors never made me feel stupid for asking questions twice. They handled the FRSC paperwork end-to-end and I got my permit and license without ever standing on a queue. Highly recommend for working women in Abuja.",
    course: "2-Week Beginners + Learners Permit & License",
  },
  {
    id: 3,
    name: "Emeka Adekunle",
    text: "I drove abroad for 8 years and forgot how chaotic Lagos-style traffic feels when you're back home. The refresher course got me reading Abuja roundabouts again, especially Berger and Banex. Crisp 5 days and I was back on the road.",
    course: "1-Week Refresher Course",
  },
  {
    id: 4,
    name: "Fatima Ibrahim",
    text: "Took the defensive driving course because my company required it. The instructor (Mr. Femi) drilled mirror checks and following distance into my head — I now drive completely differently. The only downside was traffic on the days we had Airport Road sessions, but that's Abuja, not Falcon's fault.",
    course: "1-Week Defensive Driving Course",
  },
  {
    id: 5,
    name: "David Onyebuchi",
    text: "Falcon's 3-week course is no joke. They take you from theory, to simulator, to actual road sessions in Garki, Jabi and Lugbe. I made friends in my batch and we still drive together on weekends. The classroom is clean, AC works, and they don't waste your time.",
    course: "3-Week Training Course",
  },
  {
    id: 6,
    name: "Ngozi Anyanwu",
    text: "Best decision of my year. The simulator caught my bad habits before I made them on a real car (I kept forgetting to indicate). When license day came, everything was already submitted on my behalf. I walked in, did biometrics, walked out. Zero stress.",
    course: "3-Week Training + Learners Permit & License",
  },
  {
    id: 7,
    name: "Tunde Adebayo",
    text: "I booked the executive package because of my work schedule — they sent the car and instructor to my office in Central Area every evening. Professional, well-dressed instructors, immaculate vehicles. They treated me like a VIP and got me road-ready in record time.",
    course: "Executive Training + Learners Permit & License",
  },
  {
    id: 8,
    name: "Halima Yusuf",
    text: "I have mild anxiety and was terrified of driving in Abuja traffic. Falcon assigned me an instructor who took it slow, started in quiet streets at Asokoro, and only moved me to Constitution Avenue when I was ready. I've now driven Abuja → Suleja alone. Thank you Falcon \uD83D\uDE4F\uD83C\uDFFD",
    course: "Special Training + Learners Permit & License",
  },
];

export interface ProgressMetric {
  name: string;
  score: number;
  icon: string;
}

export const PROGRESS_METRICS: ProgressMetric[] = [
  { name: "Steering Control", score: 85, icon: "SteeringWheel" },
  { name: "Parking", score: 70, icon: "ParkingCircle" },
  { name: "Reverse Parking", score: 65, icon: "ArrowLeftRight" },
  { name: "Traffic Signs", score: 90, icon: "TrafficCone" },
  { name: "Road Safety", score: 88, icon: "Shield" },
  { name: "Highway Driving", score: 75, icon: "Road" },
  { name: "Defensive Driving", score: 72, icon: "Eye" },
];
