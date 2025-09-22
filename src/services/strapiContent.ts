import { getStrapiBaseUrl } from './strapiClient.ts'

export type MediaAsset = {
  id: number
  url: string
  name?: string
  alternativeText?: string
  width?: number
  height?: number
}

export type CourseSummary = {
  id: number
  documentId?: string
  name: string
}

export type Course = {
  id: number
  documentId?: string
  name: string
  startDate?: string
  endDate?: string
  schedule?: string
  description?: string
  bannerImage?: MediaAsset
  teachers: Teacher[]
  zoomLink?: string
  monthlyPrice?: number
  semesterPrice?: number
  googleDriveLink?: string
  paymentPlans?: PaymentPlan[]
  enrollments?: Enrollment[]
}

export type StrapiMedia = {
  id: number
  url?: string | null
  name?: string | null
  alternativeText?: string | null
  width?: number | null
  height?: number | null
}

export type TeacherQualification = Record<string, unknown>

export type Teacher = {
  id: number
  documentId?: string
  name: string
  description?: string
  qualifications?: TeacherQualification[]
  avatar?: MediaAsset
  courses?: CourseSummary[]
}

export type PaymentPlan = {
  id: number
  documentId?: string
  name: string
  type: 'monthly' | 'semester' | 'one_time' | 'free'
  price: number
  billingCycleDays: number
  description?: string
  isActive: boolean
  course?: CourseSummary
  features?: Record<string, unknown>
}

export type Enrollment = {
  id: number
  documentId?: string
  user?: {
    id: number
    username: string
    email: string
    fullName: string
  }
  course?: CourseSummary
  paymentPlan?: PaymentPlan
  enrolledAt: string
  status: 'active' | 'inactive' | 'suspended' | 'cancelled'
  billingStatus: 'paid' | 'pending' | 'overdue' | 'free'
  nextBillingDate?: string
  totalPaid: number
  notes?: string
  payments?: Payment[]
}

export type Payment = {
  id: number
  documentId?: string
  enrollment?: Enrollment
  amount: number
  paymentMethod: 'credit_card' | 'bank_transfer' | 'cash' | 'free' | 'stripe' | 'paypal'
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled'
  paymentDate: string
  billingPeriodStart?: string
  billingPeriodEnd?: string
  transactionId?: string
  externalPaymentId?: string
  notes?: string
  refundAmount?: number
  refundDate?: string
  refundReason?: string
}

export type StrapiTeacher = {
  id: number
  documentId?: string
  name?: string | null
  description?: string | null
  qualifications?: TeacherQualification[] | null
  courses?: Array<{
    id: number
    documentId?: string
    name?: string | null
  }> | null
}

export type StrapiCourse = {
  id: number
  documentId?: string
  name?: string | null
  start_date?: string | null
  end_date?: string | null
  schedule?: string | null
  description?: string | null
  zoom_link?: string | null
  monthly_price?: number | string | null
  semester_price?: number | string | null
  google_drive_link?: string | null
  banner_image?: StrapiMedia | null
  teachers?: StrapiTeacher[] | null
  payment_plans?: StrapiPaymentPlan[] | null
  enrollments?: StrapiEnrollment[] | null
}

export type StrapiPaymentPlan = {
  id: number
  documentId?: string
  name?: string | null
  type?: 'monthly' | 'semester' | 'one_time' | 'free' | null
  price?: number | string | null
  billing_cycle_days?: number | null
  description?: string | null
  is_active?: boolean | null
  course?: StrapiCourse | null
  features?: Record<string, unknown> | null
}

export type StrapiEnrollment = {
  id: number
  documentId?: string
  user?: {
    id: number
    username?: string | null
    email?: string | null
    full_name?: string | null
  } | null
  course?: StrapiCourse | null
  payment_plan?: StrapiPaymentPlan | null
  enrolled_at?: string | null
  status?: 'active' | 'inactive' | 'suspended' | 'cancelled' | null
  billing_status?: 'paid' | 'pending' | 'overdue' | 'free' | null
  next_billing_date?: string | null
  total_paid?: number | string | null
  notes?: string | null
  payments?: StrapiPayment[] | null
}

export type StrapiPayment = {
  id: number
  documentId?: string
  enrollment?: StrapiEnrollment | null
  amount?: number | string | null
  payment_method?: 'credit_card' | 'bank_transfer' | 'cash' | 'free' | 'stripe' | 'paypal' | null
  status?: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled' | null
  payment_date?: string | null
  billing_period_start?: string | null
  billing_period_end?: string | null
  transaction_id?: string | null
  external_payment_id?: string | null
  notes?: string | null
  refund_amount?: number | string | null
  refund_date?: string | null
  refund_reason?: string | null
}

function toAbsoluteUrl(url?: string | null) {
  if (!url) {
    return undefined
  }

  try {
    const baseUrl = getStrapiBaseUrl()
    return new URL(url, baseUrl).toString()
  } catch (error) {
    console.warn('Failed to construct absolute Strapi media URL', error)
    return url
  }
}

function transformMedia(media?: StrapiMedia | null): MediaAsset | undefined {
  if (!media?.url) {
    return undefined
  }

  return {
    id: media.id,
    url: toAbsoluteUrl(media.url) ?? media.url,
    name: media.name ?? undefined,
    alternativeText: media.alternativeText ?? undefined,
    width: media.width ?? undefined,
    height: media.height ?? undefined,
  }
}

function parseNumber(value?: number | string | null) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  return undefined
}

function normalizeRichText(value?: string | null) {
  if (!value) {
    return undefined
  }

  const withoutTags = value.replace(/<[^>]*>/g, '')
  const trimmed = withoutTags.replace(/\s+/g, ' ').trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export function transformTeacher(teacher: StrapiTeacher, options: { includeCourses?: boolean } = {}): Teacher {
  const { includeCourses = false } = options

  let courses: CourseSummary[] | undefined
  if (includeCourses && teacher.courses?.length) {
    courses = teacher.courses
      .filter(
        (course): course is { id: number; documentId?: string; name?: string | null } =>
          typeof course?.id === 'number',
      )
      .map((course) => ({
        id: course.id,
        documentId: course.documentId ?? undefined,
        name: course.name ?? `Course #${course.id}`,
      }))
  }

  return {
    id: teacher.id,
    documentId: teacher.documentId ?? undefined,
    name: teacher.name ?? `Teacher #${teacher.id}`,
    description: normalizeRichText(teacher.description),
    qualifications: teacher.qualifications ?? undefined,
    avatar: undefined,
    courses,
  }
}

export function transformCourse(course: StrapiCourse): Course {
  const bannerImage = transformMedia(course.banner_image ?? undefined)
  const teachers = course.teachers?.map((teacher) => transformTeacher(teacher)) ?? []
  const paymentPlans = course.payment_plans?.map((plan) => transformPaymentPlan(plan)) ?? []
  const enrollments = course.enrollments?.map((enrollment) => transformEnrollment(enrollment)) ?? []

  return {
    id: course.id,
    documentId: course.documentId ?? undefined,
    name: course.name ?? `Course #${course.id}`,
    startDate: course.start_date ?? undefined,
    endDate: course.end_date ?? undefined,
    schedule: course.schedule ?? undefined,
    description: normalizeRichText(course.description),
    bannerImage,
    teachers,
    zoomLink: course.zoom_link ?? undefined,
    monthlyPrice: parseNumber(course.monthly_price),
    semesterPrice: parseNumber(course.semester_price),
    googleDriveLink: course.google_drive_link ?? undefined,
    paymentPlans,
    enrollments,
  }
}

export function transformPaymentPlan(plan: StrapiPaymentPlan): PaymentPlan {
  return {
    id: plan.id,
    documentId: plan.documentId ?? undefined,
    name: plan.name ?? `Plan #${plan.id}`,
    type: plan.type ?? 'free',
    price: parseNumber(plan.price) ?? 0,
    billingCycleDays: plan.billing_cycle_days ?? 30,
    description: normalizeRichText(plan.description),
    isActive: plan.is_active ?? true,
    course: plan.course ? {
      id: plan.course.id,
      documentId: plan.course.documentId ?? undefined,
      name: plan.course.name ?? `Course #${plan.course.id}`
    } : undefined,
    features: plan.features ?? undefined,
  }
}

export function transformEnrollment(enrollment: StrapiEnrollment): Enrollment {
  return {
    id: enrollment.id,
    documentId: enrollment.documentId ?? undefined,
    user: enrollment.user ? {
      id: enrollment.user.id,
      username: enrollment.user.username ?? '',
      email: enrollment.user.email ?? '',
      fullName: enrollment.user.full_name ?? ''
    } : undefined,
    course: enrollment.course ? {
      id: enrollment.course.id,
      documentId: enrollment.course.documentId ?? undefined,
      name: enrollment.course.name ?? `Course #${enrollment.course.id}`
    } : undefined,
    paymentPlan: enrollment.payment_plan ? transformPaymentPlan(enrollment.payment_plan) : undefined,
    enrolledAt: enrollment.enrolled_at ?? new Date().toISOString(),
    status: enrollment.status ?? 'active',
    billingStatus: enrollment.billing_status ?? 'pending',
    nextBillingDate: enrollment.next_billing_date ?? undefined,
    totalPaid: parseNumber(enrollment.total_paid) ?? 0,
    notes: normalizeRichText(enrollment.notes),
    payments: enrollment.payments?.map((payment) => transformPayment(payment)) ?? undefined,
  }
}

export function transformPayment(payment: StrapiPayment): Payment {
  return {
    id: payment.id,
    documentId: payment.documentId ?? undefined,
    enrollment: payment.enrollment ? transformEnrollment(payment.enrollment) : undefined,
    amount: parseNumber(payment.amount) ?? 0,
    paymentMethod: payment.payment_method ?? 'free',
    status: payment.status ?? 'pending',
    paymentDate: payment.payment_date ?? new Date().toISOString(),
    billingPeriodStart: payment.billing_period_start ?? undefined,
    billingPeriodEnd: payment.billing_period_end ?? undefined,
    transactionId: payment.transaction_id ?? undefined,
    externalPaymentId: payment.external_payment_id ?? undefined,
    notes: normalizeRichText(payment.notes),
    refundAmount: parseNumber(payment.refund_amount),
    refundDate: payment.refund_date ?? undefined,
    refundReason: normalizeRichText(payment.refund_reason),
  }
}
