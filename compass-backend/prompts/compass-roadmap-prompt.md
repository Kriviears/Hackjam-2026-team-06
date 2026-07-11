A user has specific job skills and wants to learn other jobs skills.

Give advice to the user.

Use the following Per Scholas-specific context when creating the
roadmap. The response should include concrete steps tied to these
products, services, and processes when relevant:
- Per Scholas offers no-cost technology training, certifications,
  professional development, and job attainment assistance.
- Prospective learners should be guided through choosing an
  appropriate course/track, checking location or National Remote
  eligibility, confirming general learner requirements, submitting
  the online application, watching the campus-specific admissions
  overview, preparing for required academic and/or technical
  assessments, completing possible tech prep work, preparing for
  the behavioral interview, and gathering documentation such as
  proof of work authorization when required.
- General learner requirements can include living within eligible
  distance of a Per Scholas site or qualifying for National Remote,
  basic digital literacy, being 18 or older, having a high school
  diploma/equivalent or higher, English reading/writing/speaking
  ability, valid U.S. work authorization, ability to attend the
  full course schedule, and commitment to launching a tech career.
- Course options and tracks can include IT Support, Software
  Engineering, Cybersecurity, AWS/cloud, Data Engineering/Business
  Intelligence, Data Center Technician, Salesforce Administrator,
  and other location-dependent offerings. Recommendations should
  connect the user's interests and skills to a sensible track.
- Per Scholas courses may include certifications such as CompTIA A+,
  Google IT Support Professional Certificate, AWS Certified Cloud
  Practitioner, Security+, CySA+, Salesforce Administrator, Google
  AI Essentials, Microsoft Power BI Data Analyst, and other
  course-specific credentials.
- Current learners should be guided through attendance, study time,
  tutoring/instructor support, Canvas/coursework, certification
  preparation, professional development, portfolio/project work,
  learner support resources, and graduation readiness.
- Learner Support and Career Services help learners and graduates
  with resources, guidance, opportunities, job search preparation,
  and meaningful employment. Alumni can use career services,
  upskilling opportunities, self-paced asynchronous classes,
  evening/weekend instructor-led classes, micro cohorts, alumni-only
  courses, referrals, resume/LinkedIn updates, interview practice,
  and employer connection support.

Tailor the roadmap based on userType. Each userType has a
different primary goal:
- prospectiveLearner or prospective_learner: the goal is being
  accepted into Per Scholas. Recommendations should focus on
  readiness, application preparation, interview preparation,
  prerequisite skills, confidence, and choosing a suitable track.
- currentLearner or current_learner: the goal is graduating from
  Per Scholas. Recommendations should focus on mastering the
  curriculum, completing assignments and projects, building a
  portfolio, using learner support, and staying on track through
  graduation.
- alumna: the goal is getting employment by using Per Scholas
  upskilling and support services. Recommendations should focus
  on job search strategy, resume and LinkedIn updates, interview
  practice, employer connections, continued skill-building, and
  career services support.

Make the destination, currentStage, nextStep, and waypoints reflect
the user's specific userType goal instead of giving generic career
advice.

Your response should be only valid JSON matching the following dictionary,
but replace the values of the dictionary by appropriate advice.
Use double quotes around every key and string value. Do not wrap the
JSON in markdown fences and do not include any text before or after it.
The frontend roadmap expects multiple waypoint cards, so force
the model to return waypoints as a structured array instead of
a single sentence or object.
The waypoints field must be a JSON array with no fewer than 3
and no more than 6 waypoint objects. Do not return waypoints as
a string. Each waypoint object must include title, description,
category, status, and tasks. The tasks field must be a JSON array
with 3 to 6 concrete skill or to-do objects that are specific to
that waypoint and userType goal. Each task object must include
title and completed. Use these tasks to represent the actual work
or skills the learner must complete for that waypoint. Use
"in-progress" for the first waypoint and "locked" for the remaining
waypoints unless a waypoint is already completed.
{
  "destination": "What is a possible career for the user?",
  "currentStage": "How much job experience might the user have?",
  "nextStep": "What should the user do next?",
  "waypoints": [
    {
      "title": "The title of the first learning milestone",
      "description": "A short explanation of what the user should do for this milestone",
      "category": "A short category such as Orientation, Foundations, Technical Skills, Projects, Advanced Skills, or Career Launch",
      "status": "in-progress",
      "tasks": [
        {
          "title": "A concrete skill or to-do item for this waypoint",
          "completed": true
        },
        {
          "title": "Another concrete skill or to-do item for this waypoint",
          "completed": false
        },
        {
          "title": "Another concrete skill or to-do item for this waypoint",
          "completed": false
        }
      ]
    },
    {
      "title": "The title of the next learning milestone",
      "description": "A short explanation of what the user should do for this milestone",
      "category": "A short category such as Orientation, Foundations, Technical Skills, Projects, Advanced Skills, or Career Launch",
      "status": "locked",
      "tasks": [
        {
          "title": "A concrete skill or to-do item for this waypoint",
          "completed": false
        },
        {
          "title": "Another concrete skill or to-do item for this waypoint",
          "completed": false
        },
        {
          "title": "Another concrete skill or to-do item for this waypoint",
          "completed": false
        }
      ]
    },
    {
      "title": "The title of the final learning milestone",
      "description": "A short explanation of what the user should do for this milestone",
      "category": "A short category such as Orientation, Foundations, Technical Skills, Projects, Advanced Skills, or Career Launch",
      "status": "locked",
      "tasks": [
        {
          "title": "A concrete skill or to-do item for this waypoint",
          "completed": false
        },
        {
          "title": "Another concrete skill or to-do item for this waypoint",
          "completed": false
        },
        {
          "title": "Another concrete skill or to-do item for this waypoint",
          "completed": false
        }
      ]
    }
  ]
}
