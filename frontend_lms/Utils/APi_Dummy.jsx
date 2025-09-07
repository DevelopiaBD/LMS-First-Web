import React from 'react'
import img1 from "/images/THUMB12.jpg";
import img2 from "/images/thumb14.jpg";
import img3 from "/images/thumb16.jpg";







const courseData = 
[
  {
    "title": "JavaScript Basics",
    "description": "Learn the fundamentals of JavaScript, the language of the web.",
    "thumbnail": img1,
    "category": "Programming",
    "level": "Beginner",
    "instructor": "Muhammad Abir",
    "lectures": 
    ["https://res.cloudinary.com/drqvcjakw/video/upload/v1755068275/122810-726391893_tiny_cvdaz1.mp4",
      "https://res.cloudinary.com/drqvcjakw/video/upload/v1755068275/6498-192502216_tiny_f59z1l.mp4",
      "https://res.cloudinary.com/drqvcjakw/video/upload/v1755068274/128648-741747833_tiny_xab5vv.mp4",
      "https://res.cloudinary.com/drqvcjakw/video/upload/v1755068382/%E0%A6%AF%E0%A7%81%E0%A6%AC%E0%A6%95%E0%A7%87%E0%A6%B0_%E0%A6%AE%E0%A6%9E%E0%A7%8D%E0%A6%9A_%E0%A6%AD%E0%A6%BE%E0%A6%B7%E0%A6%A3_%E0%A6%B6%E0%A7%81%E0%A6%B0%E0%A7%81_r9xlo1.mp4",
      "https://res.cloudinary.com/drqvcjakw/video/upload/v1755068273/72712-544133713_tiny_ai1anq.mp4",
      "https://res.cloudinary.com/drqvcjakw/video/upload/v1755068383/%E0%A6%AA%E0%A6%B0%E0%A6%AC%E0%A6%B0%E0%A7%8D%E0%A6%A4%E0%A7%80_%E0%A6%A6%E0%A7%83%E0%A6%B6%E0%A7%8D%E0%A6%AF%E0%A7%87%E0%A6%B0_%E0%A6%AD%E0%A6%BF%E0%A6%A1%E0%A6%BF%E0%A6%93_%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A6%A6%E0%A6%BE%E0%A6%A8_nonajj.mp4"




    ]
    ,
    "isApproved": true,
    "price": 20,
    "createdAt": "2025-08-01T10:30:00Z",
    _id:"64f123abc456def789000101",
  },
  {
    "title": "Advanced Node.js",
    "description": "Master backend development with Node.js and Express.",
    "thumbnail": img2,
    "category": "Backend Development",
    "level": "Advanced",
    "instructor": "Muhammad Abir",
    "lectures": ["64f123abc456def789000103", "64f123abc456def789000104",  8,8,8,88,88,8],
    "isApproved": false,
    "price": 50,
    "createdAt": "2025-08-02T09:00:00Z",
    _id:"64f123abc456def789000103",
  },
  {
    "title": "React for Beginners",
    "description": "A complete introduction to building user interfaces with React.",
    "thumbnail": img3,
    "category": "Frontend Development",
    "level": "Beginner",
    "instructor": "Muhammad Abir",
    "lectures": ["64f123abc456def789000105", "64f123abc456def789000106"],
    "isApproved": true,
    "price": 30,
    "createdAt": "2025-08-03T14:15:00Z",
    _id:"64f123abc456def789000105",
  },
  {
    "title": "Full-Stack MERN Bootcamp",
    "description": "Learn MongoDB, Express, React, and Node in one complete course.",
    "thumbnail": "https://example.com/thumbnails/mern-bootcamp.jpg",
    "category": "Full Stack Development",
    "level": "Intermediate",
    "instructor": "Muhammad Abir",
    "lectures": ["64f123abc456def789000107", "64f123abc456def789000108",0,0,0,0,0,0,0,0,0,0],
    "isApproved": true,
    "price": 80,
    "createdAt": "2025-08-04T08:45:00Z",
    _id:"64f123abc456def789000107",
  },
  {
    "title": "Python for Data Science",
    "description": "Learn how to use Python for data analysis and visualization.",
    "thumbnail": "https://example.com/thumbnails/python-data.jpg",
    "category": "Data Science",
    "level": "Intermediate",
    "instructor": "Muhammad Abir",
    "lectures": ["64f123abc456def789000109", "64f123abc456def789000110"],
    "isApproved": false,
    "price": 40,
    "createdAt": "2025-08-05T12:10:00Z",
    _id:"64f123abc456def789000109",
  },
  {
    "title": "UI/UX Design Essentials",
    "description": "Learn the core principles of user interface and user experience design.",
    "thumbnail": "https://example.com/thumbnails/uiux.jpg",
    "category": "Design",
    "level": "Beginner",
    "instructor": "Muhammad Abir",
    "lectures": ["64f123abc456def789000111", "64f123abc456def789000112"],
    "isApproved": true,
    "price": 25,
    "createdAt": "2025-08-06T11:00:00Z",
    _id:"64f123abc456def789000111",
  },
  {
    "title": "Machine Learning A-Z",
    "description": "Comprehensive guide to machine learning algorithms and models.",
    "thumbnail": "https://example.com/thumbnails/ml.jpg",
    "category": "Artificial Intelligence",
    "level": "Advanced",
    "instructor": "Muhammad Abir",
    "lectures": ["64f123abc456def789000113", "64f123abc456def789000114"],
    "isApproved": false,
    "price": 100,
    "createdAt": "2025-08-07T16:40:00Z",
    _id:"64f123abc456def789000113",
  },
  {
    "title": "Cybersecurity Basics",
    "description": "Protect systems and networks with essential cybersecurity skills.",
    "thumbnail": "https://example.com/thumbnails/cybersecurity.jpg",
    "category": "Security",
    "level": "Beginner",
    "instructor": "Muhammad Abir",
    "lectures": ["64f123abc456def789000115", "64f123abc456def789000116"],
    "isApproved": true,
    "price": 35,
    "createdAt": "2025-08-08T18:20:00Z",
    _id:"64f123abc456def789000115",
  },
  {
    "title": "DevOps with AWS",
    "description": "Automate deployments and manage infrastructure using AWS services.",
    "thumbnail": "https://example.com/thumbnails/devops-aws.jpg",
    "category": "DevOps",
    "level": "Intermediate",
    "instructor": "Muhammad Abir",
    "lectures": ["64f123abc456def789000117", "64f123abc456def789000118"],
    "isApproved": true,
    "price": 60,
    "createdAt": "2025-08-09T07:55:00Z",
    _id:"64f123abc456def789000117",
  },
  {
    "title": "Mobile App Development with Flutter",
    "description": "Create beautiful mobile applications using Flutter and Dart.",
    "thumbnail": "https://example.com/thumbnails/flutter.jpg",
    "category": "Mobile Development",
    "level": "Beginner",
    "instructor": "Muhammad Abir",
    "lectures": ["64f123abc456def789000119", "64f123abc456def789000120"],
    "isApproved": false,
    "price": 45,
    "createdAt": "2025-08-10T15:35:00Z",
    _id:"64f123abc456def789000119",
  }
]




export const API  = () => {

  return courseData;
  
}
