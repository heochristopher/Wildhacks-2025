// import {Locale} from 'next-intl';
// import {getTranslations, setRequestLocale} from 'next-intl/server';
// import {NextIntlClientProvider} from 'next-intl';

// interface Course {
//   id: number;
//   titleKey: string;
//   progress: number;
//   level: string;
// }

// const courses: Course[] = [
//   { id: 1, titleKey: 'brailleBasics', progress: 33, level: 'beginner' },
//   { id: 2, titleKey: 'intermediateBraille', progress: 66, level: 'intermediate' },
//   { id: 3, titleKey: 'advancedBraille', progress: 100, level: 'advanced' },
// ];

// type Props = {
//   params: {locale: Locale};
// };

// export default async function ProfilePage({params}: Props) {
//   const {locale} = await params;
//   setRequestLocale(locale);
  
//   // Get messages for client-side translations
//   const messages = await import(`../../../../messages/${locale}.json`);

//   // Pick only the messages we need
//   const profileMessages = {
//     LocaleSwitcher: messages.LocaleSwitcher,
//     profile: messages.profile,
//     levels: messages.levels,
//     courses: messages.courses
//   };

//   return (
//     <NextIntlClientProvider locale={locale} messages={profileMessages}>
//       <main 
//         className="min-h-screen bg-white text-gray-800 font-sans"
//         id="main-content"
//         role="main"
//         aria-label="User profile and course progress"
//       >
//         <header 
//           className="bg-blue-500 text-white py-6"
//           role="banner"
//         >
//           <div className="container mx-auto px-4">
//             <h1 className="text-3xl font-bold">{profileMessages.profile.title}</h1>
//             <p className="mt-2 text-lg">{profileMessages.profile.subtitle}</p>
//           </div>
//         </header>

//         <section 
//           className="container mx-auto px-4 py-8"
//           aria-labelledby="courses-heading"
//         >
//           <h2 id="courses-heading" className="sr-only">{profileMessages.profile.title}</h2>
//           <nav 
//             aria-label="Course progress"
//             className="space-y-6"
//           >
//             <ul role="list" className="space-y-6">
//               {courses.map((course) => (
//                 <li 
//                   key={course.id}
//                   role="listitem"
//                   aria-labelledby={`course-${course.id}-title`}
//                 >
//                   <article
//                     className="border rounded-lg p-6 shadow focus-within:ring-2 focus-within:ring-blue-500 transition"
//                     tabIndex={0}
//                   >
//                     <header>
//                       <h3 
//                         id={`course-${course.id}-title`}
//                         className="text-2xl font-semibold"
//                       >
//                         {profileMessages.courses[course.titleKey]}
//                       </h3>
//                       <p className="mt-1 text-sm text-gray-600">
//                         {profileMessages.profile.level}: {profileMessages.levels[course.level]}
//                       </p>
//                     </header>
//                     <div className="mt-4">
//                       <div
//                         className="bg-gray-300 rounded-full h-4 relative"
//                         role="progressbar"
//                         aria-valuenow={course.progress}
//                         aria-valuemin={0}
//                         aria-valuemax={100}
//                         aria-label={`${profileMessages.courses[course.titleKey]} progress: ${course.progress}%`}
//                       >
//                         <div
//                           className="bg-green-500 h-4 rounded-full"
//                           style={{ width: `${course.progress}%` }}
//                         >
//                           <span className="sr-only">
//                             {course.progress}% complete
//                           </span>
//                         </div>
//                       </div>
//                       <p className="mt-2 text-sm text-gray-700">
//                         {profileMessages.profile.progress}: {course.progress}%
//                       </p>
//                     </div>
//                     <div className="mt-4">
//                       <h4 className="text-lg font-medium text-gray-900">
//                         {profileMessages.profile.overview[course.level].title}
//                       </h4>
//                       <p className="mt-2 text-gray-600">
//                         {profileMessages.profile.overview[course.level].description}
//                       </p>
//                       <ul className="mt-2 list-disc list-inside text-gray-600">
//                         {profileMessages.profile.overview[course.level].skills.map((skill: string, index: number) => (
//                           <li key={index}>{skill}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   </article>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//         </section>

        
//       </main>
//     </NextIntlClientProvider>
//   );
// } 