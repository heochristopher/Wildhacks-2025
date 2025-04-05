// app/profile/page.tsx
import React from 'react';

interface Course {
  id: number;
  title: string;
  progress: number;
  level: string;
}

const courses: Course[] = [
  { id: 1, title: 'Braille Basics', progress: 33, level: 'Beginner' },
  { id: 2, title: 'Intermediate Braille', progress: 66, level: 'Intermediate' },
  { id: 3, title: 'Advanced Braille', progress: 100, level: 'Advanced' },
];

const ProfilePage: React.FC = () => {
  return (
    <>
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-blue-500"
      >
        Skip to main content
      </a>

      <main 
        className="min-h-screen bg-white text-gray-800 font-sans"
        id="main-content"
        role="main"
        aria-label="User profile and course progress"
      >
        {/* Header with website branding */}
        <header 
          className="bg-blue-500 text-white py-6"
          role="banner"
        >
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">dotbydot: Braille Learning Progress</h1>
            <p className="mt-2 text-lg">Empowering your journey to master Braille</p>
          </div>
        </header>

        {/* Main content area */}
        <section 
          className="container mx-auto px-4 py-8"
          aria-labelledby="courses-heading"
        >
          <h2 id="courses-heading" className="sr-only">Your Course Progress</h2>
          <nav 
            aria-label="Course progress"
            className="space-y-6"
          >
            <ul role="list" className="space-y-6">
              {courses.map((course) => (
                <li 
                  key={course.id}
                  role="listitem"
                  aria-labelledby={`course-${course.id}-title`}
                >
                  <article
                    className="border rounded-lg p-6 shadow focus-within:ring-2 focus-within:ring-blue-500 transition"
                    tabIndex={0}
                  >
                    <header>
                      <h3 
                        id={`course-${course.id}-title`}
                        className="text-2xl font-semibold"
                      >
                        {course.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">Level: {course.level}</p>
                    </header>
                    <div className="mt-4">
                      {/* Accessible progress bar */}
                      <div
                        className="bg-gray-300 rounded-full h-4 relative"
                        role="progressbar"
                        aria-valuenow={course.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${course.title} progress: ${course.progress}%`}
                      >
                        <div
                          className="bg-green-500 h-4 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        >
                          <span className="sr-only">
                            {course.progress}% complete
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">
                        Progress: {course.progress}%
                      </p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        {/* Footer with website branding */}
        <footer 
          className="bg-gray-100 py-4"
          role="contentinfo"
        >
          <div className="container mx-auto px-4 text-center text-sm text-gray-600">
            © 2025 dotbydot. All rights reserved.
          </div>
        </footer>
      </main>
    </>
  );
};

export default ProfilePage;
