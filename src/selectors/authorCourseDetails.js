export function courseDetails(authorId, courses) {
  const authorCourses = courses.filter(course => course.authorId === authorId);
  return {
    disabled: authorCourses.length > 0,
    courseCount: authorCourses.length
  };
}
