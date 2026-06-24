export type Role = "student" | "instructor" | "admin";

export interface User {
  id: string;
  email: string;
  role: Role;
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
    name: "Automatic Driving Lessons",
    description: "Master driving with automatic transmission vehicles. Perfect for beginners who want a smoother learning experience.",
    duration: "6 weeks",
    duration_hours: 24,
    price: 150000,
    requirements: "Must be 18 years or older. Valid learner's permit required.",
    icon: "Car",
    features: [
      "Professional instructor",
      "Modern automatic vehicles",
      "Flexible scheduling",
      "Road test preparation",
    ],
  },
  {
    id: 2,
    name: "Manual Driving Lessons",
    description: "Learn to drive manual transmission vehicles. Gain full control and confidence on any road.",
    duration: "8 weeks",
    duration_hours: 32,
    price: 180000,
    requirements: "Must be 18 years or older. Valid learner's permit required.",
    icon: "Car",
    features: [
      "Expert manual instruction",
      "Clutch control mastery",
      "Hill start techniques",
      "Comprehensive road training",
    ],
  },
  {
    id: 3,
    name: "Defensive Driving",
    description: "Advanced techniques to anticipate hazards and react safely in any driving condition.",
    duration: "4 weeks",
    duration_hours: 16,
    price: 120000,
    requirements: "Valid driver's license. Minimum 1 year driving experience.",
    icon: "Shield",
    features: [
      "Hazard perception training",
      "Emergency maneuvers",
      "Night driving techniques",
      "Insurance discount eligible",
    ],
  },
  {
    id: 4,
    name: "Refresher Courses",
    description: "Perfect for licensed drivers who need to rebuild confidence or brush up on specific skills.",
    duration: "3 weeks",
    duration_hours: 12,
    price: 90000,
    requirements: "Valid driver's license required.",
    icon: "RefreshCw",
    features: [
      "Customized curriculum",
      "Confidence building",
      "Specific skill focus",
      "Flexible scheduling",
    ],
  },
  {
    id: 5,
    name: "Corporate Driving Training",
    description: "Fleet driver training for organizations. Improve safety records and reduce accident rates.",
    duration: "2 weeks",
    duration_hours: 20,
    price: 350000,
    requirements: "Corporate account required. Minimum 5 employees.",
    icon: "Building2",
    features: [
      "On-site training available",
      "Fleet safety protocols",
      "Driver assessment reports",
      "Certificate of completion",
    ],
  },
  {
    id: 6,
    name: "Driver License Assistance",
    description: "End-to-end support through the licensing process. From application to road test success.",
    duration: "4 weeks",
    duration_hours: 16,
    price: 100000,
    requirements: "Must be 18 years or older. Valid identification documents.",
    icon: "FileCheck",
    features: [
      "Paperwork assistance",
      "Test route familiarization",
      "Mock driving tests",
      "License application support",
    ],
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
    name: "Chioma Okafor",
    photo: "/images/testimonials/chioma.jpg",
    rating: 5,
    text: "Falcon Driving School made learning to drive so easy! My instructor was patient and professional. I passed my test on the first attempt. Highly recommended!",
    course: "Automatic Driving Lessons",
  },
  {
    id: 2,
    name: "Emeka Nwosu",
    photo: "/images/testimonials/emeka.jpg",
    rating: 5,
    text: "The defensive driving course was eye-opening. I learned techniques I never knew existed. I feel much safer on the road now.",
    course: "Defensive Driving",
  },
  {
    id: 3,
    name: "Funke Adeyemi",
    photo: "/images/testimonials/funke.jpg",
    rating: 4,
    text: "After years of being afraid to drive, the instructors at Falcon gave me the confidence I needed. The refresher course was exactly what I needed.",
    course: "Refresher Course",
  },
  {
    id: 4,
    name: "Samuel Eze",
    photo: "/images/testimonials/samuel.jpg",
    rating: 5,
    text: "Great school with modern vehicles and excellent instructors. The online portal made scheduling lessons very convenient.",
    course: "Manual Driving Lessons",
  },
  {
    id: 5,
    name: "Amara Igwe",
    photo: "/images/testimonials/amara.jpg",
    rating: 5,
    text: "I enrolled my entire fleet team in the corporate training program. The improvement in our safety record has been remarkable. Outstanding service!",
    course: "Corporate Driving Training",
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
