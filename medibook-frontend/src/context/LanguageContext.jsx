import { createContext, useContext, useState, useEffect } from 'react'

const T = {
  en: {
    login: 'Sign in', register: 'Create account', logout: 'Sign out',
    email: 'Email address', password: 'Password', confirmPassword: 'Confirm password',
    name: 'Full Name', role: 'Role', instructor: 'Instructor', student: 'Student',
    forgotPassword: 'Forgot your password?', noAccount: "Don't have an account?", hasAccount: 'Already have an account?',
    required: 'This field is required', invalidEmail: 'Enter a valid email address',
    passwordMin: 'Password must be at least 6 characters',
    home: 'Home', courses: 'Courses', myCourses: 'My Learning',
    dashboard: 'Dashboard', profile: 'Profile', settings: 'Settings',
    loading: 'Loading…', save: 'Save changes', cancel: 'Cancel', back: 'Go back',
    search: 'Search courses by title, category...', noResults: 'No courses found',
    error: 'Something went wrong. Please try again.', success: 'Done!',
    welcomeBack: 'Welcome back', welcomeNew: 'Join CourseHub today',
    category: 'Category', allCategories: 'All Categories',
    sortBy: 'Sort by', rating: 'Rating', price: 'Price', free: 'Free',
    enrollNow: 'Enroll Now', startLearning: 'Continue Learning',
    lessons: 'Lessons', lesson: 'Lesson', duration: 'Duration',
    progress: 'Progress', completed: 'Completed',
    createCourse: 'Create Course', addLesson: 'Add Lesson',
    reviews: 'Reviews & Ratings', writeReview: 'Write a Review',
    comments: 'Discussion & Comments', addComment: 'Add a comment...',
    studentsEnrolled: 'Students Enrolled',
    darkMode: 'Dark mode', language: 'Language',
  },
  ar: {
    login: 'تسجيل الدخول', register: 'إنشاء حساب', logout: 'تسجيل الخروج',
    email: 'البريد الإلكتروني', password: 'كلمة المرور', confirmPassword: 'تأكيد كلمة المرور',
    name: 'الاسم الكامل', role: 'نوع الحساب', instructor: 'مدرب', student: 'طالب',
    forgotPassword: 'نسيت كلمة المرور؟', noAccount: 'ليس لديك حساب؟', hasAccount: 'لديك حساب بالفعل؟',
    required: 'هذا الحقل مطلوب', invalidEmail: 'أدخل بريدًا إلكترونيًا صحيحًا',
    passwordMin: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
    home: 'الرئيسية', courses: 'الكورسات', myCourses: 'دوراتي التعليمية',
    dashboard: 'لوحة التحكم', profile: 'الملف الشخصي', settings: 'الإعدادات',
    loading: 'جارٍ التحميل…', save: 'حفظ التغييرات', cancel: 'إلغاء', back: 'رجوع',
    search: 'ابحث عن كورس بالعنوان أو التصنيف...', noResults: 'لم يتم العثور على كورسات',
    error: 'حدث خطأ ما. يرجى المحاولة مجددًا.', success: 'تم!',
    welcomeBack: 'مرحبًا بعودتك', welcomeNew: 'انضم إلى المنصة التعليمية',
    category: 'التصنيف', allCategories: 'جميع التصنيفات',
    sortBy: 'ترتيب حسب', rating: 'التقييم', price: 'السعر', free: 'مجاني',
    enrollNow: 'سجل الآن في الكورس', startLearning: 'متابعة التعلم',
    lessons: 'الدروس', lesson: 'درس', duration: 'المدة',
    progress: 'نسبة الإنجاز', completed: 'مكتمل',
    createCourse: 'إنشاء كورس جديد', addLesson: 'إضافة درس',
    reviews: 'التقييمات والمراجعات', writeReview: 'أضف تقييمك',
    comments: 'النقاشات والتعليقات', addComment: 'اكتب تعليقك...',
    studentsEnrolled: 'الطلاب المسجلين',
    darkMode: 'الوضع المظلم', language: 'اللغة',
  }
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en')

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  const toggleLang = () => setLang(l => (l === 'en' ? 'ar' : 'en'))
  const t = (key) => T[lang]?.[key] || T.en[key] || key

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, isRTL: lang === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be inside <LanguageProvider>')
  return ctx
}
