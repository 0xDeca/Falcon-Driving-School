"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sidebar } from "@/components/layout/sidebar";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const LESSON_TIMES = [
  "Class 9 - 10 am Weekdays",
  "Class 10 - 11am",
  "Class 11 - 12pm",
  "Class 2 - 3pm",
  "Class 3 - 4pm",
  "Class 4 - 5pm",
  "Weekend Executive Program",
  "Saturday Only",
];
const STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

interface FormData {
  surname: string;
  other_names: string;
  nin: string;
  lga_of_origin: string;
  date_of_birth: string;
  state_origin: string;
  address: string;
  blood_group: string;
  mother_maiden_name: string;
  next_of_kin: string;
  next_of_kin_phone: string;
  phone: string;
  driven_before: string;
  experienced_driver: string;
  last_drove: string;
  require_license: string;
  preferred_lesson_time: string;
}

const INITIAL: FormData = {
  surname: "", other_names: "", nin: "", lga_of_origin: "",
  date_of_birth: "", state_origin: "", address: "", blood_group: "",
  mother_maiden_name: "", next_of_kin: "", next_of_kin_phone: "", phone: "",
  driven_before: "", experienced_driver: "", last_drove: "",
  require_license: "", preferred_lesson_time: "",
};

export default function StudentRegistration() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existing, setExisting] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      const { data: student } = await supabase.from("students").select("id, phone").eq("user_id", user.id).maybeSingle();
      if (!student) { router.push("/student/dashboard"); return; }
      setStudentId(student.id);
      if (student.phone) setForm((f) => ({ ...f, phone: student.phone }));
      const { data: reg } = await supabase.from("student_registrations").select("*").eq("student_id", student.id).maybeSingle();
      if (reg) {
        setExisting(reg);
        setForm({
          surname: reg.surname || "",
          other_names: reg.other_names || "",
          nin: reg.nin || "",
          lga_of_origin: reg.lga_of_origin || "",
          date_of_birth: reg.date_of_birth?.split("T")[0] || "",
          state_origin: reg.state_origin || "",
          address: reg.address || "",
          blood_group: reg.blood_group || "",
          mother_maiden_name: reg.mother_maiden_name || "",
          next_of_kin: reg.next_of_kin || "",
          next_of_kin_phone: reg.next_of_kin_phone || "",
          phone: reg.phone || student.phone || "",
          driven_before: reg.driven_before ? "yes" : "no",
          experienced_driver: reg.experienced_driver === null ? "" : reg.experienced_driver ? "yes" : "no",
          last_drove: reg.last_drove || "",
          require_license: reg.require_license ? "yes" : "no",
          preferred_lesson_time: reg.preferred_lesson_time || "",
        });
      }
      setLoading(false);
    };
    load();
  }, [router]);

  const update = (field: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.surname.trim()) errs.surname = "Required";
    if (!form.other_names.trim()) errs.other_names = "Required";
    if (!form.nin.trim()) errs.nin = "Required";
    if (!form.lga_of_origin.trim()) errs.lga_of_origin = "Required";
    if (!form.date_of_birth) errs.date_of_birth = "Required";
    if (!form.state_origin) errs.state_origin = "Required";
    if (!form.address.trim()) errs.address = "Required";
    if (!form.blood_group) errs.blood_group = "Required";
    if (!form.mother_maiden_name.trim()) errs.mother_maiden_name = "Required";
    if (!form.next_of_kin.trim()) errs.next_of_kin = "Required";
    if (!form.next_of_kin_phone.trim()) errs.next_of_kin_phone = "Required";
    if (!form.phone.trim()) errs.phone = "Required";
    if (!form.driven_before) errs.driven_before = "Required";
    if (form.driven_before === "yes" && !form.last_drove.trim()) errs.last_drove = "Required";
    if (!form.require_license) errs.require_license = "Required";
    if (!form.preferred_lesson_time) errs.preferred_lesson_time = "Required";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (!studentId) return;
    setSaving(true);
    try {
      const payload = {
        student_id: studentId,
        surname: form.surname.trim(),
        other_names: form.other_names.trim(),
        nin: form.nin.trim(),
        lga_of_origin: form.lga_of_origin.trim(),
        date_of_birth: form.date_of_birth,
        state_origin: form.state_origin,
        address: form.address.trim(),
        blood_group: form.blood_group,
        mother_maiden_name: form.mother_maiden_name.trim(),
        next_of_kin: form.next_of_kin.trim(),
        next_of_kin_phone: form.next_of_kin_phone.trim(),
        phone: form.phone.trim(),
        driven_before: form.driven_before === "yes",
        experienced_driver: form.driven_before === "yes" ? form.experienced_driver === "yes" : null,
        last_drove: form.driven_before === "yes" ? form.last_drove.trim() : null,
        require_license: form.require_license === "yes",
        preferred_lesson_time: form.preferred_lesson_time,
      };

      if (existing) {
        const { error } = await supabase
          .from("student_registrations")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", existing.id);
        if (error) throw error;
        toast.success("Registration updated!");
      } else {
        const { error } = await supabase
          .from("student_registrations")
          .insert(payload);
        if (error) throw error;
        toast.success("Registration submitted!");
      }
      router.push("/student/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to save registration");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="student" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />
      <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-primary">
              {existing ? "Update Registration" : "Student Registration"}
            </h1>
            <p className="text-gray-500 mt-1">
              This information is required to complete your enrollment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Surname *</Label>
                    <Input value={form.surname} onChange={(e) => update("surname", e.target.value)} className={errors.surname ? "border-red-500" : ""} />
                    {errors.surname && <p className="text-xs text-red-500">{errors.surname}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Other Names *</Label>
                    <Input value={form.other_names} onChange={(e) => update("other_names", e.target.value)} className={errors.other_names ? "border-red-500" : ""} />
                    {errors.other_names && <p className="text-xs text-red-500">{errors.other_names}</p>}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date of Birth *</Label>
                    <Input type="date" value={form.date_of_birth} onChange={(e) => update("date_of_birth", e.target.value)} className={errors.date_of_birth ? "border-red-500" : ""} />
                    {errors.date_of_birth && <p className="text-xs text-red-500">{errors.date_of_birth}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Blood Group *</Label>
                    <select value={form.blood_group} onChange={(e) => update("blood_group", e.target.value)} className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${errors.blood_group ? "border-red-500" : "border-input"}`}>
                      <option value="">Select blood group...</option>
                      {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                    {errors.blood_group && <p className="text-xs text-red-500">{errors.blood_group}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>NIN (National Identification Number) *</Label>
                  <Input value={form.nin} onChange={(e) => update("nin", e.target.value)} className={errors.nin ? "border-red-500" : ""} />
                  {errors.nin && <p className="text-xs text-red-500">{errors.nin}</p>}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>State of Origin *</Label>
                    <select value={form.state_origin} onChange={(e) => update("state_origin", e.target.value)} className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${errors.state_origin ? "border-red-500" : "border-input"}`}>
                      <option value="">Select state...</option>
                      {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state_origin && <p className="text-xs text-red-500">{errors.state_origin}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>LGA of Origin *</Label>
                    <Input value={form.lga_of_origin} onChange={(e) => update("lga_of_origin", e.target.value)} className={errors.lga_of_origin ? "border-red-500" : ""} />
                    {errors.lga_of_origin && <p className="text-xs text-red-500">{errors.lga_of_origin}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address *</Label>
                  <Input value={form.address} onChange={(e) => update("address", e.target.value)} className={errors.address ? "border-red-500" : ""} />
                  {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Family & Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Mother&apos;s Maiden Name *</Label>
                  <Input value={form.mother_maiden_name} onChange={(e) => update("mother_maiden_name", e.target.value)} className={errors.mother_maiden_name ? "border-red-500" : ""} />
                  {errors.mother_maiden_name && <p className="text-xs text-red-500">{errors.mother_maiden_name}</p>}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Next of Kin *</Label>
                    <Input value={form.next_of_kin} onChange={(e) => update("next_of_kin", e.target.value)} className={errors.next_of_kin ? "border-red-500" : ""} />
                    {errors.next_of_kin && <p className="text-xs text-red-500">{errors.next_of_kin}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Next of Kin Phone *</Label>
                    <Input type="tel" value={form.next_of_kin_phone} onChange={(e) => update("next_of_kin_phone", e.target.value)} className={errors.next_of_kin_phone ? "border-red-500" : ""} />
                    {errors.next_of_kin_phone && <p className="text-xs text-red-500">{errors.next_of_kin_phone}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={errors.phone ? "border-red-500" : ""} />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Driving Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Have you driven a car before? *</Label>
                  <div className="flex gap-4">
                    {["yes", "no"].map((v) => (
                      <label key={v} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="driven_before" value={v} checked={form.driven_before === v} onChange={(e) => update("driven_before", e.target.value)} className="h-4 w-4 text-accent" />
                        <span className="text-sm capitalize">{v}</span>
                      </label>
                    ))}
                  </div>
                  {errors.driven_before && <p className="text-xs text-red-500">{errors.driven_before}</p>}
                </div>

                {form.driven_before === "yes" && (
                  <>
                    <div className="space-y-2">
                      <Label>Do you consider yourself an experienced driver?</Label>
                      <div className="flex gap-4">
                        {["yes", "no"].map((v) => (
                          <label key={v} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="experienced_driver" value={v} checked={form.experienced_driver === v} onChange={(e) => update("experienced_driver", e.target.value)} className="h-4 w-4 text-accent" />
                            <span className="text-sm capitalize">{v}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>When last did you drive? *</Label>
                      <Input value={form.last_drove} onChange={(e) => update("last_drove", e.target.value)} placeholder="e.g. 2 months ago, 1 year ago" className={errors.last_drove ? "border-red-500" : ""} />
                      {errors.last_drove && <p className="text-xs text-red-500">{errors.last_drove}</p>}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Will you require a driver&apos;s license after your training? *</Label>
                  <div className="flex gap-4">
                    {["yes", "no"].map((v) => (
                      <label key={v} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="require_license" value={v} checked={form.require_license === v} onChange={(e) => update("require_license", e.target.value)} className="h-4 w-4 text-accent" />
                        <span className="text-sm capitalize">{v}</span>
                      </label>
                    ))}
                  </div>
                  {errors.require_license && <p className="text-xs text-red-500">{errors.require_license}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Choose your preferred lesson time *</Label>
                  <select value={form.preferred_lesson_time} onChange={(e) => update("preferred_lesson_time", e.target.value)} className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${errors.preferred_lesson_time ? "border-red-500" : "border-input"}`}>
                    <option value="">Select lesson time...</option>
                    {LESSON_TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.preferred_lesson_time && <p className="text-xs text-red-500">{errors.preferred_lesson_time}</p>}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button type="submit" variant="gold" className="flex-1" disabled={saving}>
                {saving ? "Saving..." : existing ? "Update Registration" : "Submit Registration"}
              </Button>
              {existing && (
                <Button type="button" variant="outline" onClick={() => router.push("/student/dashboard")}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
