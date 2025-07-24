# 🎓 Sistem Course Registry yang Dinamis dan Scalable

## 📋 Overview

Sistem course registry yang baru menggunakan **object mapping** untuk memetakan course ID ke komponen yang sesuai. Ini menggantikan pendekatan hard-coded if-else yang sebelumnya digunakan di CoursePage.

## 🏗️ Arsitektur Sistem

### 1. **Course Registry (`lib/course-registry.ts`)**

- **Object mapping** untuk memetakan course ID ke komponen
- **Metadata system** untuk menyimpan informasi course
- **Utility functions** untuk manajemen course

### 2. **Course Loader (`lib/course-loader.tsx`)**

- **Dynamic component loading** berdasarkan course ID
- **Error handling** dan fallback system
- **Type-safe component rendering**

### 3. **Auto-registration System**

- Course otomatis register saat di-import
- **No manual configuration** diperlukan di CoursePage
- **Scalable** untuk ratusan course

## 🔧 Struktur File

```
lib/
├── course-registry.ts     # Core registry system
└── course-loader.tsx      # Dynamic component loader

screen/courses/
├── index.ts              # Auto-import semua courses
├── course1_1_bilangan/
│   ├── index.ts          # Auto-register course
│   └── course.tsx        # Course component
└── course1_2_addition/   # Future course example
    ├── index.ts
    └── course.tsx
```

## 📝 Cara Menambah Course Baru

### Step 1: Buat Course Component

```typescript
// screen/courses/course1_2_addition/course.tsx
export function Course1_2_Addition() {
  return <div>{/* Course content here */}</div>;
}
```

### Step 2: Buat Auto-registration

```typescript
// screen/courses/course1_2_addition/index.ts
import { registerCourse } from "@/lib/course-registry";
import { Course1_2_Addition } from "./course";

registerCourse("course-id-here", {
  component: Course1_2_Addition,
  metadata: {
    title: "Penjumlahan Dasar",
    description: "Belajar penjumlahan angka 1-10",
    estimatedTime: "20-30 menit",
    difficulty: "easy",
    topics: ["addition", "basic-math"],
    gradeLevel: 1,
    materialType: "penjumlahan",
  },
});

export { Course1_2_Addition };
```

### Step 3: Update Main Index

```typescript
// screen/courses/index.ts
import "./course1_1_bilangan";
import "./course1_2_addition"; // Add this line

export * from "./course1_1_bilangan";
export * from "./course1_2_addition"; // Add this line
```

**That's it!** Course baru akan otomatis tersedia tanpa perlu mengubah CoursePage.

## 🚀 Keuntungan Sistem Baru

### ✅ **Scalability**

- Mudah menambah course baru
- Tidak perlu edit CoursePage
- Support ratusan course

### ✅ **Maintainability**

- Kode lebih bersih dan terorganisir
- Separation of concerns
- Easy debugging

### ✅ **Type Safety**

- Full TypeScript support
- Interface untuk metadata
- Runtime type checking

### ✅ **Performance**

- Dynamic loading
- Lazy loading ready (future)
- Error boundaries

### ✅ **Developer Experience**

- Auto-completion
- Clear error messages
- Consistent API

## 🔍 API Reference

### Course Registry Functions

```typescript
// Register course
registerCourse(courseId: string, entry: InteractiveCourseEntry): void

// Get course component
getCourseComponent(courseId: string): InteractiveCourseEntry | null

// Check if registered
isCourseRegistered(courseId: string): boolean

// Get all course IDs
getAllRegisteredCourses(): string[]

// Filter by grade
getCoursesByGrade(gradeLevel: number): Array<{id: string, entry: InteractiveCourseEntry}>

// Filter by material
getCoursesByMaterial(materialType: string): Array<{id: string, entry: InteractiveCourseEntry}>
```

### Course Loader Component

```typescript
<CourseLoader
  courseId="course-id-here"
  fallback={<CustomFallback />}
  onError={(error) => console.error(error)}
/>
```

## ⚡ Migration dari Sistem Lama

### Before (Hard-coded):

```typescript
const renderInteractiveCourse = () => {
  if (course?.id === "cmdheim6v0004yz100yq8h178") {
    return <Course1_1_Bilangan />;
  }
  if (course?.id === "another-course-id") {
    return <AnotherCourse />;
  }
  // ... dan seterusnya untuk setiap course
  return <DefaultFallback />;
};
```

### After (Dynamic):

```typescript
const renderInteractiveCourse = () => {
  if (!course?.id) {
    return <DefaultCourseFallback course={course} />;
  }

  return (
    <CourseLoader
      courseId={course.id}
      fallback={<DefaultCourseFallback course={course} />}
      onError={(error) => console.error("Error loading course:", error)}
    />
  );
};
```

## 🔮 Future Enhancements

1. **Lazy Loading**: Load course components on-demand
2. **Caching**: Cache loaded components
3. **Hot Reload**: Development-time hot reloading
4. **Analytics**: Track course loading performance
5. **A/B Testing**: Different versions of courses

---

**Sistem ini membuat penambahan course baru menjadi sangat mudah dan maintainable untuk jangka panjang!** 🎉
