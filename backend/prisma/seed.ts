import { PrismaClient, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // ─── HASH PASSWORD ───────────────────────────────────────────
  const password = await argon2.hash('password123');

  // ─── USERS ───────────────────────────────────────────────────
  const allUsers = await prisma.$transaction(
    [
      { email: 'admin@falcondriving.com', name: 'Emeka Okafor', role: 'admin' as const },
      { email: 'chioma.adeyemi@falcondriving.com', name: 'Chioma Adeyemi', role: 'admin' as const },
      { email: 'david.adeleke@falcondriving.com', name: 'David Adeleke', role: 'instructor' as const },
      { email: 'fatima.bello@falcondriving.com', name: 'Fatima Bello', role: 'instructor' as const },
      { email: 'uche.obi@falcondriving.com', name: 'Uche Obi', role: 'instructor' as const },
      { email: 'blessing.johnson@example.com', name: 'Blessing Johnson', role: 'student' as const },
      { email: 'tunde.balogun@example.com', name: 'Tunde Balogun', role: 'student' as const },
      { email: 'ngozi.eze@example.com', name: 'Ngozi Eze', role: 'student' as const },
      { email: 'sule.ibrahim@example.com', name: 'Sule Ibrahim', role: 'student' as const },
      { email: 'amara.okonkwo@example.com', name: 'Amara Okonkwo', role: 'student' as const },
      { email: 'segun.adebayo@example.com', name: 'Segun Adebayo', role: 'student' as const },
      { email: 'zainab.abdullahi@example.com', name: 'Zainab Abdullahi', role: 'student' as const },
      { email: 'emeka.nwosu@example.com', name: 'Emeka Nwosu', role: 'student' as const },
      { email: 'funmi.aluko@example.com', name: 'Funmi Aluko', role: 'student' as const },
      { email: 'ismail.yusuf@example.com', name: 'Ismail Yusuf', role: 'student' as const },
    ].map(({ role, ...data }) =>
      prisma.user.create({ data: { ...data, password } })
    ),
  );

  const adminUserId1 = allUsers[0].id;
  const adminUserId2 = allUsers[1].id;
  const instUserId1 = allUsers[2].id;
  const instUserId2 = allUsers[3].id;
  const instUserId3 = allUsers[4].id;
  const studentUserIds = allUsers.slice(5).map((u) => u.id);

  // ─── INSTRUCTORS ─────────────────────────────────────────────
  const instructors = await prisma.$transaction([
    prisma.instructor.create({
      data: {
        userId: instUserId1,
        certification: 'Certified Driving Instructor (CDI) — FRSC Accredited',
        yearsExperience: 12,
        bio: 'David is a master instructor with over a decade of experience training drivers in Lagos. Specialises in manual transmission and defensive driving techniques.',
      },
    }),
    prisma.instructor.create({
      data: {
        userId: instUserId2,
        certification: 'Advanced Driving Instructor — VIO Certified',
        yearsExperience: 8,
        bio: 'Fatima is one of the top-rated female instructors in Abuja. She excels at building confidence in nervous beginners and has a 98% pass rate.',
      },
    }),
    prisma.instructor.create({
      data: {
        userId: instUserId3,
        certification: 'NDRIVER Certified — Fleet Driver Trainer',
        yearsExperience: 15,
        bio: 'Uche brings 15 years of experience from both public and private sectors. He is an expert in defensive driving and road safety awareness.',
      },
    }),
  ]);

  const [instructor1, instructor2, instructor3] = instructors;

  // ─── COURSES ─────────────────────────────────────────────────
  const courses = await prisma.$transaction([
    prisma.course.create({
      data: {
        name: 'Manual Driving — Basic',
        description: 'Comprehensive manual transmission driving course for beginners. Covers clutch control, gear shifting, hill starts, and road manoeuvres.',
        durationHours: 20,
        price: new Prisma.Decimal(180000),
        requirements: 'Must be 18 years or older. Valid NIN required.',
      },
    }),
    prisma.course.create({
      data: {
        name: 'Automatic Driving — Basic',
        description: 'Learn to drive with automatic transmission. Ideal for those who want a simpler learning experience focusing on road skills.',
        durationHours: 15,
        price: new Prisma.Decimal(150000),
        requirements: 'Must be 18 years or older.',
      },
    }),
    prisma.course.create({
      data: {
        name: 'Advanced Driving — Premium',
        description: 'Advanced driving techniques including motorway driving, night driving, evasive manoeuvres, and high-speed stability control.',
        durationHours: 25,
        price: new Prisma.Decimal(350000),
        requirements: 'Must hold a valid provisional licence. Basic driving experience recommended.',
      },
    }),
    prisma.course.create({
      data: {
        name: 'Defensive Driving — Professional',
        description: 'Professional defensive driving course focusing on hazard perception, accident avoidance, skid control, and eco-driving.',
        durationHours: 16,
        price: new Prisma.Decimal(250000),
        requirements: 'Valid driver\'s licence required. Suitable for fleet drivers and individuals.',
      },
    }),
  ]);

  const [course1, course2, course3, course4] = courses;

  // ─── INSTRUCTOR → COURSE ASSIGNMENTS ────────────────────────
  await prisma.$transaction([
    prisma.instructorCourse.create({ data: { instructorId: instructor1.id, courseId: course1.id } }),
    prisma.instructorCourse.create({ data: { instructorId: instructor1.id, courseId: course3.id } }),
    prisma.instructorCourse.create({ data: { instructorId: instructor2.id, courseId: course2.id } }),
    prisma.instructorCourse.create({ data: { instructorId: instructor2.id, courseId: course4.id } }),
    prisma.instructorCourse.create({ data: { instructorId: instructor3.id, courseId: course1.id } }),
    prisma.instructorCourse.create({ data: { instructorId: instructor3.id, courseId: course4.id } }),
  ]);

  // ─── STUDENTS ────────────────────────────────────────────────
  const studentRecords = await prisma.$transaction(
    studentUserIds.map((id, i) => {
      const students = [
        { phone: '+2348023012345', address: '42 Allen Avenue, Ikeja, Lagos', enrollmentDate: new Date('2026-01-15') },
        { phone: '+2348034516789', address: '15 Obafemi Awolowo Way, Alausa, Ikeja, Lagos', enrollmentDate: new Date('2026-02-01') },
        { phone: '+2348067123456', address: '7 Zik Avenue, Awka, Anambra', enrollmentDate: new Date('2026-02-20') },
        { phone: '+2347045612345', address: '23 Ahmadu Bello Way, Kaduna', enrollmentDate: new Date('2026-03-01') },
        { phone: '+2348089012345', address: '10 New Market Road, Onitsha, Anambra', enrollmentDate: new Date('2026-03-10') },
        { phone: '+2349034567890', address: '55 Ring Road, Ibadan, Oyo', enrollmentDate: new Date('2026-03-15') },
        { phone: '+2347067823456', address: '18 Kano Road, Zaria, Kaduna', enrollmentDate: new Date('2026-04-01') },
        { phone: '+2348098734567', address: '3 Nza Street, Independence Layout, Enugu', enrollmentDate: new Date('2026-04-10') },
        { phone: '+2348034578912', address: '12 Oke-Ado Road, Molete, Ibadan, Oyo', enrollmentDate: new Date('2026-04-20') },
        { phone: '+2347012345678', address: '29 Ibrahim Taiwo Road, Kano', enrollmentDate: new Date('2026-05-01') },
      ][i];
      return prisma.student.create({
        data: { user: { connect: { id } }, ...students },
      });
    }),
  );

  const [student1, student2, student3, student4, student5, student6, student7, student8, student9, student10] = studentRecords;

  // ─── STUDENT REGISTRATIONS (detailed records) ───────────────
  await prisma.$transaction([
    prisma.studentRegistration.create({
      data: {
        studentId: student1.id,
        surname: 'Johnson',
        otherNames: 'Blessing Chidinma',
        nin: '12345678901',
        lgaOfOrigin: 'Ikeja',
        dateOfBirth: new Date('1998-05-12'),
        stateOrigin: 'Lagos',
        address: '42 Allen Avenue, Ikeja, Lagos',
        bloodGroup: 'O+',
        motherMaidenName: 'Okeke',
        nextOfKin: 'Mr. Paul Johnson',
        nextOfKinPhone: '+2348023098765',
        phone: '+2348023012345',
        drivenBefore: false,
        requireLicense: true,
        preferredLessonTime: 'Morning (8am — 12pm)',
      },
    }),
    prisma.studentRegistration.create({
      data: {
        studentId: student2.id,
        surname: 'Balogun',
        otherNames: 'Tunde Abdul',
        nin: '23456789012',
        lgaOfOrigin: 'Alimosho',
        dateOfBirth: new Date('1997-11-23'),
        stateOrigin: 'Lagos',
        address: '15 Obafemi Awolowo Way, Alausa, Ikeja, Lagos',
        bloodGroup: 'A+',
        motherMaidenName: 'Adebayo',
        nextOfKin: 'Mrs. Rashidat Balogun',
        nextOfKinPhone: '+2348034516790',
        phone: '+2348034516789',
        drivenBefore: true,
        experiencedDriver: false,
        lastDrove: '2023-06',
        requireLicense: true,
        preferredLessonTime: 'Afternoon (1pm — 5pm)',
      },
    }),
    prisma.studentRegistration.create({
      data: {
        studentId: student3.id,
        surname: 'Eze',
        otherNames: 'Ngozi Grace',
        nin: '34567890123',
        lgaOfOrigin: 'Awka South',
        dateOfBirth: new Date('2000-02-08'),
        stateOrigin: 'Anambra',
        address: '7 Zik Avenue, Awka, Anambra',
        bloodGroup: 'B+',
        motherMaidenName: 'Nwosu',
        nextOfKin: 'Chief Emeka Eze',
        nextOfKinPhone: '+2348067123457',
        phone: '+2348067123456',
        drivenBefore: false,
        requireLicense: true,
        preferredLessonTime: 'Morning (8am — 12pm)',
      },
    }),
    prisma.studentRegistration.create({
      data: {
        studentId: student4.id,
        surname: 'Ibrahim',
        otherNames: 'Sule Mohammed',
        nin: '45678901234',
        lgaOfOrigin: 'Kaduna North',
        dateOfBirth: new Date('1996-07-19'),
        stateOrigin: 'Kaduna',
        address: '23 Ahmadu Bello Way, Kaduna',
        bloodGroup: 'O-',
        motherMaidenName: 'Bello',
        nextOfKin: 'Hajiya Aisha Ibrahim',
        nextOfKinPhone: '+2347045612346',
        phone: '+2347045612345',
        drivenBefore: true,
        experiencedDriver: true,
        lastDrove: '2025-12',
        requireLicense: false,
        preferredLessonTime: 'Evening (5pm — 8pm)',
      },
    }),
    prisma.studentRegistration.create({
      data: {
        studentId: student5.id,
        surname: 'Okonkwo',
        otherNames: 'Amara Chioma',
        nin: '56789012345',
        lgaOfOrigin: 'Onitsha North',
        dateOfBirth: new Date('1999-09-14'),
        stateOrigin: 'Anambra',
        address: '10 New Market Road, Onitsha, Anambra',
        bloodGroup: 'AB+',
        motherMaidenName: 'Okafor',
        nextOfKin: 'Dr. Kenneth Okonkwo',
        nextOfKinPhone: '+2348089012346',
        phone: '+2348089012345',
        drivenBefore: false,
        requireLicense: true,
        preferredLessonTime: 'Afternoon (1pm — 5pm)',
      },
    }),
    prisma.studentRegistration.create({
      data: {
        studentId: student6.id,
        surname: 'Adebayo',
        otherNames: 'Segun Oluwaseun',
        nin: '67890123456',
        lgaOfOrigin: 'Ibadan North',
        dateOfBirth: new Date('1995-03-30'),
        stateOrigin: 'Oyo',
        address: '55 Ring Road, Ibadan, Oyo',
        bloodGroup: 'A-',
        motherMaidenName: 'Ogunlade',
        nextOfKin: 'Mrs. Folake Adebayo',
        nextOfKinPhone: '+2349034567891',
        phone: '+2349034567890',
        drivenBefore: true,
        experiencedDriver: true,
        lastDrove: '2026-01',
        requireLicense: true,
        preferredLessonTime: 'Morning (8am — 12pm)',
      },
    }),
    prisma.studentRegistration.create({
      data: {
        studentId: student7.id,
        surname: 'Abdullahi',
        otherNames: 'Zainab',
        nin: '78901234567',
        lgaOfOrigin: 'Zaria',
        dateOfBirth: new Date('2001-12-05'),
        stateOrigin: 'Kaduna',
        address: '18 Kano Road, Zaria, Kaduna',
        bloodGroup: 'B-',
        motherMaidenName: 'Usman',
        nextOfKin: 'Alhaji Musa Abdullahi',
        nextOfKinPhone: '+2347067823457',
        phone: '+2347067823456',
        drivenBefore: false,
        requireLicense: true,
        preferredLessonTime: 'Evening (5pm — 8pm)',
      },
    }),
    prisma.studentRegistration.create({
      data: {
        studentId: student8.id,
        surname: 'Nwosu',
        otherNames: 'Emeka John',
        nin: '89012345678',
        lgaOfOrigin: 'Enugu North',
        dateOfBirth: new Date('1998-08-22'),
        stateOrigin: 'Enugu',
        address: '3 Nza Street, Independence Layout, Enugu',
        bloodGroup: 'O+',
        motherMaidenName: 'Ugwu',
        nextOfKin: 'Mr. Chinedu Nwosu',
        nextOfKinPhone: '+2348098734568',
        phone: '+2348098734567',
        drivenBefore: true,
        experiencedDriver: false,
        lastDrove: '2024-03',
        requireLicense: true,
        preferredLessonTime: 'Afternoon (1pm — 5pm)',
      },
    }),
    prisma.studentRegistration.create({
      data: {
        studentId: student9.id,
        surname: 'Aluko',
        otherNames: 'Funmi Esther',
        nin: '90123456789',
        lgaOfOrigin: 'Ibadan South-West',
        dateOfBirth: new Date('2002-01-17'),
        stateOrigin: 'Oyo',
        address: '12 Oke-Ado Road, Molete, Ibadan, Oyo',
        bloodGroup: 'A+',
        motherMaidenName: 'Adeyemi',
        nextOfKin: 'Pastor David Aluko',
        nextOfKinPhone: '+2348034578913',
        phone: '+2348034578912',
        drivenBefore: false,
        requireLicense: true,
        preferredLessonTime: 'Morning (8am — 12pm)',
      },
    }),
    prisma.studentRegistration.create({
      data: {
        studentId: student10.id,
        surname: 'Yusuf',
        otherNames: 'Ismail Abdullahi',
        nin: '01234567890',
        lgaOfOrigin: 'Kano Municipal',
        dateOfBirth: new Date('1997-06-11'),
        stateOrigin: 'Kano',
        address: '29 Ibrahim Taiwo Road, Kano',
        bloodGroup: 'AB-',
        motherMaidenName: 'Sani',
        nextOfKin: 'Malam Yusuf Sani',
        nextOfKinPhone: '+2347012345679',
        phone: '+2347012345678',
        drivenBefore: false,
        requireLicense: true,
        preferredLessonTime: 'Afternoon (1pm — 5pm)',
      },
    }),
  ]);

  // ─── VEHICLES ────────────────────────────────────────────────
  const vehicles = await prisma.$transaction([
    prisma.vehicle.create({
      data: {
        name: 'Toyota Corolla (Manual)',
        model: '2023 Toyota Corolla',
        plateNumber: 'LSD 123 XY',
        transmissionType: 'manual',
        insuranceExpiry: new Date('2026-12-31'),
        maintenanceSchedule: 'Every 5,000 km — next due Aug 2026',
        status: 'available',
      },
    }),
    prisma.vehicle.create({
      data: {
        name: 'Toyota Corolla (Automatic)',
        model: '2024 Toyota Corolla',
        plateNumber: 'ABC 456 DE',
        transmissionType: 'automatic',
        insuranceExpiry: new Date('2027-03-15'),
        maintenanceSchedule: 'Every 5,000 km — next due Sep 2026',
        status: 'available',
      },
    }),
    prisma.vehicle.create({
      data: {
        name: 'Honda Civic (Manual)',
        model: '2022 Honda Civic',
        plateNumber: 'FST 789 GH',
        transmissionType: 'manual',
        insuranceExpiry: new Date('2026-10-20'),
        maintenanceSchedule: 'Every 6,000 km — next due Jul 2026',
        status: 'available',
      },
    }),
    prisma.vehicle.create({
      data: {
        name: 'Mazda CX-5 (Automatic)',
        model: '2023 Mazda CX-5',
        plateNumber: 'GEE 321 JK',
        transmissionType: 'automatic',
        insuranceExpiry: new Date('2027-01-10'),
        maintenanceSchedule: 'Every 7,000 km — next due Nov 2026',
        status: 'available',
      },
    }),
    prisma.vehicle.create({
      data: {
        name: 'Toyota Camry (Automatic)',
        model: '2024 Toyota Camry',
        plateNumber: 'LND 654 LM',
        transmissionType: 'automatic',
        insuranceExpiry: new Date('2026-09-05'),
        maintenanceSchedule: 'Every 5,000 km — next due Oct 2026',
        status: 'maintenance',
      },
    }),
    prisma.vehicle.create({
      data: {
        name: 'Suzuki Swift (Manual)',
        model: '2023 Suzuki Swift',
        plateNumber: 'KWL 987 NO',
        transmissionType: 'manual',
        insuranceExpiry: new Date('2027-06-30'),
        maintenanceSchedule: 'Every 5,000 km — next due Dec 2026',
        status: 'available',
      },
    }),
  ]);

  const [vehicle1, vehicle2, vehicle3, vehicle4, vehicle5, vehicle6] = vehicles;

  // ─── ENROLLMENTS ─────────────────────────────────────────────
  const enrollments = await prisma.$transaction([
    prisma.enrollment.create({ data: { studentId: student1.id, courseId: course1.id, instructorId: instructor1.id, enrollmentDate: new Date('2026-01-16'), status: 'active', paid: true } }),
    prisma.enrollment.create({ data: { studentId: student2.id, courseId: course2.id, instructorId: instructor2.id, enrollmentDate: new Date('2026-02-02'), status: 'active', paid: true } }),
    prisma.enrollment.create({ data: { studentId: student3.id, courseId: course1.id, instructorId: instructor3.id, enrollmentDate: new Date('2026-02-21'), status: 'active', paid: false } }),
    prisma.enrollment.create({ data: { studentId: student4.id, courseId: course4.id, instructorId: instructor2.id, enrollmentDate: new Date('2026-03-02'), status: 'active', paid: true } }),
    prisma.enrollment.create({ data: { studentId: student5.id, courseId: course2.id, instructorId: instructor2.id, enrollmentDate: new Date('2026-03-11'), status: 'completed', paid: true } }),
    prisma.enrollment.create({ data: { studentId: student6.id, courseId: course3.id, instructorId: instructor1.id, enrollmentDate: new Date('2026-03-16'), status: 'active', paid: true } }),
    prisma.enrollment.create({ data: { studentId: student7.id, courseId: course2.id, instructorId: instructor2.id, enrollmentDate: new Date('2026-04-02'), status: 'active', paid: false } }),
    prisma.enrollment.create({ data: { studentId: student8.id, courseId: course1.id, instructorId: instructor1.id, enrollmentDate: new Date('2026-04-11'), status: 'active', paid: true } }),
    prisma.enrollment.create({ data: { studentId: student9.id, courseId: course4.id, instructorId: instructor3.id, enrollmentDate: new Date('2026-04-21'), status: 'cancelled', paid: false } }),
    prisma.enrollment.create({ data: { studentId: student10.id, courseId: course1.id, instructorId: instructor3.id, enrollmentDate: new Date('2026-05-02'), status: 'active', paid: true } }),
    // Second enrollment for student6 (completed course)
    prisma.enrollment.create({ data: { studentId: student6.id, courseId: course1.id, instructorId: instructor1.id, enrollmentDate: new Date('2025-11-01'), status: 'completed', paid: true } }),
  ]);

  const [enrollment1, enrollment2, enrollment3, enrollment4, enrollment5, enrollment6, enrollment7, enrollment8, enrollment9, enrollment10, enrollment11] = enrollments;

  // ─── LESSONS ─────────────────────────────────────────────────
  const now = new Date();
  const day = (offset: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    return d;
  };

  const lessons = await prisma.$transaction([
    // Enrollment 1 — Student 1, Course 1 (Manual), Instructor 1
    prisma.lesson.create({ data: { enrollmentId: enrollment1.id, instructorId: instructor1.id, vehicleId: vehicle1.id, scheduledDate: day(-20), durationMinutes: 90, attendanceStatus: 'present', startTime: day(-20), endTime: new Date(day(-20).getTime() + 90 * 60 * 1000) } }),
    prisma.lesson.create({ data: { enrollmentId: enrollment1.id, instructorId: instructor1.id, vehicleId: vehicle1.id, scheduledDate: day(-17), durationMinutes: 90, attendanceStatus: 'present', startTime: day(-17), endTime: new Date(day(-17).getTime() + 90 * 60 * 1000) } }),
    prisma.lesson.create({ data: { enrollmentId: enrollment1.id, instructorId: instructor1.id, vehicleId: vehicle1.id, scheduledDate: day(-14), durationMinutes: 90, attendanceStatus: 'present', startTime: day(-14), endTime: new Date(day(-14).getTime() + 90 * 60 * 1000) } }),
    // Enrollment 2 — Student 2, Course 2 (Auto), Instructor 2
    prisma.lesson.create({ data: { enrollmentId: enrollment2.id, instructorId: instructor2.id, vehicleId: vehicle2.id, scheduledDate: day(-18), durationMinutes: 60, attendanceStatus: 'present', startTime: day(-18), endTime: new Date(day(-18).getTime() + 60 * 60 * 1000) } }),
    prisma.lesson.create({ data: { enrollmentId: enrollment2.id, instructorId: instructor2.id, vehicleId: vehicle2.id, scheduledDate: day(-11), durationMinutes: 60, attendanceStatus: 'absent' } }),
    prisma.lesson.create({ data: { enrollmentId: enrollment2.id, instructorId: instructor2.id, vehicleId: vehicle4.id, scheduledDate: day(-4), durationMinutes: 60, attendanceStatus: 'present', startTime: day(-4), endTime: new Date(day(-4).getTime() + 60 * 60 * 1000) } }),
    // Enrollment 4 — Student 4, Course 4 (Defensive), Instructor 2
    prisma.lesson.create({ data: { enrollmentId: enrollment4.id, instructorId: instructor2.id, vehicleId: vehicle2.id, scheduledDate: day(-10), durationMinutes: 90, attendanceStatus: 'present', startTime: day(-10), endTime: new Date(day(-10).getTime() + 90 * 60 * 1000) } }),
    prisma.lesson.create({ data: { enrollmentId: enrollment4.id, instructorId: instructor2.id, vehicleId: vehicle4.id, scheduledDate: day(-3), durationMinutes: 90, attendanceStatus: 'scheduled' } }),
    // Enrollment 5 — Student 5, Course 2 (Auto), Instructor 2 — completed course
    prisma.lesson.create({ data: { enrollmentId: enrollment5.id, instructorId: instructor2.id, vehicleId: vehicle2.id, scheduledDate: day(-30), durationMinutes: 60, attendanceStatus: 'present', startTime: day(-30), endTime: new Date(day(-30).getTime() + 60 * 60 * 1000) } }),
    prisma.lesson.create({ data: { enrollmentId: enrollment5.id, instructorId: instructor2.id, vehicleId: vehicle2.id, scheduledDate: day(-25), durationMinutes: 60, attendanceStatus: 'present', startTime: day(-25), endTime: new Date(day(-25).getTime() + 60 * 60 * 1000) } }),
    prisma.lesson.create({ data: { enrollmentId: enrollment5.id, instructorId: instructor2.id, vehicleId: vehicle2.id, scheduledDate: day(-20), durationMinutes: 60, attendanceStatus: 'present', startTime: day(-20), endTime: new Date(day(-20).getTime() + 60 * 60 * 1000) } }),
    // Enrollment 6 — Student 6, Course 3 (Advanced), Instructor 1
    prisma.lesson.create({ data: { enrollmentId: enrollment6.id, instructorId: instructor1.id, vehicleId: vehicle3.id, scheduledDate: day(-8), durationMinutes: 120, attendanceStatus: 'present', startTime: day(-8), endTime: new Date(day(-8).getTime() + 120 * 60 * 1000) } }),
    prisma.lesson.create({ data: { enrollmentId: enrollment6.id, instructorId: instructor1.id, vehicleId: vehicle3.id, scheduledDate: day(-1), durationMinutes: 120, attendanceStatus: 'scheduled' } }),
    // Enrollment 8 — Student 8, Course 1 (Manual), Instructor 1
    prisma.lesson.create({ data: { enrollmentId: enrollment8.id, instructorId: instructor1.id, vehicleId: vehicle1.id, scheduledDate: day(-6), durationMinutes: 90, attendanceStatus: 'present', startTime: day(-6), endTime: new Date(day(-6).getTime() + 90 * 60 * 1000) } }),
    prisma.lesson.create({ data: { enrollmentId: enrollment8.id, instructorId: instructor1.id, vehicleId: vehicle3.id, scheduledDate: day(2), durationMinutes: 90, attendanceStatus: 'scheduled' } }),
    // Enrollment 10 — Student 10, Course 1 (Manual), Instructor 3
    prisma.lesson.create({ data: { enrollmentId: enrollment10.id, instructorId: instructor3.id, vehicleId: vehicle6.id, scheduledDate: day(-2), durationMinutes: 90, attendanceStatus: 'present', startTime: day(-2), endTime: new Date(day(-2).getTime() + 90 * 60 * 1000) } }),
    // Enrollment 11 — Student 6, Course 1 (completed), Instructor 1
    prisma.lesson.create({ data: { enrollmentId: enrollment11.id, instructorId: instructor1.id, vehicleId: vehicle1.id, scheduledDate: day(-60), durationMinutes: 90, attendanceStatus: 'present', startTime: day(-60), endTime: new Date(day(-60).getTime() + 90 * 60 * 1000) } }),
    prisma.lesson.create({ data: { enrollmentId: enrollment11.id, instructorId: instructor1.id, vehicleId: vehicle1.id, scheduledDate: day(-55), durationMinutes: 90, attendanceStatus: 'present', startTime: day(-55), endTime: new Date(day(-55).getTime() + 90 * 60 * 1000) } }),
    prisma.lesson.create({ data: { enrollmentId: enrollment11.id, instructorId: instructor1.id, vehicleId: vehicle1.id, scheduledDate: day(-50), durationMinutes: 90, attendanceStatus: 'present', startTime: day(-50), endTime: new Date(day(-50).getTime() + 90 * 60 * 1000) } }),
  ]);

  // ─── LESSON EVALUATIONS (for completed lessons on a 1-10 scale) ─
  await prisma.$transaction([
    prisma.lessonEvaluation.create({
      data: {
        lessonId: lessons[0].id,
        instructorId: instructor1.id,
        steeringScore: 7,
        parkingScore: 6,
        reverseParkingScore: 5,
        roadAwarenessScore: 7,
        confidenceScore: 6,
        strengths: 'Good clutch control and gear coordination for a beginner.',
        improvements: 'Needs more practice with hill starts and mirror checks.',
        comments: 'Blessing showed good progress in the first lesson. Confident but needs to work on smooth gear transitions.',
      },
    }),
    prisma.lessonEvaluation.create({
      data: {
        lessonId: lessons[1].id,
        instructorId: instructor1.id,
        steeringScore: 8,
        parkingScore: 7,
        reverseParkingScore: 6,
        roadAwarenessScore: 8,
        confidenceScore: 7,
        strengths: 'Significant improvement in road awareness. Much better at anticipating traffic.',
        improvements: 'Reverse parking still needs work. Practice parallel parking.',
        comments: 'Blessing is progressing well. Much more comfortable behind the wheel.',
      },
    }),
    prisma.lessonEvaluation.create({
      data: {
        lessonId: lessons[2].id,
        instructorId: instructor1.id,
        steeringScore: 8,
        parkingScore: 8,
        reverseParkingScore: 7,
        roadAwarenessScore: 9,
        confidenceScore: 8,
        strengths: 'Excellent road awareness and decision making. Smooth gear changes.',
        improvements: 'Continue practising reverse parking to build consistency.',
        comments: 'Blessing is nearly ready for her driving test. Great improvement overall.',
      },
    }),
    prisma.lessonEvaluation.create({
      data: {
        lessonId: lessons[3].id,
        instructorId: instructor2.id,
        steeringScore: 6,
        parkingScore: 6,
        reverseParkingScore: 5,
        roadAwarenessScore: 7,
        confidenceScore: 6,
        strengths: 'Good understanding of road signs and basic control.',
        improvements: 'Needs to relax grip on steering wheel. Practice smooth braking.',
        comments: 'Tunde\'s first lesson went well. He is nervous but coachable.',
      },
    }),
    prisma.lessonEvaluation.create({
      data: {
        lessonId: lessons[5].id,
        instructorId: instructor2.id,
        steeringScore: 8,
        parkingScore: 7,
        reverseParkingScore: 7,
        roadAwarenessScore: 8,
        confidenceScore: 8,
        strengths: 'Much more relaxed. Smooth steering and good spatial awareness.',
        improvements: 'Check blind spots more consistently before changing lanes.',
        comments: 'Tunde has come a long way. Ready to prepare for the test.',
      },
    }),
    prisma.lessonEvaluation.create({
      data: {
        lessonId: lessons[6].id,
        instructorId: instructor2.id,
        steeringScore: 9,
        parkingScore: 8,
        reverseParkingScore: 8,
        roadAwarenessScore: 9,
        confidenceScore: 9,
        strengths: 'Excellent defensive driving techniques. Very aware of surroundings.',
        improvements: 'Work on smooth acceleration in heavy traffic.',
        comments: 'Sule is an experienced driver refining his skills. Doing very well.',
      },
    }),
    prisma.lessonEvaluation.create({
      data: {
        lessonId: lessons[8].id,
        instructorId: instructor2.id,
        steeringScore: 7,
        parkingScore: 8,
        reverseParkingScore: 7,
        roadAwarenessScore: 7,
        confidenceScore: 6,
        strengths: 'Good control of the automatic vehicle. Comfortable with city driving.',
        improvements: 'Build confidence when merging onto highways.',
        comments: 'Amara is picking up quickly. Automatic transmission suits her well.',
      },
    }),
    prisma.lessonEvaluation.create({
      data: {
        lessonId: lessons[10].id,
        instructorId: instructor1.id,
        steeringScore: 9,
        parkingScore: 8,
        reverseParkingScore: 8,
        roadAwarenessScore: 9,
        confidenceScore: 9,
        strengths: 'Masterful control at high speeds. Excellent hazard perception.',
        improvements: 'Minor — practice emergency braking technique.',
        comments: 'Segun is excelling in the advanced course. Natural driver.',
      },
    }),
    prisma.lessonEvaluation.create({
      data: {
        lessonId: lessons[12].id,
        instructorId: instructor1.id,
        steeringScore: 7,
        parkingScore: 6,
        reverseParkingScore: 6,
        roadAwarenessScore: 7,
        confidenceScore: 7,
        strengths: 'Good foundational skills. Follows instructions well.',
        improvements: 'Practice clutch control on inclines and smooth braking.',
        comments: 'Emeka has good potential. Needs consistent practice.',
      },
    }),
    prisma.lessonEvaluation.create({
      data: {
        lessonId: lessons[14].id,
        instructorId: instructor3.id,
        steeringScore: 7,
        parkingScore: 7,
        reverseParkingScore: 6,
        roadAwarenessScore: 8,
        confidenceScore: 7,
        strengths: 'Quick learner. Good road sense and observation.',
        improvements: 'Work on reverse parking technique.',
        comments: 'Ismail had a solid first lesson with Uche. Promising start.',
      },
    }),
    prisma.lessonEvaluation.create({
      data: {
        lessonId: lessons[15].id,
        instructorId: instructor1.id,
        steeringScore: 8,
        parkingScore: 7,
        reverseParkingScore: 7,
        roadAwarenessScore: 8,
        confidenceScore: 8,
        strengths: 'Consistent improvement every lesson. Good all-round driver.',
        improvements: 'Final polish on parallel parking.',
        comments: 'Segun completed the basic manual course with flying colours.',
      },
    }),
    prisma.lessonEvaluation.create({
      data: {
        lessonId: lessons[16].id,
        instructorId: instructor1.id,
        steeringScore: 9,
        parkingScore: 8,
        reverseParkingScore: 8,
        roadAwarenessScore: 9,
        confidenceScore: 9,
        strengths: 'Excellent performance across all metrics.',
        improvements: 'None — ready for certification.',
        comments: 'Segun is one of the best students we have had. Ready for the road.',
      },
    }),
  ]);

  // ─── PAYMENTS ─────────────────────────────────────────────────
  await prisma.$transaction([
    prisma.payment.create({ data: { studentId: student1.id, amount: new Prisma.Decimal(180000), paymentMethod: 'bank_transfer', status: 'completed', reference: 'PAY-FDS-001-A1B2C3', createdAt: new Date('2026-01-14') } }),
    prisma.payment.create({ data: { studentId: student2.id, amount: new Prisma.Decimal(150000), paymentMethod: 'card', status: 'completed', reference: 'PAY-FDS-002-D4E5F6', createdAt: new Date('2026-01-30') } }),
    prisma.payment.create({ data: { studentId: student3.id, amount: new Prisma.Decimal(180000), paymentMethod: 'bank_transfer', status: 'pending', reference: 'PAY-FDS-003-G7H8I9', createdAt: new Date('2026-02-19') } }),
    prisma.payment.create({ data: { studentId: student4.id, amount: new Prisma.Decimal(250000), paymentMethod: 'card', status: 'completed', reference: 'PAY-FDS-004-J0K1L2', createdAt: new Date('2026-02-28') } }),
    prisma.payment.create({ data: { studentId: student5.id, amount: new Prisma.Decimal(150000), paymentMethod: 'bank_transfer', status: 'completed', reference: 'PAY-FDS-005-M3N4O5', createdAt: new Date('2026-03-09') } }),
    prisma.payment.create({ data: { studentId: student6.id, amount: new Prisma.Decimal(350000), paymentMethod: 'card', status: 'completed', reference: 'PAY-FDS-006-P6Q7R8', createdAt: new Date('2026-03-14') } }),
    prisma.payment.create({ data: { studentId: student6.id, amount: new Prisma.Decimal(180000), paymentMethod: 'bank_transfer', status: 'completed', reference: 'PAY-FDS-007-S9T0U1', createdAt: new Date('2025-10-28') } }),
    prisma.payment.create({ data: { studentId: student7.id, amount: new Prisma.Decimal(150000), paymentMethod: 'card', status: 'pending', reference: 'PAY-FDS-008-V2W3X4', createdAt: new Date('2026-03-30') } }),
    prisma.payment.create({ data: { studentId: student8.id, amount: new Prisma.Decimal(180000), paymentMethod: 'bank_transfer', status: 'completed', reference: 'PAY-FDS-009-Y5Z6A7', createdAt: new Date('2026-04-09') } }),
    prisma.payment.create({ data: { studentId: student10.id, amount: new Prisma.Decimal(180000), paymentMethod: 'card', status: 'completed', reference: 'PAY-FDS-010-B8C9D0', createdAt: new Date('2026-04-30') } }),
    prisma.payment.create({ data: { studentId: student8.id, amount: new Prisma.Decimal(50000), paymentMethod: 'bank_transfer', status: 'failed', reference: 'PAY-FDS-011-E1F2G3', createdAt: new Date('2026-04-08') } }),
    prisma.payment.create({ data: { studentId: student9.id, amount: new Prisma.Decimal(250000), paymentMethod: 'card', status: 'refunded', reference: 'PAY-FDS-012-H4I5J6', createdAt: new Date('2026-04-18') } }),
  ]);

  // ─── CERTIFICATES ────────────────────────────────────────────
  await prisma.$transaction([
    prisma.certificate.create({
      data: {
        studentId: student6.id,
        courseId: course1.id,
        issueDate: new Date('2026-02-01'),
        certificateNumber: 'FDS-2026-001',
        status: 'approved',
        adminNotes: 'Segun completed the Manual Driving Basic course with outstanding performance. Certificate approved.',
      },
    }),
    prisma.certificate.create({
      data: {
        studentId: student5.id,
        courseId: course2.id,
        issueDate: new Date('2026-04-10'),
        certificateNumber: 'FDS-2026-002',
        status: 'pending',
        adminNotes: 'Awaiting final sign-off from the lead instructor.',
      },
    }),
  ]);

  // ─── BLOG CATEGORIES ─────────────────────────────────────────
  const blogCategories = await prisma.$transaction([
    prisma.blogCategory.create({ data: { name: 'Driving Tips', slug: 'driving-tips' } }),
    prisma.blogCategory.create({ data: { name: 'Road Safety', slug: 'road-safety' } }),
  ]);

  // ─── BLOG POSTS ──────────────────────────────────────────────
  await prisma.$transaction([
    prisma.blogPost.create({
      data: {
        title: '10 Essential Tips for New Drivers in Nigeria',
        slug: 'essential-tips-new-drivers-nigeria',
        content: `Driving in Nigeria can be challenging for new drivers. Here are ten essential tips to help you stay safe on the road:\n\n1. **Always check your mirrors** — Before changing lanes or turning, make sure you know what is around you.\n2. **Maintain a safe following distance** — Keep at least a 3-second gap between you and the vehicle ahead.\n3. **Use your indicators** — Signal your intentions early to give other road users time to react.\n4. **Obey traffic lights and road signs** — They are there for your safety and the safety of others.\n5. **Avoid distracted driving** — Put your phone away and focus on the road.\n6. **Stay within speed limits** — Speeding reduces your reaction time and increases accident severity.\n7. **Be extra cautious at night** — Reduced visibility means you need to be more alert.\n8. **Maintain your vehicle** — Regular servicing prevents breakdowns and accidents.\n9. **Watch out for pedestrians and animals** — Nigerian roads often have unexpected obstacles.\n10. **Take a professional driving course** — Proper training makes you a safer driver for life.`,
        excerpt: 'New to driving in Nigeria? Here are 10 essential tips to keep you safe and confident behind the wheel.',
        imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d',
        categoryId: blogCategories[0].id,
        authorId: adminUserId1,
        published: true,
      },
    }),
    prisma.blogPost.create({
      data: {
        title: 'Understanding the FRSC Driving Test: What to Expect',
        slug: 'understanding-frsc-driving-test',
        content: `The Federal Road Safety Corps (FRSC) driving test is the final hurdle before you get your driver's licence. Here is what you need to know:\n\n**The Test Components**\nThe FRSC driving test typically consists of three parts:\n1. **Vehicle Inspection** — The examiner will check that you know the basic parts of the vehicle and can perform a simple safety check.\n2. **Manoeuvring** — You will be asked to perform parking, reversing, and turning exercises.\n3. **Road Test** — You will drive on public roads while the examiner assesses your driving skills.\n\n**What They Are Looking For**\n- Proper use of mirrors and signals\n- Smooth acceleration and braking\n- Correct gear usage (for manual vehicles)\n- Awareness of other road users\n- Compliance with traffic rules\n\n**Tips for Passing**\n- Practice regularly with a certified instructor\n- Arrive early and well-rested\n- Stay calm and focused\n- Listen carefully to the examiner's instructions\n- Do not rush — accuracy matters more than speed`,
        excerpt: 'Everything you need to know about the FRSC driving test — from vehicle inspection to the road test.',
        imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957',
        categoryId: blogCategories[0].id,
        authorId: adminUserId2,
        published: true,
      },
    }),
    prisma.blogPost.create({
      data: {
        title: 'Why Defensive Driving Should Be a Priority for Every Nigerian Driver',
        slug: 'defensive-driving-priority-nigerian-drivers',
        content: `Defensive driving is not just a skill — it is a mindset. In Nigeria, where road conditions can be unpredictable, defensive driving can save lives.\n\n**What Is Defensive Driving?**\nDefensive driving is the practice of anticipating potential hazards and making safe, well-informed decisions to avoid accidents. It is about being proactive rather than reactive.\n\n**Key Principles**\n1. **Always expect the unexpected** — Assume other drivers may make mistakes.\n2. **Maintain a safety cushion** — Keep space around your vehicle at all times.\n3. **Scan the road ahead** — Look 12-15 seconds ahead to identify potential hazards.\n4. **Manage your speed** — Adjust your speed based on road conditions, traffic, and weather.\n5. **Stay focused** — Avoid distractions and keep your attention on driving.\n\n**Benefits of Defensive Driving**\n- Reduces the risk of accidents\n- Lowers insurance premiums\n- Improves fuel efficiency\n- Reduces vehicle wear and tear\n- Gives you peace of mind on the road\n\nAt Falcon Driving School, our Defensive Driving course covers all these principles and more. Enrol today and become a safer driver.`,
        excerpt: 'Defensive driving can reduce accidents, lower insurance costs, and give you peace of mind on Nigerian roads.',
        imageUrl: 'https://images.unsplash.com/photo-1468800954098-3442f0d2f9a8',
        categoryId: blogCategories[1].id,
        authorId: adminUserId1,
        published: true,
      },
    }),
  ]);

  // ─── COUPONS ─────────────────────────────────────────────────
  await prisma.$transaction([
    prisma.coupon.create({
      data: {
        code: 'FALCON10',
        description: '10% off any course — welcome offer',
        discountType: 'percentage',
        discountValue: new Prisma.Decimal(10),
        maxUses: 50,
        currentUses: 12,
        minAmount: new Prisma.Decimal(100000),
        expiresAt: new Date('2026-12-31'),
        isActive: true,
      },
    }),
    prisma.coupon.create({
      data: {
        code: 'SAVE20K',
        description: 'Flat ₦20,000 off Advanced Driving course',
        discountType: 'fixed',
        discountValue: new Prisma.Decimal(20000),
        courseId: course3.id,
        maxUses: 20,
        currentUses: 3,
        expiresAt: new Date('2026-09-30'),
        isActive: true,
      },
    }),
  ]);

  // ─── NOTIFICATIONS (3 per user × 15 users) ─────────────────
  const allUserIds = allUsers.map((u) => u.id);
  const notificationTypes = ['info', 'warning', 'success', 'reminder'];
  const notificationMessages = [
    'Welcome to Falcon Driving School! We are excited to have you on board.',
    'Your next driving lesson is scheduled for tomorrow. Please arrive 10 minutes early.',
    'Payment received successfully. Thank you for your prompt payment.',
    'Your certificate has been approved. You can download it from your dashboard.',
    'Reminder: Please complete your student registration form.',
    'Your instructor has submitted a new evaluation for your last lesson.',
    'Important: The school will be closed on public holidays.',
    'Your course is progressing well. Keep up the great work!',
    'A new blog post has been published — check it out for helpful tips.',
    'Your driving licence verification is pending. Please upload a clear image.',
  ];

  const notificationData = allUserIds.flatMap((userId) =>
    [0, 1, 2].map((i) => ({
      userId,
      type: notificationTypes[i % notificationTypes.length],
      message: notificationMessages[(allUserIds.indexOf(userId) * 3 + i) % notificationMessages.length],
    })),
  );

  await prisma.notification.createMany({ data: notificationData });

  // ─── CONTACT MESSAGES ────────────────────────────────────────
  await prisma.$transaction([
    prisma.contactMessage.create({
      data: {
        name: 'Chinedu Okoro',
        email: 'chinedu.okoro@example.com',
        phone: '+2348031234567',
        message: 'Good day, I would like to enrol my 19-year-old daughter in the Automatic Driving course. Could you please send me the full list of requirements and the next available start date? Thank you.',
        userId: null,
      },
    }),
    prisma.contactMessage.create({
      data: {
        name: 'Yetunde Kuti',
        email: 'yetunde.kuti@example.com',
        phone: '+2348098765432',
        message: 'Hello, I am interested in the Defensive Driving course for our company fleet drivers. We have 12 drivers who need training. Do you offer corporate discounts or group packages? Please let me know.',
        userId: adminUserId1,
      },
    }),
  ]);

  // ─── SETTINGS ────────────────────────────────────────────────
  await prisma.$transaction([
    prisma.setting.create({ data: { key: 'school_name', value: 'Falcon Driving School' } }),
    prisma.setting.create({ data: { key: 'school_tagline', value: 'Your Journey to Safe Driving Starts Here' } }),
    prisma.setting.create({ data: { key: 'school_phone', value: '+234 800 FALCON (325266)' } }),
    prisma.setting.create({ data: { key: 'school_phone_alt', value: '+234 802 345 6789' } }),
    prisma.setting.create({ data: { key: 'school_email', value: 'info@falcondriving.com' } }),
    prisma.setting.create({ data: { key: 'school_address', value: '42 Allen Avenue, Ikeja, Lagos State, Nigeria' } }),
    prisma.setting.create({ data: { key: 'school_working_hours', value: 'Monday — Saturday: 7:00 AM — 7:00 PM' } }),
    prisma.setting.create({ data: { key: 'facebook_url', value: 'https://facebook.com/falcondrivingschool' } }),
    prisma.setting.create({ data: { key: 'instagram_url', value: 'https://instagram.com/falcondrivingschool' } }),
    prisma.setting.create({ data: { key: 'twitter_url', value: 'https://twitter.com/falcondriving' } }),
    prisma.setting.create({ data: { key: 'currency', value: '₦ (NGN — Nigerian Naira)' } }),
    prisma.setting.create({ data: { key: 'bank_name', value: 'GTBank Plc' } }),
    prisma.setting.create({ data: { key: 'bank_account_name', value: 'Falcon Driving School Nigeria Ltd' } }),
    prisma.setting.create({ data: { key: 'bank_account_number', value: '0123456789' } }),
    prisma.setting.create({ data: { key: 'bank_sort_code', value: '058-123456' } }),
    prisma.setting.create({ data: { key: 'frsc_license_number', value: 'FRSC/DL/2026/00321' } }),
    prisma.setting.create({ data: { key: 'rc_number', value: 'RC 1234567' } }),
    prisma.setting.create({ data: { key: 'tax_id', value: 'TIN: 123-456-789-000' } }),
  ]);

  console.log('✅ Seed completed successfully.');
  console.log(`   • ${allUsers.length} users created (password: "password123" for all)`);
  console.log(`   • ${instructors.length} instructors created`);
  console.log(`   • ${studentRecords.length} students created`);
  console.log(`   • ${courses.length} courses created`);
  console.log(`   • ${vehicles.length} vehicles created`);
  console.log(`   • ${enrollments.length} enrollments created`);
  console.log(`   • ${lessons.length} lessons created`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
