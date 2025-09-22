import dotenv from 'dotenv'

dotenv.config()

function normalizeStrapiUrl(value) {
  if (!value) return value
  const trimmed = value.replace(/\/$/, '')
  return trimmed.endsWith('/admin') ? trimmed.slice(0, -'/admin'.length) : trimmed
}

const baseUrl = normalizeStrapiUrl(process.env.VITE_STRAPI_URL)
const apiKey = process.env.VITE_STRAPI_API_KEY

if (!baseUrl) {
  console.error('Missing VITE_STRAPI_URL in environment')
  process.exit(1)
}

async function request(path) {
  const headers = {
    'Content-Type': 'application/json',
  }

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`
  }

  const url = `${baseUrl}/${path}`
  const response = await fetch(url, { headers })
  const text = await response.text()

  let body
  try {
    body = JSON.parse(text)
  } catch (error) {
    console.error(`Failed to parse JSON for ${path}:`, error)
    console.error('Raw response:', text)
    throw error
  }

  return { status: response.status, body }
}

function preview(value) {
  const str = JSON.stringify(value, null, 2)
  return str.length > 400 ? `${str.slice(0, 400)}...` : str
}

async function run() {
  const courses = await request('api/courses?populate=banner_image&populate=teachers&sort=name')
  console.log('Courses status:', courses.status)
  console.log('Courses preview:', preview(courses.body))

  const firstCourseId = courses.body?.data?.[0]?.documentId ?? courses.body?.data?.[0]?.id
  if (firstCourseId) {
    const courseDetail = await request(`api/courses/${firstCourseId}?populate=banner_image&populate=teachers`)
    console.log(`Course ${firstCourseId} status:`, courseDetail.status)
    console.log('Course detail preview:', preview(courseDetail.body))
  } else {
    console.warn('No course id available to test detail endpoint')
  }

  const teachers = await request('api/teachers?populate=courses&sort=name')
  console.log('Teachers status:', teachers.status)
  console.log('Teachers preview:', preview(teachers.body))

  const firstTeacherId = teachers.body?.data?.[0]?.documentId ?? teachers.body?.data?.[0]?.id
  if (firstTeacherId) {
    const teacherDetail = await request(`api/teachers/${firstTeacherId}?populate=courses`)
    console.log(`Teacher ${firstTeacherId} status:`, teacherDetail.status)
    console.log('Teacher detail preview:', preview(teacherDetail.body))
  } else {
    console.warn('No teacher id available to test detail endpoint')
  }
}

run().catch((error) => {
  console.error('Strapi smoke test failed:', error)
  process.exit(1)
})
